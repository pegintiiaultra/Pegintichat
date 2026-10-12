/**
 * MODULE PREMIUM & CATALOGUE PRO SOUVERAIN
 * TOMTECH.INC · Tomo Ombede Barnabé Bertrand
 */

export const premiumConfig = {
  statut: "ACTIF (ÉDITION SOUVERAINE PRO)",
  utilisateur: "Tomo Ombede Barnabé Bertrand",
  organisation: "TOMTECH.INC",
  licence: "PEGINTI-PRO-SOUVERAINE-2026",
  validite: "Permanente & Illimitée",
  fonctionnalites: [
    {
      nom: "Matrices Cognitives Haut Débit",
      description: "Traitement parallèle sans file d'attente avec débit prioritaire",
      icone: "⚡"
    },
    {
      nom: "Veille WOUNANET Dédiée (Pilote IVIOK Pro)",
      description: "Accès continu aux dépêches stratégiques en temps réel et flux d'analyse géopolitique",
      icone: "🌍"
    },
    {
      nom: "Analyse & Synthèse de Grands Volumes",
      description: "Capacité d'ingestion étendue pour code source, dépôts Git et thèses",
      icone: "📚"
    },
    {
      nom: "Protection & Chiffrement Souverain",
      description: "Isolation totale des requêtes et politique zéro fuite vers des serveurs tiers",
      icone: "🛡️"
    },
    {
      nom: "Assistant Technique Développeur bo'oivinichat",
      description: "Correction de code, génération d'API, refactoring et intégration continue",
      icone: "🔬"
    }
  ],
  quotas: {
    jetonsParMinute: "Illimité",
    requetesJournalieres: "Illimité",
    niveauPriorite: "Niveau 1 (Souverain)"
  }
};

export function getPremiumInfo() {
  return premiumConfig;
}

export const CATALOGUE_PREMIUM = {
  plateforme: "PEGINTI-CHAT PRO & BO'OIVINICHAT",
  edition: "Souveraine V3.5 Entreprise & Développeur",
  domaineOfficiel: "pegintichat.online",
  domainePaiement: "premium.pegintichat.online",
  ...premiumConfig,
  
  contactPaiement: {
    mtn: {
      numero: "+237 676867712",
      intitule: "MTN Mobile Money",
      nomTitulaire: "TOMO OMBEDE BARNABÉ BERTRAND"
    },
    orange: {
      numero: "+237 691482453",
      intitule: "Orange Money Cameroun",
      nomTitulaire: "TOMO OMBEDE BARNABÉ BERTRAND"
    }
  },

  produits: [
    {
      id: "prod-minang-lite",
      nom: "MINANG Lite (Messenger SMS & Off-Grid IP)",
      badge: "Innovation ✈️ / GRATUIT",
      badgeClass: "badge-innovation",
      categorie: "MESSAGERIE & RÉSEAU SOUVERAIN",
      prixFcfa: "GRATUIT (Inclus)",
      montantNumerique: 0,
      description: "Messagerie sociale souveraine par TomTech.inc. Fonctionne sans connexion Internet grâce au protocole SMS-IP, adresses IP simplifiées et réseau Mesh local. Envoi de messages, photos, documents, notes vocales et appels audio P2P.",
      avantages: [
        "Communication sans Internet (Protocole SMS-IP & Mesh local)",
        "Échange de messages texte, images, documents PDF/TXT et vocaux",
        "Appels audio P2P sur adresse IP localement simplifiée"
      ]
    },
    {
      id: "prod-dsk-peginti-ia",
      nom: "DSK PEGINTI IA Pro",
      badge: "Populaire 🔥",
      badgeClass: "badge-populaire",
      categorie: "LOGICIEL & SDK",
      prixFcfa: "15 000 FCFA /mois",
      montantNumerique: 15000,
      description: "Kit de développement autonome complet. Correction de code, détection de bugs et refactoring souverain.",
      avantages: [
        "Correction et refactoring automatique selon la doctrine Techno-eecoc",
        "Détection et résolution des anomalies de performance",
        "Exportation de micro-services souverains prêts au déploiement"
      ]
    },
    {
      id: "prod-code-studio-pro",
      nom: "Code Studio Pro",
      badge: "Souverain ⚡",
      badgeClass: "badge-souverain",
      categorie: "GÉNÉRATEUR PRO",
      prixFcfa: "45 000 FCFA /unique",
      montantNumerique: 45000,
      description: "Générateur full-stack d'applications web et mobile sur-mesure avec architecture certifiée TOMTECH.",
      avantages: [
        "Génération complète d'architectures web, mobiles et microservices",
        "Composants réactifs optimisés pour une faible consommation de bande passante",
        "Intégration directe aux API et tunnels de paiement souverains"
      ]
    },
    {
      id: "prod-matrice-eecoc",
      nom: "Matrice Techno-eecoc Enterprise",
      badge: "Écologique 🌿",
      badgeClass: "badge-eecoc",
      categorie: "ARCHITECTURE IA",
      prixFcfa: "75 000 FCFA /unique",
      montantNumerique: 75000,
      description: "Algorithmes de calcul matriciel frugal à régénération de tenseurs, réduisant la consommation de calcul de plus de 60%.",
      avantages: [
        "Réduction de 60%+ de la charge énergétique par tensorisation régénérative",
        "Adapté aux infrastructures frugales et environnements off-grid",
        "Licence perpétuelle entreprise avec support direct TomTech"
      ]
    }
  ]
};

export default {
  premiumConfig,
  getPremiumInfo,
  CATALOGUE_PREMIUM
};
