#!/usr/bin/env bash
set -euo pipefail

DB_PATH="/var/lib/bob-tickets/tickets.db"
PASSPHRASE_FILE="/home/gh-deploy/.config/bob-backup/passphrase"
REMOTE="gdrive:BobPortfolioBackups"
RETENTION_DAYS=30

umask 077
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

for path in "$DB_PATH" "$PASSPHRASE_FILE"; do
  if [ ! -r "$path" ]; then
    echo "backup: required file is not readable: $path" >&2
    exit 1
  fi
done

timestamp="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
plain="$WORKDIR/tickets-$timestamp.db"
encrypted="$WORKDIR/tickets-$timestamp.db.gpg"

python3 - "$DB_PATH" "$plain" <<'PY'
import sqlite3
import sys

source = sqlite3.connect(sys.argv[1])
target = sqlite3.connect(sys.argv[2])
with target:
    source.backup(target)
target.close()
source.close()
PY

test -s "$plain"

gpg --batch --yes --pinentry-mode loopback --no-symkey-cache \
  --symmetric --cipher-algo AES256 \
  --passphrase-file "$PASSPHRASE_FILE" \
  --output "$encrypted" "$plain"

test -s "$encrypted"

rclone copyto "$encrypted" "$REMOTE/tickets-$timestamp.db.gpg"

rclone delete "$REMOTE" \
  --min-age "${RETENTION_DAYS}d" \
  --include "tickets-*.db.gpg" \
  --drive-use-trash=false

echo "backup: uploaded tickets-$timestamp.db.gpg ($(stat -c%s "$encrypted") bytes)"
