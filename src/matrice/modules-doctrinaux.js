/**
 * MODULES DOCTRINAUX - Application des filtres doctrinaux souverains
 * TOMTECH.INC · Tomo Ombede Barnabé Bertrand
 * 
 * Les modules enrichissent et orientent la réponse en profondeur 
 * sans tronquer ni écraser le raisonnement dense et argumenté de la matrice.
 */

export function appliquerDoctrine(texte, doctrine = 'souverainete') {
  if (!texte) return '';
  return String(texte).trim();
}

export default {
  appliquerDoctrine
};
