#!/usr/bin/env bash
set -euo pipefail

HOST="${HOST:-your-hostname.com}"
USER="${USER:-your-ftp-user}"
PASS="${PASS:-your-ftp-password}"
REMOTE_DIR="${REMOTE_DIR:-/public_html}"

if [[ "$HOST" == "your-hostname.com" || "$USER" == "your-ftp-user" || "$PASS" == "your-ftp-password" ]]; then
  echo "Update the HOST, USER, and PASS values in deploy.sh before running it."
  exit 1
fi

lftp -e "set ftp:ssl-allow no; open ftp://$USER:$PASS@$HOST; mirror -R --delete ./ $REMOTE_DIR; bye"

echo "Upload complete. Visit your domain to view the portfolio."
