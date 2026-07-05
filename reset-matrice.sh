#!/bin/bash
# Script de relance propre du serveur PEGINTICHAT

echo "⏹️ Arrêt du processus peginti-chat..."
pm2 stop peginti-chat 2>/dev/null
pm2 delete peginti-chat 2>/dev/null

echo "🔪 Suppression des processus Node fantômes..."
pkill -9 node

echo "🔍 Vérification du port 3000..."
lsof -i :3000

echo "🚀 Relance du serveur PEGINTICHAT..."
cd ~/PEGINTICHAT/src
pm2 start server.js --name peginti-chat --update-env

echo "💾 Sauvegarde de la configuration PM2..."
pm2 save

echo "✅ Relance terminée. Vérifie avec : pm2 list"
