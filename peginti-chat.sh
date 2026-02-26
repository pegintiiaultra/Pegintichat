#!/bin/bash
clear
echo "🧠 PEGINTI-CHAT v2.2 FINAL"
echo "Vous: qui est bertrand tomo → Bo'oivinichat"
echo "Vous: technologie IA → PEGINTICHAT"
echo

while true; do
  echo -n "Vous: "
  read input
  [[ "$input" == "exit" || "$input" == "q" ]] && break
  
  encoded=$(echo "$input" | sed 's/ /+/g')
  route=$(curl -s "localhost:3000/peginti/router?q=$encoded")
  dest=$(echo "$route" | jq -r '.destination' 2>/dev/null || echo "PEGINTICHAT")
  conf=$(echo "$route" | jq -r '.confiance' 2>/dev/null || echo "80")
  
  echo "↪ $dest | $conf%"
  
  if [[ "$dest" == "Bo'oivinichat" ]]; then
    echo -n "💎 Bo'oivinichat: "
    curl -s -H "Authorization: TomTech" "localhost:3000/booivini/chat?message=$encoded" | \
    jq -r '.reponse' 2>/dev/null || echo "Solution premium"
  else
    echo -n "🌍 PEGINTICHAT: "
    curl -s "localhost:3000/?chat=$encoded" | jq -r '.reponse' 2>/dev/null || echo "Réponse BIP"
  fi
  echo
done
