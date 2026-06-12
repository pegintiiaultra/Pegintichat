#!/data/data/com.termux/files/usr/bin/bash
# Script pour injecter une nouvelle règle doctrinale dans doctrine.js

DOCTRINE_FILE="~/PEGINTICHAT/src/core/doctrine.js"

if [ $# -lt 2 ]; then
  echo "Usage: $0 <mot-cle> <réponse doctrinale>"
  exit 1
fi

KEY=$1
VALUE=$2

# Vérifier si la règle existe déjà
if grep -q "\"$KEY\"" $DOCTRINE_FILE; then
  echo "La règle doctrinale pour '$KEY' existe déjà."
else
  # Injecter la nouvelle règle dans le dictionnaire
  sed -i "/this.rules = {/a \ \ \ \ \"$KEY\": \"$VALUE\"," $DOCTRINE_FILE
  echo "Nouvelle règle doctrinale ajoutée : $KEY → $VALUE"
fi
