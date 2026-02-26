#!/bin/bash
B="\033[0;34m";G="\033[0;32m";Y="\033[1;33m";C="\033[0;36m";R="\033[0;31m";P="\033[0;35m";E="\033[0m"
echo -e "${Y}🧠PEGINTI v3.0${E} ${C}BIP/PHILO/STRAT/MIRAP${E}"
while true;do read -p "${C}Vous${E}: " i;[[ $i == "exit" ]]&&break;e=$(echo $i|sed 's/ /+/g');r=$(curl -s "localhost:3000/peginti/router?q=$e");d=$(echo $r|jq -r .destination//"PEGINTICHAT");c=$(echo $r|jq -r .confiance//80);printf "${Y}↪%s${E} ${C}|%s%%${E}\n" $d $c;if [[ $d == "Bo'oivinichat" ]];then printf "${B}💎Bo'oivini${E}: ";curl -s -H "Authorization: TomTech" "localhost:3000/booivini/chat?message=$e"|jq -r .reponse;echo;else printf "${G}🌍PEGINTICHAT${E}: ";curl -s "localhost:3000/?chat=$e"|jq -r .reponse;echo;fi;done
