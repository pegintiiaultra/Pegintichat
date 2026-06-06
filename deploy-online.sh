#!/bin/bash
cd ~/PEGINTICHAT

echo "🎯 pegintichat.online LIVE"
echo "========================"

# Nettoyage PM2
pm2 delete all 2>/dev/null
pm2 flush 2>/dev/null
pm2 kill 2>/dev/null
sleep 2

# Lancement du serveur PEGINTI
pm2 start ecosystem-peginti.js --only PEGINTI-Server
sleep 5

# Test automatique
if curl -s http://localhost:4000/ping >/dev/null; then
  echo "✅ Serveur OK: http://localhost:4000"
else
  echo "❌ Serveur KO - Vérifiez les logs"
  pm2 logs PEGINTI-Server
  exit 1
fi

echo ""
echo "🎉 SUCCESS !"
echo "📊 pm2 status"
echo "🔍 pm2 logs PEGINTI-Server"
