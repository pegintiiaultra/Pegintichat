#!/data/data/com.termux/files/usr/bin/bash
# Script de démarrage PEGINTI

# Redémarre l’écosystème si déjà lancé, sinon démarre
pm2 restart peginti || pm2 start ~/PEGINTICHAT/ecosystem.config.js

# Attendre quelques secondes
sleep 8

# Vérifier le statut
pm2 status | grep peginti

# Test rapide d’analyse
echo "PEGINTI TEST"
curl -sX POST http://localhost:4000/peginti/analyse \
  -H "Content-Type: application/json" \
  -d '{"question":"Que dit la Bible sur le leadership ?","perspective":"chrétienne"}' | jq .
