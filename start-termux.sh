#!/bin/bash
echo "🚀 Lancement de la plateforme PEGINTI IA sur Termux..."
pkg update && pkg upgrade -y
pkg install nodejs cloudflared -y
npm install
node src/server.js &
cloudflared tunnel run PEGINTI-TUNNEL --config ~/.cloudflared/config.yml
