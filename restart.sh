#!/bin/bash
# Vérifie et libère le port 4000 si nécessaire
PID=$(lsof -ti :4000)
if [ -n "$PID" ]; then
  kill -9 $PID
  echo "🔴 Ancien serveur arrêté (PID $PID)"
fi

# Relance le serveur
echo "🚀 Redémarrage du serveur PEGINTI..."
cd ~/PEGINTICHAT
node server.js
