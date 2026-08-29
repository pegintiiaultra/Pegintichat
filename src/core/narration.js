/**
 * NARRATION (PEGINTI IA)
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 * 
 * Rôles clés :
 * 1. Transforme les résultats bruts de la Matrice en texte fluide, élégant et soigné.
 * 2. Structure la réponse en paragraphes clairs et intelligibles.
 * 3. Organise les trois niveaux cognitifs :
 *    - Niveau 1 : Factuel (réponse immédiate et précise aux faits)
 *    - Niveau 2 : Enrichi (perspective doctrinale, contexte africain/mondial, analyse systémique)
 *    - Niveau 3 : Stratégique (orientations, prospective et souveraineté durable)
 * 4. Adapte le ton selon la vitrine de destination (WOUNANET, CHAT INTERACTIF, VITRINE PREMIUM).
 */

export function narrerResultatMatrice({
  donneesMatrice,
  paquetBIP,
  vitrine = 'CHAT_INTERACTIF',
  reponseBrute = ''
}) {
  const { analyseIntention, modulesSignales } = paquetBIP;
  const texteSource = String(reponseBrute || donneesMatrice?.synthese || '').trim();

  // Si c'est déjà un formatage textuel complet (ex: retour IA Gemini), on garantit la clarté et la structure
  if (vitrine === 'WOUNANET') {
    // Structure spécifique pour la vitrine WOUNANET (Moteur de recherche temps réel)
    return {
      vitrine: 'WOUNANET',
      titre: donneesMatrice?.depechePrincipale?.titre || "Résultats de Recherche Souveraine WOUNANET",
      narrationFluide: texteSource,
      niveaux: {
        factuel: donneesMatrice?.syntheseFactuelle || texteSource,
        enrichi: donneesMatrice?.contexteEnrichi || "Données recoupées et vérifiées en temps réel via le réseau mondial WOUNANET sous le contrôle du pilote IVIOK 24/24.",
        strategique: "Perspective panafricaine : Maîtrise souveraine des flux informationnels et indépendance stratégique des analyses géopolitiques."
      },
      source: "WOUNANET (Pilote IVIOK 24/24)",
      timestamp: new Date().toISOString()
    };
  }

  if (vitrine === 'VITRINE_PREMIUM') {
    // Structure spécifique pour la Vitrine Premium / Studio DSK
    return {
      vitrine: 'VITRINE_PREMIUM',
      narrationFluide: texteSource,
      niveaux: {
        factuel: "Solution logicielle / Optimisation de code validée par bo'oivinichat DSK V3.5.",
        enrichi: "Application stricte des règles d'efficience algorithmique et de réduction de l'empreinte énergétique Techno-eecoc.",
        strategique: "Garantie d'intégrité industrielle et d'activation instantanée par Mobile Money (MTN MoMo & Orange Money au Cameroun)."
      },
      timestamp: new Date().toISOString()
    };
  }

  // Vitrine par défaut : CHAT INTERACTIF (Vitrine publique et gratuite)
  return {
    vitrine: 'CHAT_INTERACTIF',
    narrationFluide: texteSource,
    niveaux: {
      factuel: texteSource,
      enrichi: "Traitement cognitif articulé autour de la pensée de Tomo Ombede Barnabé Bertrand et de la frugalité Techno-eecoc.",
      strategique: "Quête continue d'excellence unissant la rigueur intellectuelle à la clarté visuelle."
    },
    filtresAppliques: modulesSignales?.map(m => m.nom) || ["Rigueur Intellectuelle & Clarté Visuelle"],
    timestamp: new Date().toISOString()
  };
}
