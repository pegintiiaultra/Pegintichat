#!/bin/bash
echo "=== Démarrage PEGINTICHAT ==="
pm2 delete peginti-chat
pm2 start ~/PEGINTICHAT/src/server.js --name peginti-chat
pm2 save
pm2 resurrect
echo "=== Serveur relancé sur port 3000 ==="
