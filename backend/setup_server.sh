#!/bin/bash
# Server Setup Script für Hetzner
# Dieses Script auf dem Server ausführen NACH dem Hochladen der Dateien

echo "🚀 Join Backend - Production Setup"
echo "=================================="

# 1. Umgebungsvariable für Production setzen
echo ""
echo "📝 Setze Production-Umgebung..."
export DJANGO_ENV=production

# Permanent in .bashrc eintragen (damit es nach Neustart erhalten bleibt)
if ! grep -q "DJANGO_ENV=production" ~/.bashrc; then
    echo "export DJANGO_ENV=production" >> ~/.bashrc
    echo "✅ DJANGO_ENV=production zu ~/.bashrc hinzugefügt"
fi

# 2. Python Virtual Environment erstellen
echo ""
echo "🐍 Erstelle Virtual Environment..."
python3 -m venv env
source env/bin/activate

# 3. Dependencies installieren
echo ""
echo "📦 Installiere Python-Pakete..."
pip install --upgrade pip
pip install -r requirements.txt

# 4. Django Setup
echo ""
echo "⚙️ Django Setup..."
python manage.py migrate
python manage.py collectstatic --noinput

# 5. Admin-User erstellen (optional)
echo ""
echo "👤 Möchten Sie einen Admin-User erstellen? (j/n)"
read -r create_admin
if [ "$create_admin" = "j" ]; then
    python manage.py createsuperuser
fi

# 6. Test ob Production Mode aktiv ist
echo ""
echo "🧪 Teste Production-Konfiguration..."
python manage.py check

echo ""
echo "✅ Setup abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. Gunicorn Service einrichten (siehe DEPLOYMENT.md)"
echo "2. Nginx konfigurieren"
echo "3. SSL-Zertifikat mit Let's Encrypt"
