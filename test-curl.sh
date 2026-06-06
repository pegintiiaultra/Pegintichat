#!/bin/bash

echo "=== 🔄 Test /ping ==="
curl -s http://localhost:3000/ping | jq .

echo ""
echo "=== 🧠 Test /api/chat (doctrinal) ==="
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sujet":"Souveraineté numérique"}' | jq .

echo ""
echo "=== 🌐 Test /api/wounanet (externe NewsData.io) ==="
curl -s -X POST http://localhost:3000/api/wounanet \
  -H "Content-Type: application/json" \
  -d '{"query":"Afrique"}' | jq .

echo ""
echo "=== 📚 Test /memoire ==="
curl -s http://localhost:3000/memoire | jq .
