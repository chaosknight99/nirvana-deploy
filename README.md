# Sample Portfolio for Hostnirvana Hosting

This project is a simple one-page portfolio website built with HTML, CSS, and JavaScript. It is designed to be deployable as a static website on Hostnirvana hosting or any basic web hosting account.

## Local preview

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then open: http://localhost:8000

## Deploying to Hostnirvana

1. Log in to your Hostnirvana hosting control panel.
2. Open the file manager or FTP section.
3. Upload all files from this folder to the root public directory (often called `public_html`, `www`, or `webroot`).
4. Make sure your `index.html` file is placed at the site root.
5. Visit your domain to confirm the site loads.

## Suggested customization

- Update the name, email, phone number, and portfolio copy in `index.html`.
- Replace placeholder project blocks and colors in `styles.css`.
- Change the contact links in the footer to match your real profile.

## Upload script example

If your hosting account allows FTP or `lftp`, you can automate upload with:

```bash
#!/usr/bin/env bash
set -e
HOST="your-hostname"
USER="your-ftp-user"
PASS="your-ftp-password"
REMOTE_DIR="/public_html"

lftp -e "set ftp:ssl-allow no; open ftp://$USER:$PASS@$HOST; mirror -R ./ $REMOTE_DIR; bye"
```

Save the script as `deploy.sh` and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Notes

This is a static website, so it does not need a framework or build step. It is ideal for a portfolio, personal brand, or simple landing page hosted on Hostnirvana.
