#!/bin/bash
# Script de validation Bo’oivini serveur (port 3000)

BASE_URL="http://localhost:3000"

echo "=== Test Chat doctrinal ==="
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"sujet":"Test doctrinal"}' | jq .

echo
echo "=== Test WOUNANET ==="
curl -s -X POST "$BASE_URL/api/wounanet" \
  -H "Content-Type: application/json" \
  -d '{"query":"PEGINTI TomTech"}' | jq .

echo
echo "=== Diagnostic ==="
curl -s "$BASE_URL/doctor" | jq .
