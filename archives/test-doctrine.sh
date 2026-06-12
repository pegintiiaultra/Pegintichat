#!/bin/bash
# Script de test PEGINTI Doctrine

echo "=== TEST PEGINTI DOCTRINE ==="
topics=("civilisation" "communaute africaine" "sorcellerie" "idolatrie" "homosexualite" "mort")

for topic in "${topics[@]}"; do
  echo ">>> PEGINTI> $topic"
  node ~/PEGINTICHAT/src/chat.js <<< "$topic"
  echo ""
done
