#!/usr/bin/env python3
import json
import os
import re
import secrets
import signal
import smtplib
import sqlite3
import ssl
import threading
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

DB_PATH = os.environ.get("TICKETS_DB", "/var/lib/bob-tickets/tickets.db")
HOST = os.environ.get("TICKETS_HOST", "127.0.0.1")
PORT = int(os.environ.get("TICKETS_PORT", "8787"))

SMTP_USER = os.environ.get("SMTP_USER", "").strip()
SMTP_PASS = os.environ.get("SMTP_PASS", "").strip()
NOTIFY_TO = os.environ.get("NOTIFY_TO", "").strip() or SMTP_USER

MAX_BODY_BYTES = 16 * 1024
EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
TICKET_PATH_RE = re.compile(r"^/api/admin/tickets/([A-Za-z0-9-]+)$")

RATE_LOCK = threading.Lock()
RATE_LAST: dict[str, float] = {}
RATE_HOURLY: dict[str, list[float]] = {}


@contextmanager
def db():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    directory = os.path.dirname(DB_PATH)
    if directory:
        os.makedirs(directory, exist_ok=True)
    with db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS tickets (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'open',
                ip TEXT
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC)"
        )
        conn.commit()


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def new_ticket_id():
    date = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"BOB-{date}-{secrets.token_hex(4).upper()}"


def clean_line(value, limit):
    if not isinstance(value, str):
        return ""
    return " ".join(value.split())[:limit]


def clean_message(value, limit):
    if not isinstance(value, str):
        return ""
    return value.strip()[:limit]


def valid_email(value):
    return bool(value) and len(value) <= 200 and bool(EMAIL_RE.match(value))


def client_ip(handler):
    forwarded = handler.headers.get("X-Real-IP", "").strip()
    if forwarded:
        return forwarded[:64]
    return handler.client_address[0][:64]


def allow_request(ip):
    now = time.monotonic()
    with RATE_LOCK:
        last = RATE_LAST.get(ip, 0.0)
        if now - last < 15:
            return False, "Please wait a moment before sending another ticket."

        recent = [stamp for stamp in RATE_HOURLY.get(ip, []) if now - stamp < 3600]
        if len(recent) >= 10:
            return False, "Too many tickets from this address. Please try again later."

        recent.append(now)
        RATE_HOURLY[ip] = recent
        RATE_LAST[ip] = now

        if len(RATE_HOURLY) > 4096:
            for key in [key for key, stamps in RATE_HOURLY.items() if not stamps or now - stamps[-1] > 3600]:
                RATE_HOURLY.pop(key, None)
                RATE_LAST.pop(key, None)

    return True, ""


def send_notification(ticket):
    if not (SMTP_USER and SMTP_PASS and NOTIFY_TO):
        return

    def worker():
        try:
            message = EmailMessage()
            subject = ticket["subject"][:120]
            message["Subject"] = f"[Bob Portfolio] {subject} ({ticket['id']})"
            message["From"] = SMTP_USER
            message["To"] = NOTIFY_TO
            message["Reply-To"] = ticket["email"]
            message.set_content(
                "新的网站工单\n\n"
                f"工单号: {ticket['id']}\n"
                f"时间: {ticket['created_at']}\n"
                f"称呼: {ticket['name']}\n"
                f"邮箱: {ticket['email']}\n"
                f"主题: {ticket['subject']}\n\n"
                f"{ticket['message']}\n"
            )
            with smtplib.SMTP("smtp.gmail.com", 587, timeout=20) as smtp:
                smtp.starttls(context=ssl.create_default_context())
                smtp.login(SMTP_USER, SMTP_PASS)
                smtp.send_message(message)
        except Exception as exc:  # noqa: BLE001 - notification must never break the request
            print(f"ticket notification failed: {exc}", flush=True)

    threading.Thread(target=worker, daemon=True).start()


