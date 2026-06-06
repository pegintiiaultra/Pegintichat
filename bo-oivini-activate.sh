#!/data/data/com.termux/files/usr/bin/bash
# 🔥 Activation cognitive de BO'OIVINI pour PEGINTI-ULTRA-SOA

echo "🧠 Initialisation du cerveau BO'OIVINI..."
pm2 delete peginti-ultra &>/dev/null
pm2 delete pegintichat &>/dev/null

# Chargement des modules doctrinaux
export NODE_ENV=production
export PEGINTINEWSAPIKEY=$(grep PEGINTINEWSAPIKEY .env | cut -d '=' -f2)
export WOUNANET_API_KEY=$(grep WOUNANET_API_KEY .env | cut -d '=' -f2)

echo "🔄 Démarrage du moteur herméneutique PEGINTI-ULTRA-SOA..."
pm2 start ~/PEGINTI-ULTRA/src/moteur/raisonnement.js --name peginti-ultra --interpreter node

echo "🚀 Démarrage du serveur doctrinal PEGINTICHAT..."
pm2 start ~/PEGINTICHAT/src/server.js --name pegintichat --interpreter node

pm2 save
echo "✅ BO'OIVINI activé et connecté à PEGINTICHAT"
