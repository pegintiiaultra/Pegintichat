/**
 * MOTEUR ANALYSEUR - Analyse sémantique et syntaxique des requêtes
 */
export function analyserRequete(texte) {
  const t = String(texte || '').trim();
  return {
    longueur: t.length,
    motsCles: t.split(/\s+/).filter(w => w.length > 3),
    type: t.endsWith('?') ? 'INTERROGATION' : 'AFFIRMATION_OU_INSTRUCTION'
  };
}

export default {
  analyserRequete
};
