#!/bin/bash
echo "🔍 Nettoyage des processus Node sur port 3000..."
PID=$(lsof -ti :3000)
if [ -n "$PID" ]; then
  kill -9 $PID
  echo "✅ Port 3000 libéré (PID $PID tué)"
else
  echo "ℹ️ Aucun processus sur port 3000"
fi

echo "🔑 Chargement des clés depuis .env..."
if [ -f ~/PEGINTICHAT/.env ]; then
  set -a
  source ~/PEGINTICHAT/.env
  set +a
  echo "✅ Fichier .env chargé"
else
  echo "⚠️ Aucun fichier .env trouvé"
fi

echo "🔄 Relance PM2..."
pm2 restart pegintichat --update-env
pm2 restart bo-oivini-tunnel --update-env
pm2 save

echo "🚀 PEGINTICHAT relancé avec clés API et tunnel Cloudflare"
