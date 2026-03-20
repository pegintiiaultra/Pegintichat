#!/bin/bash
echo "🧠🔮 BO'OIVINI v2.3 ULTRA - CHAT INTERACTIF LIVE 🇨🇲"
echo "=============================================="
echo "Tapez vos sujets (BIP/Herméneutique/Logique) ou 'quit' pour sortir"
echo "Exemples: mariage, publicains, comparaison, philosophes"
echo "🌐 LIVE: https://pegintichat.online/"
echo "=============================================="

while true; do
  echo -ne "\n👤 PEGINTI > "
  read sujet
  
  [[ "$sujet" == "quit" || "$sujet" == "q" ]] && echo "🧠 BO'OIVINI déconnecté. Au revoir !" && break
  
  echo '{"sujet":"'"$sujet"'"}' | \
    curl -s -X POST -H "Content-Type: application/json" \
    localhost:3000/api/chat -d@- | \
    jq -r '.source + " → " + (.reponse//.transposition//"Triade active")'
done
