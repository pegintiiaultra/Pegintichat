/**
 * MATRICE AFRIQUE - Connaissances, Histoire et Géopolitique Africaine
 */

export const AFRIQUE_MATRICE = {
  region: "Afrique Centrale & Panafrique",
  pivot: "Cameroun (Afrique en miniature)",
  valeurs: [
    "Renaissance africaine",
    "Autonomie stratégique",
    "Solidarité communautaire",
    "Valorisation des langues et sagesses endogènes (Beti, etc.)"
  ]
};

export function contextualiserAfrique(sujet) {
  return {
    sujet,
    perspective: "Panafricaine souveraine",
    analyse: `Mise en perspective de « ${sujet} » selon les dynamiques de développement endogène et de souveraineté technologique africaine.`
  };
}

export default {
  nom: "Afrique (Panafricanisme & Développement Endogène)",
  AFRIQUE_MATRICE,
  contextualiserAfrique
};
