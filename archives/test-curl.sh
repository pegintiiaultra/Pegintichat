#!/bin/bash
echo "=== Test PEGINTICHAT ==="
echo "Ping:"
curl -s http://localhost:3000/ping
echo -e "\n\nMémoire:"
curl -s http://localhost:3000/memoire
echo -e "\n\nChat (Souveraineté numérique):"
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sujet":"Souveraineté numérique"}'
echo -e "\n\nDoctor:"
curl -s http://localhost:3000/doctor
echo -e "\n\nWounanet (Afrique):"
curl -s "http://localhost:3000/api/wounanet?sujet=Afrique"
echo -e "\n=== Fin des tests ==="
