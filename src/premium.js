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
      id: "prod-dsk-peginti-ia",
      nom: "DSK PEGINTI IA",
      badge: "Populaire 🔥",
      categorie: "LOGICIEL & SDK",
      prixFcfa: "15 000 FCFA /mois",
      montantNumerique: 15000,
      description: "Kit de développement autonome. Correction de code, détection de bugs et refactoring automatique."
    },
    {
      id: "prod-code-studio-pro",
      nom: "Code Studio Pro",
      badge: "Souverain ⚡",
      categorie: "GÉNÉRATEUR PRO",
      prixFcfa: "45 000 FCFA /unique",
      montantNumerique: 45000,
      description: "Générateur full-stack d'applications web et mobile sur-mesure avec intégration d'API souveraines."
    },
    {
      id: "prod-matrice-eecoc",
      nom: "Module Matrice Techno-eecoc Enterprise",
      badge: "Écologique 🌿",
      categorie: "ARCHITECTURE IA",
      prixFcfa: "75 000 FCFA /unique",
      montantNumerique: 75000,
      description: "Algorithmes de calcul matriciel frugal à régénération de tenseurs, réduisant la consommation de calcul de plus de 60%."
    }
  ]
};

export default {
  premiumConfig,
  getPremiumInfo,
  CATALOGUE_PREMIUM
};
