#!/data/data/com.termux/files/usr/bin/bash
# Installation de PEGINTI IA sur Termux (une seule fois).
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Paquets système"
pkg update -y
pkg install -y python git tmux cloudflared openssl

echo "==> Environnement Python"
python -m venv .venv
. .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Configuration (.env)"
if [ ! -f .env ]; then
  PEPPER="$(python - <<'PY'
import secrets; print(secrets.token_hex(32))
PY
)"
  sed "s/CHANGEZ_MOI_AVEC_setup_termux/${PEPPER}/" .env.example > .env
  echo "   .env créé avec un poivre secret aléatoire."
else
  echo "   .env existe déjà : conservé."
fi
chmod 600 .env
mkdir -p data && chmod 700 data

echo "==> Tests"
python -m unittest discover -s tests 2>&1 | tail -4

cat <<'MSG'

Installation terminée.
  1. Éditez .env :  nano .env   (GEMINI_API_KEY, NEWSDATA_API_KEY, SMTP_* si vous en avez)
  2. Créez votre compte administrateur :
         . .venv/bin/activate && python manage.py creer-admin vous@exemple.com VotrePseudo
  3. Lancez : ./lancer.sh        (serveur sur le port 4000 + tunnel Cloudflare, dans tmux)
MSG
