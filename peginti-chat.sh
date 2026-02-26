#!/bin/bash
# PEGINTI-CHAT v2.2 FINAL - Fix terminal Termux
clear
cat << "EOBANNER"
🧠 PEGINTI-CHAT v2.2 FINAL - BIP/PHILO/STRAT/MIRAP
🌍 PEGINTICHAT (80%) | 💎 Bo'oivinichat (20%)
Tape 'exit' pour quitter
EOBANNER

while true; do
  echo -n "Vous: "
  read input
  [[ "$input" == "exit" || "$input" == "q" ]] && break

  encoded=$(echo "$input" | sed 's/ /+/g')
  
  # Routage simple et robuste
  route=$(curl -s --max-time 3 "http://localhost:3000/peginti/router?q=$encoded" 2>/dev/null)
  destination=$(echo "$route" | jq -r '.destination' 2>/dev/null || echo "PEGINTICHAT")
  confiance=$(echo "$route" | jq -r '.confiance' 2>/dev/null || echo "80")

  echo "↪ $destination | $confiance%"
  
  if [[ "$destination" == "Bo'oivinichat" ]]; then
    echo -n "💎 Bo'oivinichat: "
    curl -s -H "Authorization: TomTech" "http://localhost:3000/booivini/chat?message=$encoded" 2>/dev/null | \
    jq -r '.reponse' 2>/dev/null || echo "Solution premium entreprise"
  else
    echo -n "🌍 PEGINTICHAT: "
    curl -s "http://localhost:3000/?chat=$encoded" 2>/dev/null | \
    jq -r '.reponse' 2>/dev/null || echo "👁️ BIP: Réponse Peginti communautaire"
  fi
  echo
done
