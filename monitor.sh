#!/bin/bash
echo "=== PEGINTI IA MONITORING ==="
echo "📊 PM2 Status:"
pm2 status --no-colors
echo ""
echo "🌐 Tunnel Status:"
pm2 logs PEGINTI-Tunnel --lines 5
echo ""
echo "🔍 Tests:"
curl -s http://localhost:4000/status | jq . || echo "{}"
echo ""
echo "🔗 Accès: http://localhost:4000 | https://peginti.tomtech.inc"
