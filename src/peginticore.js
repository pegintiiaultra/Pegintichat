/**
 * PEGINTI CORE - Point d'entrée unifié du système cognitif
 * TOMTECH.INC · Tomo Ombede Barnabé Bertrand
 */

import { executerRaisonnementMatrice, raisonner } from './core/matrice.js';
import { scannerEtRedirigerBIP } from './core/bip.js';
import { IDENTITE_PEGINTI } from './identite.js';
import * as wounanet from './wounanet.js';
import * as premium from './premium.js';

export const PEGINTI_VERSION = '3.5.0';

export {
  executerRaisonnementMatrice,
  raisonner,
  scannerEtRedirigerBIP,
  IDENTITE_PEGINTI,
  wounanet,
  premium
};

export default {
  version: PEGINTI_VERSION,
  identite: IDENTITE_PEGINTI,
  raisonner,
  executerRaisonnementMatrice,
  scannerEtRedirigerBIP,
  wounanet,
  premium
};
