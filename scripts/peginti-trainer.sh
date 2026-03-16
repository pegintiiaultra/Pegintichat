#!/data/data/com.termux/files/usr/bin/bash

yellow='\033[1;33m'
green='\033[0;32m'
purple='\033[0;35m'
reset='\033[0m'

clear
echo -e "${purple}🧠 PEGINTI — Mode Langage Naturel${reset}"
echo "===================================="

while true; do
  read -p "💭 Vous: " question
  [[ -z "$question" ]] && continue
  [[ "$question" =~ ^(quit|exit|bye)$ ]] && exit 0

  raw=$(curl -s -X POST http://127.0.0.1:4000/peginti/analyse \
    -H "Content-Type: application/json" \
    -d "{\"question\":\"$question\"}")

  # Extraction langage naturel
  reponse=$(echo "$raw" | jq -r '.response.presentation // .response.recommandation // .response.texte // empty')

  # Extraction raisonnement BO'OIVINI
  matrice=$(echo "$raw" | jq -r '.response.bo_oivini.raisonnement // empty')

  echo -e "${green}$reponse${reset}"
  [[ -n "$matrice" ]] && echo -e "${purple}🧩 BO'OIVINI: $matrice${reset}"
  echo ""
done
