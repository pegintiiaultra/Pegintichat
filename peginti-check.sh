#!/bin/bash
echo "🔍 Vérification PEGINTICHAT..."
for f in index.html css/style.css js/app.js assets/fond-interface.jpg assets/logo-peginti.jpg; do
  if [ -f "$f" ]; then
    echo "✅ $f trouvé"
  else
    echo "❌ $f manquant"
  fi
done
pm2 list | grep PEGINTICHAT-SERVER && echo "✅ Serveur actif" || echo "⚠️ Serveur inactif"
