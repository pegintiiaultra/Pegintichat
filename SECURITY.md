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
## 🔐 Gestion des secrets et CI/CD

- Les secrets (`SSH_USER`, `SSH_HOST`, `SSH_PASSWORD`, `GH_TOKEN`) sont stockés uniquement dans GitHub Secrets.
- Aucun secret ne doit être exposé dans le code ou les commits.
- Les workflows CI/CD sont protégés par des règles d’approbation pour éviter l’exécution non validée.
- Toute vulnérabilité ou fuite potentielle doit être signalée via une issue privée ou par contact direct avec le mainteneur.
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
