# 🧠 **PEGINTICHAT — IA ULTRA**
### *Noyau technique officiel de l’écosystème PEGINTI*

PEGINTICHAT est un agent conversationnel et un serveur MCP minimal en Node.js, conçu pour faciliter la gestion de la relation client, l’automatisation de tâches, et le développement de projets numériques pour les entreprises, boutiques et applications en ligne.  
Le projet est pensé pour être portable, léger, et fonctionnel même sur des environnements contraints comme Android (Termux).

---

# 🌐 **Sites officiels**

### 🔗 Site principal PEGINTICHAT  
https://pegintichat.online/

### 🔗 Site communautaire PEGINTI  
https://peginti.e-monsite.com

---

# 🌍 **Écosystème PEGINTI — Architecture à double noyau**

PEGINTICHAT repose sur une architecture conceptuelle unique :

## 🔵 **1. IA ULTRA — Noyau technique**
- API HTTP légère  
- Serveur MCP (stdio)  
- Détection automatique FR/EN  
- Automatisation de tâches  
- Compatibilité Android/Termux  
- Déploiement PM2/Nginx  
- Zéro dépendance native  

👉 **Le moteur.**

## 🟡 **2. PEGINTI — Noyau vision**
- Mission éducative africaine  
- Gouvernance et identité  
- Vision d’autonomisation numérique  
- Cadre doctrinal et pédagogique  
- Communauté et accompagnement  

👉 **La direction.**

Cette séparation rend le projet lisible pour les développeurs et fidèle à la vision PEGINTI.

---

# 🎯 **Objectifs du projet**

- Fournir un agent conversationnel polyvalent  
- Proposer un serveur MCP stdio simple et extensible  
- Faciliter la gestion clientèle, l’automatisation et l’assistance technique  
- Offrir une base technique claire pour des projets professionnels ou communautaires  
- Être compatible Android / Linux / Windows  
- Rester open‑source et maintenable  

---

# 🧱 **Architecture du projet**
---

# ⚙️ **Prérequis**

- Node.js ≥ 18  
- npm  

Fonctionne sur :

- Android (Termux)  
- Linux  
- Windows  

Aucune dépendance lourde n’est requise.

---

# 📦 **Installation**

```bash
git clone https://github.com/pegintiiaultra/PEGINTICHAT.git
cd PEGINTICHAT
npm install
npm start
http://localhost:4000
{
  "status": "PEGINTICHAT API running",
  "version": "1.0.0"
}
curl -X POST http://localhost:4000/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"ping"}'
echo '{"jsonrpc":"2.0","id":1,"method":"ping"}' | node index.js
echo '{"jsonrpc":"2.0","id":3,"method":"about","params":{"question":"Bonjour qui est Peginti ?"}}' | node index.js
npm install --save-dev jest
npm test
