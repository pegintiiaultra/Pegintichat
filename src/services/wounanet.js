/**
 * SERVICE WOUNANET - Service d'ingestion et de monitoring de flux en direct
 */
import { actualitesSouveraines, indicateursVeille, rechercherWounanet } from '../wounanet.js';

export const serviceWounanet = {
  getFlux: () => actualitesSouveraines,
  getIndicateurs: () => indicateursVeille,
  rechercher: (query, categorie) => rechercherWounanet(query, categorie)
};

export default serviceWounanet;
