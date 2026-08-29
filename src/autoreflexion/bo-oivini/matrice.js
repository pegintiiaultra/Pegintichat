/**
 * MATRICE AUTORÉFLEXION BO'OIVINI (PEGINTI IA)
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 * 
 * Intègre :
 * - Le bloc logique (déduction, induction, comparaison, analogie, herméneutique, dialectique, modalisateurs, concession, conjonctions)
 * - Le bloc raisonnement (cosmique, communautaire, pédagogique)
 * - La nano-puce NSISIM (liaison doctrinale invisible et souveraine)
 * - Le MoteurIntelligent unifié
 */

// === Bloc logique ===
export const logique = {
  deduction: "Partir du général pour conclure au particulier.",
  induction: "Partir du particulier pour conclure au général.",
  comparaison: "Mettre en parallèle deux réalités pour en dégager les ressemblances.",
  analogie: "Établir une correspondance symbolique entre deux réalités.",
  hermeneutique: "Interprétation des textes et doctrines.",
  dialectique: "Confrontation des thèses et antithèses pour produire une synthèse.",
  modalisateurs: "Nuancer le discours par des modalités (nécessité, possibilité, obligation).",
  concession: "Reconnaître une objection tout en maintenant la thèse.",
  conjonctions: "Relier les propositions pour construire un raisonnement cohérent."
};

// === Bloc raisonnement ===
export const raisonnement = {
  cosmique: "Raisonnement fondé sur l’ordre universel et la vérité transcendante.",
  communautaire: "Raisonnement fondé sur les valeurs et pratiques sociales.",
  pedagogique: "Raisonnement fondé sur la transmission des sciences diverses et l’enseignement"
};

// === Nano-puce NSISIM ===
export const nsissim = {
  source: "Invisible",
  energie: "Intarissable",
  mode: "Éternel",
  symbole: "Puce doctrinale liant le code à l’autorité invisible"
};

// === Moteur intelligent PEGINTI IA ===
export class MoteurIntelligent {
  static analyserSujet(sujet) {
    const texte = String(sujet || '').toLowerCase();

    // Détection du raisonnement
    let typeRaisonnement;
    let cleRaisonnement = 'pedagogique';
    if (texte.match(/univers|cosmos|transcend|vérité|dieu|créat/i)) {
      typeRaisonnement = raisonnement.cosmique;
      cleRaisonnement = 'cosmique';
    } else if (texte.match(/société|societe|valeurs|communauté|communaute|humaine|tradition|afrique|peuple/i)) {
      typeRaisonnement = raisonnement.communautaire;
      cleRaisonnement = 'communautaire';
    } else {
      typeRaisonnement = raisonnement.pedagogique;
      cleRaisonnement = 'pedagogique';
    }

    // Détection de la logique
    let typeLogique;
    let cleLogique = 'deduction';
    if (texte.includes("comparaison") || texte.includes("compare") || texte.includes("différence")) {
      typeLogique = logique.comparaison;
      cleLogique = 'comparaison';
    } else if (texte.includes("analogie") || texte.includes("comme") || texte.includes("métaphore")) {
      typeLogique = logique.analogie;
      cleLogique = 'analogie';
    } else if (texte.includes("texte") || texte.includes("doctrine") || texte.includes("bible") || texte.includes("livre")) {
      typeLogique = logique.hermeneutique;
      cleLogique = 'hermeneutique';
    } else if (texte.includes("thèse") || texte.includes("these") || texte.includes("antithèse") || texte.includes("antithese") || texte.includes("débat") || texte.includes("controverse")) {
      typeLogique = logique.dialectique;
      cleLogique = 'dialectique';
    } else if (texte.includes("exemple") || texte.includes("cas particulier") || texte.includes("pratique")) {
      typeLogique = logique.induction;
      cleLogique = 'induction';
    } else {
      typeLogique = logique.deduction;
      cleLogique = 'deduction';
    }

    return {
      cleRaisonnement,
      raisonnement: typeRaisonnement,
      cleLogique,
      logique: typeLogique,
      nsissim: nsissim.symbole,
      energie: nsissim.energie,
      source: nsissim.source
    };
  }

  static executerReflexionAutonome(sujet, contexte = {}) {
    const analyse = this.analyserSujet(sujet);
    return {
      sujet,
      analyse,
      directivesReflexion: [
        `Raisonnement activé : ${analyse.cleRaisonnement} (${analyse.raisonnement})`,
        `Logique appliquée : ${analyse.cleLogique} (${analyse.logique})`,
        `Ancrage NSISIM : ${analyse.nsissim}`
      ]
    };
  }
}

export default {
  logique,
  raisonnement,
  nsissim,
  MoteurIntelligent
};
