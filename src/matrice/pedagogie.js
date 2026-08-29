/**
 * MATRICE PÉDAGOGIE - Clarté visuelle et transmission du savoir
 */
export const MATRICE_PEDAGOGIE = {
  devise: "Rendre la connaissance vivante et accessible",
  methode: "Explication pas à pas, synthèse rigoureuse et exemples concrets"
};

export function formaterPedagogique(texte) {
  return {
    clarte: "Optimale",
    accessibilite: "Universelle",
    contenu: texte
  };
}

export default {
  MATRICE_PEDAGOGIE,
  formaterPedagogique
};
