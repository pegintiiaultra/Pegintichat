async function analyserSujet(sujet, mode = 'standard') {
  // Ici on branchera Gemini avec process.env.GEMINI_API_KEY
  return {
    sujet,
    mode,
    statut_matrice: "DSK_ANALYSIS_SUCCESS",
    horodatage: new Date().toISOString(),
    synthese: `Traitement de "${sujet}" avec l'algorithme DSK (${mode}).`,
    recommandations: [
      "Aligner sur la doctrine MAAT",
      "Structure 90 jours",
      "Persévérance des bâtisseurs"
    ]
  };
}
module.exports = { analyserSujet };
