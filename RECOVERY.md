# Recovery

This project is designed to survive a local PC reinstall.

## Rule

- GitHub is the source of truth for code and deploy configs.
- Runtime data lives on the VPS; encrypted backups live in Google Drive.
- Never keep the only copy of a secret or config on the local PC.

## Live setup

- Site: https://kqin517.top
- VPS: `34.4.108.208` (Google Cloud, `us-west1-b`, instance `instance-20261022-001309`)
- SSH: `kqin517` (passwordless sudo), port 22
- Deploy: push to `main` -> GitHub Actions -> `/var/www/kqin517.top`
- Ticket service: `bob-tickets.service`; database `/var/lib/bob-tickets/tickets.db`
- Admin inbox: https://kqin517.top/admin/ (credentials are not stored in this repo)
- Backups: Google Drive `BobPortfolioBackups`; daily around 03:15-03:25 China time; 30-day retention; GPG AES-256
- Server configs: `deploy/` (Nginx, systemd, sudoers, backup script)

## After reinstalling the PC

1. Clone the repo and sign in to GitHub.
2. Open Google Drive -> `BobPortfolioBackups/recovery/` and download the latest `bob-recovery-kit-*.tar.gz.gpg`.
3. Decrypt it with the backup passphrase (kept in a password manager or offline):

   ```bash
   gpg --output bob-recovery-kit.tar.gz --decrypt bob-recovery-kit-*.tar.gz.gpg
   tar -xzf bob-recovery-kit.tar.gz
   ```

4. Restore the recovery SSH key:

   ```bash
   mkdir -p ~/.ssh
   cp bob-recovery-2026 ~/.ssh/bob-recovery-2026
   chmod 600 ~/.ssh/bob-recovery-2026
   ssh -i ~/.ssh/bob-recovery-2026 kqin517@34.4.108.208
   ```

5. Read `README.txt` in the kit for the admin login, rclone config, and ticket restore steps.
6. Push code changes to `main`; GitHub Actions handles deployment. No local-only tooling is required.

## Important

- The recovery kit contains secrets. Keep it encrypted; do not commit it.
- The backup passphrase is not in the kit. Keep it in a password manager or offline.
- The VPS is small. Keep only Nginx, `bob-tickets`, and the daily `bob-backup` oneshot; do not add Docker, a database server, or a control panel unless the VPS is resized.
- If the kit is exposed, rotate the admin password and remove the recovery public key from `/home/kqin517/.ssh/authorized_keys`.
