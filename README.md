<div align="center">

# 🧠 **PEGINTICHAT — IA ULTRA**
### *Noyau technique officiel de l’écosystème PEGINTI*

![version](https://img.shields.io/badge/version-1.0.0-green.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![status](https://img.shields.io/badge/status-stable-brightgreen.svg)

**Agent conversationnel + Serveur MCP minimaliste**  
*Gestion client • Automatisation • IA locale • Android‑ready*

![Logo PEGINTI](https://pegintichat.online/logo.png)

</div>

---

# 🌍 **Écosystème PEGINTI — Architecture à double noyau**

PEGINTICHAT repose sur une architecture conceptuelle unique :

## 🔵 **1. IA ULTRA — Noyau technique**
La couche opérationnelle, open‑source, reproductible :

- API HTTP légère  
- Serveur MCP (stdio)  
- Détection automatique FR/EN  
- Automatisation de tâches  
- Compatibilité Android/Termux  
- Déploiement PM2/Nginx  
- Zéro dépendance native  

👉 **Le moteur.**

## 🟡 **2. PEGINTI — Noyau vision**
La couche institutionnelle et communautaire :

- Mission éducative africaine  
- Gouvernance et identité  
- Vision d’autonomisation numérique  
- Cadre doctrinal et pédagogique  
- Communauté et accompagnement  

👉 **La direction.**

Cette séparation rend le projet **lisible pour les développeurs** et **fidèle à la vision PEGINTI**.

---

# 🎯 **Objectifs du projet**

- Offrir un agent conversationnel simple et efficace  
- Fournir un serveur MCP minimaliste et extensible  
- Permettre l’automatisation de tâches métier  
- Servir de base technique pour projets IA africains  
- Fonctionner même dans des environnements contraints (Android)  
- Rester open‑source, léger et maintenable  

---

# 🧱 **Architecture technique**
**Port par défaut : `4000`**

---

# ⚙️ **Installation**

### 📦 Clone + installation
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
echo '{"jsonrpc":"2.0","id":1,"method":"about","params":{"question":"Bonjour"}}' | node index.js
npm test
pm2 start ecosystem.config.js --env production
pm2 save
docker build -t pegintichat .
docker run -p 4000:4000 pegintichat
MIT License © 2026 PEGINTI IA ULTRA
