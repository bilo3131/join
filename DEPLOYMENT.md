# Deployment Anleitung für Hetzner Server

## 🚀 Schritt-für-Schritt Anleitung

### 1. Projekt auf Server hochladen
```bash
# Per SSH auf Server verbinden:
ssh root@91.99.205.96

# Projektverzeichnis erstellen:
mkdir -p /var/www/join_backend
cd /var/www/join_backend
```

### 2. Dateien hochladen
Laden Sie alle Projektdateien hoch (z.B. per SFTP, Git, oder scp):
```bash
# Von Ihrem lokalen PC aus:
scp -r "C:\Code\1. Developerakademie\Backendkurs\1. Projekte\Join\join_backend\*" root@91.99.205.96:/var/www/join_backend/
```

**WICHTIG:** `.env` Datei wird NICHT hochgeladen (ist in .gitignore)!

### 3. Production .env erstellen
```bash
# Auf dem Server:
cd /var/www/join_backend

# .env.production zu .env umbenennen:
cp .env.production .env

# Oder manuell erstellen:
nano .env
```

Inhalt (aus .env.production):
```env
DEBUG=False
SECRET_KEY=r7x+%6ei(3f71%lp9(-!6*zteim-!(x(1q9mzw0j6hcdn01k=2
ALLOWED_HOSTS=join.bilal-alac.de,bilal-alac.de,www.bilal-alac.de,91.99.205.96
CORS_ALLOWED_ORIGINS=https://join.bilal-alac.de,https://bilal-alac.de,https://www.bilal-alac.de
```

### 4. Python Environment einrichten
```bash
# Python 3 und venv installieren
apt update
apt install python3 python3-pip python3-venv -y

# Virtual Environment erstellen
python3 -m venv env
source env/bin/activate

# Dependencies installieren
pip install -r requirements.txt
```

### 5. Django vorbereiten
```bash
# Static files sammeln
python manage.py collectstatic --noinput

# Migrations anwenden
python manage.py migrate

# Admin-User erstellen (optional)
python manage.py createsuperuser
```

### 6. Gunicorn installieren (WSGI Server)
```bash
pip install gunicorn

# Testen:
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### 7. Systemd Service erstellen (automatischer Start)
```bash
nano /etc/systemd/system/join-backend.service
```

Inhalt:
```ini
[Unit]
Description=Join Backend Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/join_backend
Environment="PATH=/var/www/join_backend/env/bin"
ExecStart=/var/www/join_backend/env/bin/gunicorn \
          --workers 3 \
          --bind unix:/var/www/join_backend/gunicorn.sock \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

Service starten:
```bash
systemctl daemon-reload
systemctl start join-backend
systemctl enable join-backend
systemctl status join-backend
```

### 8. Nginx als Reverse Proxy einrichten
```bash
apt install nginx -y
nano /etc/nginx/sites-available/join
```

Inhalt:
```nginx
server {
    listen 80;
    server_name join.bilal-alac.de bilal-alac.de www.bilal-alac.de;

    location /static/ {
        alias /var/www/join_backend/staticfiles/;
    }

    location / {
        proxy_pass http://unix:/var/www/join_backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktivieren:
```bash
ln -s /etc/nginx/sites-available/join /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 9. SSL mit Let's Encrypt (HTTPS)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d join.bilal-alac.de -d bilal-alac.de -d www.bilal-alac.de
```

### 10. Berechtigungen setzen
```bash
chown -R www-data:www-data /var/www/join_backend
chmod -R 755 /var/www/join_backend
```

## ✅ Fertig!

Ihre Anwendung läuft jetzt auf:
- https://join.bilal-alac.de

## 🔄 Updates deployen

Wenn Sie Änderungen machen:
```bash
# Auf dem Server:
cd /var/www/join_backend
source env/bin/activate

# Code aktualisieren (z.B. per git pull oder neue Dateien hochladen)
git pull  # falls Sie Git verwenden

# Dependencies aktualisieren
pip install -r requirements.txt

# Migrations & Static files
python manage.py migrate
python manage.py collectstatic --noinput

# Service neu starten
systemctl restart join-backend
```

## 🐛 Logs anschauen
```bash
# Django/Gunicorn Logs:
journalctl -u join-backend -f

# Nginx Logs:
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## ⚠️ Wichtige Hinweise

1. **SECRET_KEY**: Ist jetzt sicher generiert und nur in .env auf dem Server
2. **DEBUG=False**: Niemals auf Production DEBUG=True verwenden!
3. **.env Datei**: Wird NICHT in Git committed (steht in .gitignore)
4. **Backups**: Regelmäßig db.sqlite3 sichern
5. **Updates**: Bei Code-Änderungen immer Service neu starten
