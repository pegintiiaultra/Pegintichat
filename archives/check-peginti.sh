#!/data/data/com.termux/files/usr/bin/bash

echo "🔎 Vérification doctrinale PEGINTICHAT..."

# Test ping local
LOCAL=$(curl -s http://localhost:3000/ping)
if [[ $LOCAL == *"ONLINE"* ]]; then
  echo "✅ Local PEGINTICHAT ONLINE : $LOCAL"
else
  echo "❌ Local PEGINTICHAT OFFLINE"
fi

# Test ping externe
EXTERNAL=$(curl -s https://chat.pegintichat.online/ping)
if [[ $EXTERNAL == *"ONLINE"* ]]; then
  echo "✅ Externe PEGINTICHAT ONLINE : $EXTERNAL"
else
  echo "❌ Externe PEGINTICHAT OFFLINE"
fi

# Vérifie port 3000
PORT=$(lsof -i:3000 | grep LISTEN)
if [[ -n "$PORT" ]]; then
  echo "✅ Port 3000 actif : $PORT"
else
  echo "❌ Port 3000 inactif"
fi

echo "📊 Statut PM2 :"
pm2 list
