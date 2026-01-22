# 📜 CHANGELOG – PEGINTI  

Toutes les modifications sont documentées ici pour assurer la traçabilité, la transparence et la gouvernance technique du projet.  

---

## [v1.0.0] – 2026-01-22  

### ✨ Ajouts initiaux  
- Création du fichier `README.md` avec description bilingue, fonctionnalités, installation, scalabilité et roadmap.  
- Ajout du fichier `SECURITY.md` décrivant les règles de protection de branche, gestion des secrets et politique de fusion.  
- Ajout du fichier `CONTRIBUTING.md` expliquant le processus de contribution, les règles de validation des PR et les bonnes pratiques GitHub.  

### 🛠️ Infrastructure  
- Activation du workflow CI/CD via `main.yml` pour automatiser les tests et les déploiements.  
- Configuration des règles de protection sur la branche `main` :  
  - PR obligatoire avant fusion  
  - Approbation requise  
  - Fusion bloquée sans validation externe (désactivée temporairement pour travail solo)  

### 📁 Organisation  
- Structuration du dépôt avec branches `pegintiiaultra-patch-1` à `pegintiiaultra-patch-5` pour isoler les modifications.  
- Première série de Pull Requests ouvertes et validées :  
  - `Update README.md`  
  - `Update SECURITY.md`  
  - `Update CONTRIBUTING.md`  

---

## 🗺️ Prochaine version prévue : [v1.1.0]  
- Intégration des tests unitaires  
- Ajout d’une API REST  
- Déploiement cloud (Docker/Kubernetes)  
- Interface web utilisateur  
- Extension des modules linguistiques  

---

*Ce changelog est mis à jour à chaque version stable. Il reflète l’évolution doctrinale, technique et pédagogique de PEGINTI.*
