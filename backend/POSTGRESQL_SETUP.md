# 🐘 PostgreSQL Setup für Production

## Warum PostgreSQL?
- ✅ Professionelle Datenbank für Production
- ✅ Bessere Performance bei vielen Nutzern
- ✅ Bessere Skalierbarkeit
- ✅ Production-Standard

---

## 📋 Setup auf Hetzner Server

### **Schritt 1: PostgreSQL installieren**

```bash
# Als root auf dem Server (nach ssh hetzner)
apt update
apt install postgresql postgresql-contrib -y
```

---

### **Schritt 2: PostgreSQL starten**

```bash
systemctl start postgresql
systemctl enable postgresql
systemctl status postgresql
```

**Sollte zeigen:** `active (running)`

---

### **Schritt 3: Datenbank und User erstellen**

```bash
# Als postgres-User wechseln
sudo -u postgres psql
```

**Jetzt sind Sie in der PostgreSQL-Konsole. Führen Sie aus:**

```sql
-- Datenbank erstellen
CREATE DATABASE join_db;

-- User erstellen mit Passwort
CREATE USER join_user WITH PASSWORD 'IhrSicheresPasswort123!';

-- Alle Rechte für die Datenbank geben
ALTER ROLE join_user SET client_encoding TO 'utf8';
ALTER ROLE join_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE join_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE join_db TO join_user;

-- PostgreSQL 15+ braucht zusätzlich:
\c join_db
GRANT ALL ON SCHEMA public TO join_user;

-- Beenden
\q
```

**Hinweis:** Ersetzen Sie `IhrSicheresPasswort123!` mit einem starken Passwort!

---

### **Schritt 4: .env Datei auf dem Server erstellen**

```bash
cd /var/www/join/backend
nano .env
```

**Inhalt:**
```env
DJANGO_ENV=production

# PostgreSQL Datenbank
DB_NAME=join_db
DB_USER=join_user
DB_PASSWORD=IhrSicheresPasswort123!
DB_HOST=localhost
DB_PORT=5432
```

**Speichern:** `STRG+O` → Enter → `STRG+X`

**Wichtig:** Verwenden Sie das gleiche Passwort wie in Schritt 3!

---

### **Schritt 5: Virtual Environment aktivieren & Dependencies installieren**

```bash
cd /var/www/join/backend
source env/bin/activate

# Neue dependencies installieren (inkl. psycopg2)
pip install -r requirements.txt
```

---

### **Schritt 6: Datenbank-Tabellen erstellen**

```bash
# Test ob PostgreSQL-Verbindung funktioniert
python manage.py check --database default

# Tabellen erstellen
python manage.py migrate
```

**Sollte zeigen:** Verschiedene `Applying...` Meldungen und am Ende `OK`

---

### **Schritt 7: Admin-User erstellen**

```bash
python manage.py createsuperuser
```

Geben Sie Username, Email und Passwort ein.

---

### **Schritt 8: Static Files sammeln**

```bash
python manage.py collectstatic --noinput
```

---

## ✅ Testen

### **PostgreSQL-Verbindung testen:**

```bash
python manage.py dbshell
```

**Sollte Sie in die PostgreSQL-Konsole bringen.** Mit `\q` beenden.

### **Tabellen anzeigen:**

```bash
sudo -u postgres psql -d join_db -c "\dt"
```

**Sollte alle Django-Tabellen anzeigen** (auth_user, join_app_*, etc.)

---

## 🔄 Lokale Daten zu Server migrieren (optional)

Falls Sie schon Daten in Ihrer lokalen SQLite-Datenbank haben:

### **Auf lokalem PC:**

```powershell
# Daten exportieren
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 4 > data.json

# Auf Server hochladen
scp data.json hetzner:/var/www/join/backend/
```

### **Auf Server:**

```bash
cd /var/www/join/backend
source env/bin/activate

# Daten importieren
python manage.py loaddata data.json
```

---

## 🛠️ PostgreSQL Management Befehle

### **PostgreSQL-Konsole öffnen:**
```bash
sudo -u postgres psql
```

### **Datenbanken anzeigen:**
```sql
\l
```

### **Zu Datenbank verbinden:**
```sql
\c join_db
```

### **Tabellen anzeigen:**
```sql
\dt
```

### **User anzeigen:**
```sql
\du
```

### **Alle Daten aus Tabelle löschen:**
```sql
TRUNCATE TABLE tablename CASCADE;
```

### **Datenbank löschen (ACHTUNG!):**
```sql
DROP DATABASE join_db;
```

---

## 🔐 Sicherheit

### **PostgreSQL Firewall-Regeln (falls externe Verbindung):**

**NUR wenn Sie von außen auf PostgreSQL zugreifen wollen (normalerweise NICHT empfohlen):**

```bash
# UFW Firewall
ufw allow 5432/tcp
```

**Standard:** PostgreSQL sollte nur von localhost erreichbar sein (sicherer).

---

## 📊 Backup erstellen

### **Datenbank sichern:**
```bash
sudo -u postgres pg_dump join_db > backup_$(date +%Y%m%d).sql
```

### **Backup wiederherstellen:**
```bash
sudo -u postgres psql join_db < backup_20260212.sql
```

---

## 🐛 Troubleshooting

### **Fehler: "Peer authentication failed"**

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Ändern Sie:
```
local   all             all                                     peer
```
zu:
```
local   all             all                                     md5
```

Dann PostgreSQL neu starten:
```bash
sudo systemctl restart postgresql
```

---

### **Fehler: "psycopg2 not found"**

```bash
pip install psycopg2-binary
```

---

### **Verbindung testen:**

```bash
psql -U join_user -d join_db -h localhost
# Passwort eingeben
```

---

## 🎉 Nächste Schritte

Nach PostgreSQL-Setup:
1. ✅ Gunicorn Service einrichten
2. ✅ Nginx konfigurieren
3. ✅ SSL-Zertifikat mit Let's Encrypt
4. ✅ Deployment abschließen

Weiter mit der Haupt-Anleitung!
