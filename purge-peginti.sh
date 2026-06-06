#!/data/data/com.termux/files/usr/bin/bash

echo "🧹 Purge doctrinale en cours..."

# Stop et supprime les processus indésirables
pm2 stop peginti-server 2>/dev/null
pm2 delete peginti-server 2>/dev/null

pm2 stop peginti-ultra 2>/dev/null
pm2 delete peginti-ultra 2>/dev/null

pm2 stop peginti-tunnel 2>/dev/null
pm2 delete peginti-tunnel 2>/dev/null

# Relance uniquement PEGINTICHAT + Bo’oivini tunnel
pm2 start ~/PEGINTICHAT/ecosystem.config.js

# Sauvegarde la configuration
pm2 save

# Affiche le statut final
pm2 list
