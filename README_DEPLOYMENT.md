# 🚀 AUTOMATISCHE PRODUCTION/DEVELOPMENT ERKENNUNG

## ✨ Wie funktioniert es?

Django erkennt **automatisch**, ob es auf dem Production-Server oder auf localhost läuft!

### 🏠 Development (Ihr lokaler PC)
```
💻 Running in DEVELOPMENT mode
```
- **DEBUG = True** (detaillierte Fehlermeldungen)
- **HTTP** erlaubt (http://localhost:5500)
- Unsicherer SECRET_KEY (ok für Development)
- ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '*']

### 🌍 Production (Hetzner Server)
```
🚀 Running in PRODUCTION mode
```
- **DEBUG = False** (keine sensiblen Infos)
- **HTTPS** erzwungen (https://join.bilal-alac.de)
- Sicherer SECRET_KEY
- ALLOWED_HOSTS = ['join.bilal-alac.de', ...]
- Zusätzliche Sicherheits-Headers

---

## 🎯 Server-Setup (einmalig nach Upload)

### Schritt 1: Projekt auf Server hochladen
```bash
# Per Git (empfohlen)
git clone <ihr-repo> /var/www/join_backend
cd /var/www/join_backend

# ODER per SFTP/SCP
# Laden Sie alle Dateien nach /var/www/join_backend
```

### Schritt 2: Production-Mode aktivieren
```bash
# Umgebungsvariable setzen (WICHTIG!)
export DJANGO_ENV=production

# Permanent machen (überlebt Neustarts)
echo "export DJANGO_ENV=production" >> ~/.bashrc
```

### Schritt 3: Setup-Script ausführen
```bash
# Script ausführbar machen
chmod +x setup_server.sh

# Script ausführen
./setup_server.sh
```

**ODER manuell:**
```bash
# Virtual Environment
python3 -m venv env
source env/bin/activate

# Dependencies
pip install -r requirements.txt

# Django Setup
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser  # optional

# Test
python manage.py check
# Sollte zeigen: 🚀 Running in PRODUCTION mode
```

### Schritt 4: Gunicorn Service (siehe DEPLOYMENT.md)
```bash
# Gunicorn installieren
pip install gunicorn

# Service erstellen
sudo nano /etc/systemd/system/join-backend.service
```

Inhalt:
```ini
[Unit]
Description=Join Backend
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/join_backend
Environment="PATH=/var/www/join_backend/env/bin"
Environment="DJANGO_ENV=production"
ExecStart=/var/www/join_backend/env/bin/gunicorn \
          --workers 3 \
          --bind unix:/var/www/join_backend/gunicorn.sock \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

Service starten:
```bash
sudo systemctl daemon-reload
sudo systemctl start join-backend
sudo systemctl enable join-backend
sudo systemctl status join-backend
```

### Schritt 5: Nginx als Reverse Proxy
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/join
```

Konfiguration:
```nginx
server {
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

    listen 80;
}
```

Aktivieren:
```bash
sudo ln -s /etc/nginx/sites-available/join /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Schritt 6: SSL mit Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d join.bilal-alac.de -d bilal-alac.de -d www.bilal-alac.de
```

---

## 🔄 Updates deployen

### Wenn Sie Code-Änderungen gemacht haben:

**Auf Ihrem PC:**
```bash
# Committen und pushen (falls Git)
git add .
git commit -m "Update"
git push
```

**Auf dem Server:**
```bash
cd /var/www/join_backend

# Code aktualisieren
git pull  # falls Git

# Virtual Environment aktivieren
source env/bin/activate

# Dependencies aktualisieren (falls requirements.txt geändert)
pip install -r requirements.txt

# Migrations & Static files
python manage.py migrate
python manage.py collectstatic --noinput

# Service neu starten
sudo systemctl restart join-backend

# Status prüfen
sudo systemctl status join-backend
```

---

## 🧪 Testen

### Lokal (Development):
```bash
python manage.py runserver
# Öffnen: http://127.0.0.1:8000
# Sollte zeigen: 💻 Running in DEVELOPMENT mode
```

### Server (Production):
```bash
# SSH auf Server
ssh root@91.99.205.96

cd /var/www/join_backend
source env/bin/activate
python manage.py check
# Sollte zeigen: 🚀 Running in PRODUCTION mode
```

### Browser-Test:
- **Development:** http://localhost:8000
- **Production:** https://join.bilal-alac.de

---

## ❓ Troubleshooting

### "Immer noch Development-Mode auf Server"
```bash
# Prüfen ob Variable gesetzt ist:
echo $DJANGO_ENV  # sollte "production" zeigen

# Falls nicht, setzen:
export DJANGO_ENV=production
echo "export DJANGO_ENV=production" >> ~/.bashrc
```

### "Forbidden (403)"
```bash
# Berechtigungen setzen:
sudo chown -R www-data:www-data /var/www/join_backend
sudo chmod -R 755 /var/www/join_backend
```

### "Bad Gateway (502)"
```bash
# Gunicorn läuft nicht:
sudo systemctl status join-backend
sudo systemctl restart join-backend

# Logs checken:
sudo journalctl -u join-backend -f
```

### Service startet nicht
```bash
# Logs anschauen:
sudo journalctl -u join-backend -n 50

# Manuell testen:
cd /var/www/join_backend
source env/bin/activate
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

---

## 🎉 Vorteile dieser Lösung

✅ **Keine manuelle Konfiguration** - automatisch erkannt  
✅ **Keine .env-Datei Management** - eine Umgebungsvariable reicht  
✅ **Kein Risiko** - Development ist sicherer Default  
✅ **Updates ohne Probleme** - settings.py bleibt unverändert  
✅ **Ein Code für alles** - lokal & server verwenden denselben Code  

---

## 📝 Wichtige Dateien

- `backend/settings.py` - Automatische Erkennung eingebaut
- `setup_server.sh` - Script für Server-Setup
- `DEPLOYMENT.md` - Detaillierte Deployment-Anleitung
- `requirements.txt` - Python-Dependencies

**Auf Server NICHT committen:**
- `db.sqlite3` - Lokale Datenbank
- `__pycache__/` - Python Cache
- `.pyc` Dateien - Kompilierte Python-Dateien

**Keine .env Dateien mehr nötig!** Die Umgebungsvariable `DJANGO_ENV` steuert alles.
