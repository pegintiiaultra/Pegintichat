/**
 * MODULES DOCTRINAUX - Application des filtres doctrinaux souverains
 * TOMTECH.INC · Tomo Ombede Barnabé Bertrand
 * 
 * RÔLE CLÉ :
 * Le système PEGINTI IA est généraliste (comme Claude, Gemini, ChatGPT).
 * Les modules doctrinaux interviennent en sortie comme un filtre cognitif,
 * stylistique et sémantique qui :
 * 1. Bloque toute intrusion de pensée extérieure, impérialisme, colonialisme numérique ou condescendance.
 * 2. Purifie et enrichit la rhétorique avec dignité, rigueur intellectuelle et souveraineté.
 * 3. Assure la stricte neutralité sur l'identité (aucun étalage de créateur sauf demande expresse).
 */

/**
 * Supprime toute formule de politesse générique, salutation ou bienvenue répétitive
 * lorsque la conversation est en cours afin de garder le fil continu de la discussion.
 */
export function nettoyerFormulesPolitesseGeneriques(texte, estEnCoursDeDiscussion = false) {
  if (!texte) return '';
  let res = String(texte).trim();

  if (!estEnCoursDeDiscussion) {
    return res;
  }

  // 1. Si le message n'est qu'une formule d'accueil ou de bienvenue sous n'importe quelle variante
  const regexEstMessageAccueilPur = /^(?:bonjour|salut|bonsoir|hello|coucou|bienvenue|je suis peginti)[\s\S]*?(?:comment puis-je vous aider|comment puis-je vous éclairer|que puis-je pour vous|que voulez-vous explorer|votre intelligence artificielle|bienvenue sur peginti)[\s\S]*?$/i;
  if (regexEstMessageAccueilPur.test(res)) {
    const sansFormule = res
      .replace(/(?:bonjour|salut|bonsoir|hello|coucou|bienvenue|je suis peginti ia)[^.!?\n]*?[.!?]?/gi, '')
      .replace(/(?:comment puis-je vous aider|comment puis-je vous éclairer|que puis-je pour vous|que voulez-vous explorer|votre intelligence artificielle|intelligence artificielle généraliste et souveraine)[^.!?\n]*?[.!?]?/gi, '')
      .trim();
    if (sansFormule.length < 15) {
      return '';
    }
  }

  // 2. Nettoyage des préfixes en tête de message
  res = res.replace(/^(?:bonjour|salut|bonsoir|hello|coucou)[,\s!–-]*(?:bienvenue sur peginti ia|je suis peginti ia|votre intelligence artificielle)[^.!?\n]*?[.!?]\s*/i, '');
  res = res.replace(/^bienvenue sur (?:peginti ia|la console cognitive)[^.!?\n]*?[.!?]\s*/i, '');
  res = res.replace(/^(?:bonjour|salut|bonsoir)[,\s!–-]*(?:comment puis-je vous aider|comment puis-je vous éclairer|que puis-je pour vous|que voulez-vous explorer)[^.!?\n]*?[.?]\s*/i, '');
  res = res.replace(/^(?:bonjour|salut|bonsoir|hello|coucou)[,\s!–-]+\s*/i, '');

  // 3. Nettoyage de phrase d'accueil isolée résiduelle
  res = res.replace(/^(?:comment puis-je vous aider aujourd'hui \?|comment puis-je vous éclairer aujourd'hui \?|que voulez-vous explorer aujourd'hui \?)\s*/i, '');

  return res.trim();
}

export function appliquerDoctrine(texte, doctrine = 'souverainete', { estEnCoursDeDiscussion = false } = {}) {
  if (!texte) return '';
  let resultat = String(texte).trim();

  // Nettoyage proactif des formules de politesse répétitives si discussion active
  if (estEnCoursDeDiscussion) {
    resultat = nettoyerFormulesPolitesseGeneriques(resultat, true);
    if (!resultat) {
      return "Je poursuis notre discussion avec intérêt. Sur quel point ou quelle thématique souhaitez-vous que nous avancions ?";
    }
  }

  // 1. Suppression des balises de titres interdites ('###', '##')
  resultat = resultat
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(Introduction|Développement|Synthèse|Conclusion|Cadrage fondamental|Enjeux majeurs|Perspectives stratégiques|Bloc 1|Bloc 2|Bloc 3)\s*:\*\*/gi, '')
    .replace(/^(Introduction|Développement|Synthèse|Conclusion)\s*:/gim, '');

  // 2. Nettoyage des tics de langage artificiels ou serviles
  resultat = resultat
    .replace(/^(En tant que PEGINTI IA|Pour PEGINTI IA|Selon PEGINTI IA)[,:]?\s*/gi, '')
    .replace(/^(En tant qu'intelligence artificielle|En tant qu'IA|En tant que modèle de langage)[,:]?\s*/gi, '');

  // 3. Bouclier anti-colonialisme & immunité contre les biais d'ingérence
  resultat = resultat
    .replace(/\b(aide au développement condescendante|pays sous-développés retardataires)\b/gi, 'dynamiques de développement endogène')
    .replace(/\b(aide humanitaire salvatrice)\b/gi, 'coopération internationale d\'égal à égal');

  return resultat.trim();
}

export default {
  appliquerDoctrine,
  nettoyerFormulesPolitesseGeneriques
};