class TicketsHandler(BaseHTTPRequestHandler):
    server_version = "BobTickets/1.0"
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        print(f"{self.address_string()} - {fmt % args}", flush=True)

    def _json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def _error(self, status, message):
        self._json(status, {"ok": False, "error": message})

    def _read_json(self):
        length_header = self.headers.get("Content-Length", "")
        try:
            length = int(length_header)
        except ValueError:
            raise ValueError("Missing request body.") from None
        if length <= 0:
            raise ValueError("Missing request body.")
        if length > MAX_BODY_BYTES:
            raise ValueError("Request body is too large.")
        raw = self.rfile.read(length)
        try:
            payload = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            raise ValueError("Invalid JSON body.") from None
        if not isinstance(payload, dict):
            raise ValueError("Invalid request body.")
        return payload

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/health":
            self._json(200, {"ok": True, "service": "bob-tickets"})
            return

        if parsed.path == "/api/admin/tickets":
            status = (parse_qs(parsed.query).get("status") or [""])[0]
            if status and status not in {"open", "closed"}:
                self._error(400, "Invalid status filter.")
                return

            query = (
                "SELECT id, created_at, name, email, subject, message, status, ip "
                "FROM tickets"
            )
            params: list[str] = []
            if status:
                query += " WHERE status = ?"
                params.append(status)
            query += " ORDER BY created_at DESC LIMIT 100"

            with db() as conn:
                rows = conn.execute(query, params).fetchall()
                counts = {"open": 0, "closed": 0}
                for row in conn.execute(
                    "SELECT status, COUNT(*) AS total FROM tickets GROUP BY status"
                ):
                    if row["status"] in counts:
                        counts[row["status"]] = row["total"]

            self._json(
                200,
                {
                    "ok": True,
                    "tickets": [
                        {
                            "id": row["id"],
                            "createdAt": row["created_at"],
                            "name": row["name"],
                            "email": row["email"],
                            "subject": row["subject"],
                            "message": row["message"],
                            "status": row["status"],
                            "ip": row["ip"],
                        }
                        for row in rows
                    ],
                    "counts": counts,
                },
            )
            return

        self._error(404, "Not found.")

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/tickets":
            self._create_ticket()
            return

        match = TICKET_PATH_RE.match(parsed.path)
        if match:
            self._update_ticket(match.group(1))
            return

        self._error(404, "Not found.")

    def do_DELETE(self):
        parsed = urlparse(self.path)
        match = TICKET_PATH_RE.match(parsed.path)
        if not match:
            self._error(404, "Not found.")
            return

        ticket_id = match.group(1)
        with db() as conn:
            deleted = conn.execute(
                "DELETE FROM tickets WHERE id = ?", (ticket_id,)
            ).rowcount
            conn.commit()
        if deleted == 0:
            self._error(404, "Ticket not found.")
            return
        self._json(200, {"ok": True})

    def _create_ticket(self):
        content_type = self.headers.get("Content-Type", "").split(";")[0].strip().lower()
        if content_type != "application/json":
            self._error(415, "Content-Type must be application/json.")
            return

        try:
            payload = self._read_json()
        except ValueError as exc:
            self._error(400, str(exc))
            return

        if clean_line(payload.get("website"), 200):
            fake_id = new_ticket_id()
            self._json(201, {"ok": True, "ticket": {"id": fake_id, "createdAt": now_iso()}})
            return

        name = clean_line(payload.get("name"), 100)
        email = clean_line(payload.get("email"), 200)
        subject = clean_line(payload.get("subject"), 200) or "Website contact"
        message = clean_message(payload.get("message"), 5000)

        if not name:
            self._error(400, "Please enter your name.")
            return
        if not valid_email(email):
            self._error(400, "Please enter a valid email address.")
            return
        if len(message) < 5:
            self._error(400, "Please write a slightly longer message.")
            return

        ip = client_ip(self)
        allowed, reason = allow_request(ip)
        if not allowed:
            self._error(429, reason)
            return

        ticket_id = new_ticket_id()
        created_at = now_iso()
        ticket = {
            "id": ticket_id,
            "created_at": created_at,
            "name": name,
            "email": email,
            "subject": subject,
            "message": message,
            "status": "open",
            "ip": ip,
        }

        with db() as conn:
            conn.execute(
                """
                INSERT INTO tickets (id, created_at, name, email, subject, message, status, ip)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    ticket_id,
                    created_at,
                    name,
                    email,
                    subject,
                    message,
                    "open",
                    ip,
                ),
            )
            conn.commit()

        send_notification(ticket)
        self._json(201, {"ok": True, "ticket": {"id": ticket_id, "createdAt": created_at}})

    def _update_ticket(self, ticket_id):
        try:
            payload = self._read_json()
        except ValueError as exc:
            self._error(400, str(exc))
            return

        status = payload.get("status")
        if status not in {"open", "closed"}:
            self._error(400, "Invalid ticket status.")
            return

        with db() as conn:
            updated = conn.execute(
                "UPDATE tickets SET status = ? WHERE id = ?", (status, ticket_id)
            ).rowcount
            conn.commit()
        if updated == 0:
            self._error(404, "Ticket not found.")
            return
        self._json(200, {"ok": True})


def main():
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), TicketsHandler)
    server.daemon_threads = True
    print(f"bob-tickets listening on {HOST}:{PORT}", flush=True)

    def shutdown(_signum, _frame):
        threading.Thread(target=server.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, shutdown)
    signal.signal(signal.SIGINT, shutdown)
    server.serve_forever()


if __name__ == "__main__":
    main()
