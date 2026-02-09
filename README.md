# 🧠 PEGINTICHAT — IA ULTRA  
Noyau technique officiel de l’écosystème PEGINTI  
Official technical core of the PEGINTI ecosystem

PEGINTICHAT est un agent conversationnel léger et un serveur MCP minimal en Node.js, conçu pour la gestion de la relation client, l’automatisation de tâches et le développement de solutions numériques.  
Le projet est optimisé pour la portabilité, la faible consommation de ressources et la fiabilité, y compris sur Android (Termux).

PEGINTICHAT is a lightweight conversational agent and minimal MCP server built with Node.js, designed for customer interaction, task automation, and digital solution development.  
The project emphasizes portability, low resource usage, and reliability, including support for Android (Termux).

## 🌐 Sites officiels / Official Websites
- https://pegintichat.online/
- https://peginti.e-monsite.com

## 🧠 Présentation / Overview
PEGINTICHAT s’inscrit dans l’écosystème IA Ultra.  
It serves as a conversational engine and minimal MCP server.

## 🎯 Objectifs / Goals
- Agent conversationnel polyvalent  
- Serveur MCP minimal  
- Automatisation  
- Base technique claire  
- Compatible Android / Linux / Windows  

- Versatile conversational agent  
- Minimal MCP server  
- Automation  
- Clean technical base  
- Android / Linux / Windows compatible  

## ⚙️ Prérequis / Requirements
- Node.js ≥ 18  
- npm  

## 📦 Installation / Installation
git clone https://github.com/pegintiiaultra/PEGINTICHAT.git
cd PEGINTICHAT
npm install
npm start

## 🔌 API HTTP / HTTP API
GET /
{
  "status": "PEGINTICHAT API running",
  "version": "1.0.0"
}

POST /mcp
curl -X POST http://localhost:4000/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"ping"}'

## 🔌 MCP (stdio)
echo '{"jsonrpc":"2.0","id":1,"method":"ping"}' | node index.js
echo '{"jsonrpc":"2.0","id":3,"method":"about","params":{"question":"Bonjour qui est Peginti ?"}}' | node index.js

## 🧪 Tests / Tests
npm install --save-dev jest
npm test
