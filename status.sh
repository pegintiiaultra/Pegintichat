#!/data/data/com.termux/files/usr/bin/bash
echo "=== PM2 Process List ==="
pm2 list
echo ""
echo "=== PEGINTICHAT Status ==="
curl -s http://127.0.0.1:3000/status
