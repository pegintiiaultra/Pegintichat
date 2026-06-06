#!/bin/bash
echo "=== Test doctrinal local ==="
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sujet":"Doctrine PEGINTI"}' | jq .

echo "=== Test WOUNANET ==="
curl -s -X POST http://localhost:3000/api/wounanet \
  -H "Content-Type: application/json" \
  -d '{"query":"TomTech"}' | jq .

echo "=== Diagnostic ==="
curl -s http://localhost:3000/doctor | jq .
