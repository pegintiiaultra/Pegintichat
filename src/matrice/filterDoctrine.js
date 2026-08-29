/**
 * FILTER DOCTRINE - Filtrage des biais et préservation de l'authenticité
 */
import { MODULES_DOCTRINAUX } from '../modules/filtresDoctrinaux.js';

export function filtrerParDoctrine(requete) {
  const q = String(requete || '').toLowerCase();
  const actifs = MODULES_DOCTRINAUX.filter(m => 
    m.declencheurs.some(d => q.includes(d.toLowerCase()))
  );
  return {
    modulesActifs: actifs.length > 0 ? actifs : [MODULES_DOCTRINAUX[0]],
    conformite: "100%"
  };
}

export default {
  filtrerParDoctrine
};
