#!/bin/bash
echo "🧠 PEGINTI-CHAT (GAUCHE) / Bo'oivinichat (DROIT)"
echo "Tape 'exit' pour quitter."

while true; do
  read -p "Vous: " input
  [ "$input" = "exit" ] && break

  # Interface publique (GAUCHE)
  echo "↪ PEGINTICHAT (public):"
  curl -s "http://localhost:3000/?chat=$input" | jq -r .reponse

  # Interface premium (DROIT)
  echo "↪ Bo'oivinichat (premium):"
  curl -s -H "Authorization: TomTech" "http://localhost:3000/booivini/chat?message=$input" | jq -r .reponse
done
