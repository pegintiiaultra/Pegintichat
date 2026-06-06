#!/bin/bash
# Protection automatique du fichier doctrine.json

SRC=~/PEGINTICHAT/src/db/doctrine.json
ARCHIVE=~/PEGINTICHAT/archives/doctrine.json

# Crée le dossier d'archives si nécessaire
mkdir -p ~/PEGINTICHAT/archives

# Si aucune archive n'existe encore, on en crée une copie initiale
if [ ! -f "$ARCHIVE" ]; then
  cp "$SRC" "$ARCHIVE"
  echo "✅ Archive initiale créée."
  exit 0
fi

# Vérifie les différences entre le fichier courant et l'archive
if diff "$SRC" "$ARCHIVE" > /dev/null; then
  echo "✅ Doctrine intacte."
else
  echo "⚠️ Attention : doctrine.json a été modifié !"
  echo "Restauration en cours..."
  cp "$ARCHIVE" "$SRC"
  echo "✅ Doctrine restaurée à partir de l'archive."
fi
