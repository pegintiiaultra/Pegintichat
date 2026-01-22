# Politique de sécurité / Security Policy

## 🇫🇷 Signalement des vulnérabilités
Si vous découvrez une faille de sécurité dans PEGINTI :
- **Ne pas la divulguer publiquement**.
- Envoyez un rapport détaillé par email à : bertrandtomo7@gmail.com
- Incluez les étapes pour reproduire le problème et, si possible, une proposition de correction.

Nous nous engageons à répondre rapidement et à corriger les vulnérabilités critiques dans les plus brefs délais.

## 🇬🇧 Reporting Vulnerabilities
If you discover a security issue in PEGINTI:
- **Do not disclose it publicly**.
- Send a detailed report by email to: bertrandtomo7@gmail.com
- Include steps to reproduce the issue and, if possible, a suggested fix.

We are committed to responding quickly and fixing critical vulnerabilities as soon as possible.

---

## Versions supportées / Supported Versions

| Version | Supporté / Supported |
|---------|-----------------------|
| 1.0.x   | ✅ Oui / Yes          |
| < 1.0   | ❌ Non / No           |

---

## Bonnes pratiques / Best Practices
- Gardez vos dépendances à jour (`pip install --upgrade -r requirements.txt`).
- Exécutez régulièrement les tests de sécurité (`bandit -r .`).
- Utilisez des environnements virtuels pour isoler vos installations Python.
# 🔒 Configuration de sécurité des workflows GitHub Actions

La configuration des workflows GitHub Actions est conçue pour renforcer la sécurité et le contrôle du dépôt.

---

## 📑 Permissions
- `contents` : lecture seule → empêche les modifications non autorisées du code.  
- `pull-requests` : lecture seule → empêche les modifications non autorisées des demandes de fusion.  
- `issues` : lecture seule → empêche les modifications non autorisées des problèmes.  
- `actions` : lecture seule → empêche les modifications non autorisées des paramètres des workflows.  
- `github-actions` : administrateur → garantit l'exécution des workflows CI/CD sans restriction.  
- `github-admin` : administrateur → garantit la maîtrise totale des administrateurs sur le dépôt.  

---

## 🎯 Raisons
- **Sécurité renforcée** : empêcher les modifications non autorisées du code, des demandes de fusion, des problèmes et des paramètres.  
- **Contrôle strict** : garantir que seuls les administrateurs ont la main sur la gestion globale du dépôt.  
- **Exécution garantie** : assurer que les workflows CI/CD peuvent tourner correctement sans restriction.  
- **Principe du moindre privilège** : limiter chaque permission au strict nécessaire pour réduire la surface d'attaque et les risques d'erreurs.  

---

## 🧠 Impact
- Les workflows sont autonomes mais non intrusifs.  
- Les administrateurs gardent la maîtrise totale.  
- La configuration est **scalable** et prête pour accueillir des contributeurs sans compromettre la sécurité.
