/**
 * MOTEUR HERMÉNEUTIQUE ULTRA - PEGINTI IA
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 */

export function normaliser(texte) {
  return String(texte || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function interpreterSujet(sujet) {
  const q = normaliser(sujet);

  if (q.includes('religion') || q.includes('dieu') || q.includes('foi') || q.includes('culte')) return 'spirituel';
  if (q.includes('homosexualite') || q.includes('tabou') || q.includes('moeurs')) return 'sensible';
  if (q.includes('identite africaine') || q.includes('tradition') || q.includes('ancetres') || q.includes('culture')) return 'identite_culturelle';
  if (q.includes('souverainete') || q.includes('colonialisme numerique') || q.includes('independance') || q.includes('autonomie')) return 'souverainete';
  if (q.includes('paix') || q.includes('cohesion') || q.includes('vivre ensemble') || q.includes('dialogue')) return 'coherence_sociale';

  return 'generaliste';
}

export function interpreterTexte(texte) {
  const categorie = interpreterSujet(texte);
  return {
    sensLitteral: "Compréhension première",
    sensProfond: "Déploiement doctrinal et implications éthiques",
    porteSouveraine: "Affirmation de la pensée indépendante",
    categorie
  };
}

export default {
  interpreterSujet,
  interpreterTexte,
  normaliser
};
