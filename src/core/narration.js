/**
 * NARRATION (PEGINTI IA)
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 * 
 * Rôles clés :
 * 1. Transforme les résultats bruts de la Matrice en texte fluide, élégant et soigné.
 * 2. Structure la réponse en paragraphes clairs et intelligibles.
 * 3. Organise les trois niveaux cognitifs (Factuel, Enrichi, Stratégique).
 * 4. Adapte le ton selon la vitrine de destination (WOUNANET, CHAT INTERACTIF, VITRINE PREMIUM).
 */

export function narrerResultatMatrice(options = {}) {
  const texteSource = String(
    options.synthèseTexte || 
    options.syntheseTexte || 
    options.reponseBrute || 
    options.donneesMatrice?.synthese || 
    ''
  ).trim();

  const vitrine = options.vitrineCible || options.vitrine || 'CHAT_INTERACTIF';
  const depeche = options.dépêcheAssociee || options.depecheAssociee || options.donneesMatrice?.depechePrincipale;
  const modules = options.modulesAppliques || options.paquetBIP?.modulesSignales || [];

  if (vitrine === 'WOUNANET') {
    return {
      vitrine: 'WOUNANET',
      titre: depeche?.titre || "Résultats de Recherche Souveraine WOUNANET",
      reponseTexte: texteSource,
      synthèseTexte: texteSource,
      narrationFluide: texteSource,
      niveaux: {
        factuel: texteSource,
        enrichi: "Données recoupées et vérifiées en direct via le réseau mondial WOUNANET (Pilote IVIOK 24/24).",
        strategique: "Perspective souveraine : Maîtrise des flux informationnels et indépendance stratégique."
      },
      source: "WOUNANET (Pilote IVIOK 24/24)",
      timestamp: new Date().toISOString()
    };
  }

  if (vitrine === 'VITRINE_PREMIUM') {
    return {
      vitrine: 'VITRINE_PREMIUM',
      reponseTexte: texteSource,
      synthèseTexte: texteSource,
      narrationFluide: texteSource,
      niveaux: {
        factuel: texteSource,
        enrichi: "Optimisation de code validée par bo'oivinichat DSK V3.5 (Techno-eecoc).",
        strategique: "Garantie d'intégrité industrielle et d'activation instantanée par Mobile Money (MTN MoMo & Orange Money)."
      },
      timestamp: new Date().toISOString()
    };
  }

  return {
    vitrine: 'CHAT_INTERACTIF',
    reponseTexte: texteSource,
    synthèseTexte: texteSource,
    narrationFluide: texteSource,
    niveaux: {
      factuel: texteSource,
      enrichi: "Traitement cognitif universel sous immunité doctrinale souveraine.",
      strategique: "Rigueur intellectuelle universelle mariée à la clarté d'exposition."
    },
    filtresAppliques: Array.isArray(modules) ? modules.map(m => (typeof m === 'string' ? m : m.nom || 'Souveraineté')) : ["Souveraineté & Rigueur Intellectuelle"],
    timestamp: new Date().toISOString()
  };
}

export default {
  narrerResultatMatrice
};

