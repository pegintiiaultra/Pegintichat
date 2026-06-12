#!/bin/bash
echo "🛑 Stop & delete ancienne instance..."
pm2 stop bo-oivini 2>/dev/null
pm2 delete bo-oivini 2>/dev/null

echo "⚡ Kill port 3000 si occupé..."
kill -9 $(lsof -ti :3000) 2>/dev/null

echo "🚀 Relance Bo’oivini..."
pm2 start ~/PEGINTICHAT/server.js --name bo-oivini
pm2 save

echo "🔍 Validation..."
~/PEGINTICHAT/validate.sh
