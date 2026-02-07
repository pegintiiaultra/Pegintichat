# **PEGINTICHAT**

PEGINTICHAT est un agent conversationnel et un serveur MCP minimal en Node.js, conçu pour faciliter la gestion de la relation client, l’automatisation de tâches, et le développement de projets numériques pour les entreprises, boutiques et applications en ligne.

Le projet est pensé pour être portable, léger, et fonctionnel même sur des environnements contraints comme Android (Termux).

---

# 🌐 **Sites officiels**

### 🔗 Site principal PEGINTICHAT  
https://pegintichat.online/

### 🔗 Site communautaire PEGINTI (E‑monsite)  
https://peginti.e-monsite.com

---

# 🧠 **Présentation générale**

PEGINTICHAT s’inscrit dans l’écosystème **PEGINTI – Intelligence Artificielle Camerounaise**, un projet à la fois communautaire et commercial, orienté vers l’éducation numérique, l’innovation et l’autonomisation technologique en Afrique.

**PEGINTI – Cameroonian Artificial Intelligence**  
A community and business project for education and innovation.

---

# 🎯 **Objectifs du projet**

- Fournir un agent conversationnel polyvalent  
- Proposer un serveur MCP stdio simple et extensible  
- Faciliter :
  - la gestion clientèle  
  - l’automatisation de tâches  
  - l’assistance technique et pédagogique  
- Offrir une base technique claire pour des projets professionnels ou communautaires  
- Être compatible Android / Linux / Windows  
- Rester open-source et maintenable  

---

# 🧱 **Architecture du projet**

```
pegintichat/
│
├── src/
│   ├── api/
│   │   └── http.js          # API HTTP
│   │
│   ├── core/
│   │   ├── identity.js      # Identité du projet
│   │   ├── language.js      # Détection automatique de langue
│   │   └── logger.js        # Journalisation
│   │
│   ├── mcp/
│   │   ├── protocol.js      # Format MCP / JSON-RPC
│   │   ├── server.js        # Serveur MCP (stdio)
│   │   └── handlers.js      # Logique conversationnelle / métier
│   │
│   └── index.js             # Orchestration interne
│
├── tests/
│   └── handlers.test.js     # Tests Jest
│
├── index.js                 # Point d’entrée HTTP
├── package.json
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
└── .gitignore
```

Cette architecture est conçue pour être robuste, scalable et facile à comprendre, même pour des développeurs débutants.

---

# ⚙️ **Prérequis**

- Node.js ≥ 18  
- npm  

Fonctionne sur :

- Android (Termux)  
- Linux  
- Windows  

Aucune dépendance lourde ni binaire externe n’est requise.

---

# 📦 **Installation**

```bash
git clone https://github.com/pegintiiaultra/PEGINTICHAT.git
cd PEGINTICHAT
npm install
```

---

# ▶️ **Lancement du serveur HTTP**

```bash
npm start
```

Le serveur démarre sur :

```
http://localhost:3000
```

---

# 🔌 **API HTTP**

## **GET /**  
Statut de l’API.

**Réponse :**

```json
{
  "status": "PEGINTICHAT API running",
  "version": "1.0.0"
}
```

---

## **POST /mcp**  
Exécute une méthode MCP via HTTP.

### Exemple :

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"ping"}'
```

**Réponse :**

```json
{ "reply": "pong" }
```

---

# 🔌 **Utilisation MCP (stdio)**

### Test rapide

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"ping"}' | node index.js
```

---

# 📡 **Méthodes disponibles**

### **ping**  
Vérifie que le serveur est actif.

### **identity**  
Retourne l’identité du serveur PEGINTICHAT.

### **about**  
Détection automatique de langue (FR/EN) + réponse adaptée.

#### Exemple :

```bash
echo '{"jsonrpc":"2.0","id":3,"method":"about","params":{"question":"Bonjour qui est Peginti ?"}}' | node index.js
```

---

# 🧠 **Détection automatique de langue**

PEGINTICHAT détecte automatiquement la langue d’une question grâce à une heuristique légère (sans dépendance externe).

Langues supportées :

- 🇫🇷 Français  
- 🇬🇧 Anglais  

---

# 🧪 **Tests automatisés (Jest)**

## Installation

```bash
npm install --save-dev jest
```

## Lancer les tests

```bash
npm test
```

## Exemple de tests (tests/handlers.test.js)

- ping  
- identity  
- about (FR)  
- about (EN)  

Tous les tests doivent être **verts**.

---

# 🧠 **Identité visuelle PEGINTI**

### 🧠 Logo officiel PEGINTI  
Cerveau sur un nuage, couleurs du Cameroun.

### 🔵 Bannière PEGINTI IA ULTRA  
Motif circulaire vert‑jaune‑rouge en forme de “8”, étoile bleue centrale.

---

# 🌍 **Dimension communautaire**

PEGINTI est un projet dédié à l’éducation numérique en Afrique.

Il met à disposition :

- outils open-source  
- ressources pédagogiques  
- accompagnement technique  

Objectif : rendre l’IA accessible aux jeunes et communautés rurales.

---

# 💼 **Dimension commerciale**

PEGINTI propose :

- correction et optimisation de code  
- configuration de systèmes  
- automatisation de tâches  
- assistance technique et conseil numérique  

---

# 🤝 **Contribution**

Les contributions sont bienvenues.  
Voir :

- `CONTRIBUTING.md`  
- `CODE_OF_CONDUCT.md`  

---

# 🔐 **Sécurité**

Les signalements de vulnérabilités sont décrits dans `SECURITY.md`.

---

# 📊 **Statut du projet**

- Projet public open-source  
- Licence MIT  
- Dépôt template  
- Développement actif  

---

# 📬 **Contacts officiels**

📧 Email : **pegintiiaultra@gmail.com**  
👤 Propriétaire : **TOMO OMBEDE BARNABÉ BERTRAND**  
📱 WhatsApp : **+237 691 48 24 53**  
🌍 Vision : **Tomtech.Inc – AFIC-ONE (Africa In Cameroon 1)**  

---

# 📄 **Licence**

Ce projet est distribué sous licence **MIT**.

---

# 🎉 **README finalisé — Version 1.0.0**

Ce document est :

- complet  
- professionnel  
- aligné avec l’architecture actuelle  
- prêt pour GitHub  
- prêt pour npm
