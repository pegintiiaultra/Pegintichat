#!/data/data/com.termux/files/usr/bin/bash
# 🚀 Script de lancement interface PEGINTI v2.2

echo "🌐 Démarrage du serveur web PEGINTI..."
cd ~/PEGINTICHAT/public

# Vérifie si http-server est installé, sinon installe-le
if ! command -v http-server &> /dev/null
then
  echo "📦 Installation de http-server..."
  npm install -g http-server
fi

# Lance le serveur sur port 3000 (aligné avec PEGINTICHAT)
http-server -p 3000 -c-1 &
SERVER_PID=$!

echo "✅ Interface PEGINTI v2.2 disponible sur http://localhost:3000"
echo "Pour arrêter le serveur : kill $SERVER_PID"
