#!/bin/bash
cyan='\033[0;36m' purple='\033[0;35m' green='\033[0;32m' reset='\033[0m'
echo -e "${cyan}PEGINTI + BO'OIVINI — Chat supervisé${reset}\n"
while true; do
  read -p "$(echo -e ${purple}QUESTION${reset}: )" q
  [[ "$q" =~ ^quit$ ]] && exit
  echo -ne "$(echo -e ${green}BO'OIVINI${reset}: )"
  curl -sX POST http://127.0.0.1:4000/peginti/analyse -H "Content-Type: application/json" -d "{\"question\":\"$q\"}" | jq -r '.response.bo_oivini.noyau + ": " + (.response | tostring)'
  echo ""
done
