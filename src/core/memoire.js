/**
 * MÉMOIRE CONTINUE, EXTENSIBLE ET PERMANENTE (MATRICE BO'OIVINI)
 * PEGINTI IA · TomTech.inc
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEMOIRE_STORAGE_FILE = path.join(__dirname, '..', '..', 'data_memoire_souveraine.json');

class MemoireContinueSouveraine {
  constructor() {
    this.registreSessions = new Map();
    this.connaissancesPermanentes = [
      {
        cle: "CONCEPTEUR",
        valeur: "Tomo Ombede Barnabé Bertrand (Fondateur TOMTECH.INC, Cameroun)"
      },
      {
        cle: "DOCTRINE",
        valeur: "Rigueur intellectuelle mariée à la clarté visuelle. Frugalité Techno-eecoc V3.5."
      },
      {
        cle: "TECHNOLOGIE",
        valeur: "Techno-eecoc V3.5 & bo'oivinichat (Économie circulaire de calcul des tenseurs sans dépendance exclusive)."
      },
      {
        cle: "PAIEMENT_OFFICIEL",
        valeur: "MTN MoMo (+237 676867712) et Orange Money (+237 691482453) au nom de TOMO OMBEDE BARNABÉ BERTRAND."
      }
    ];
    this.dernieresRequetes = [];
    this.chargerMemoireDisque();
  }

  chargerMemoireDisque() {
    try {
      if (fs.existsSync(MEMOIRE_STORAGE_FILE)) {
        const raw = fs.readFileSync(MEMOIRE_STORAGE_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (data.sessions && typeof data.sessions === 'object') {
          Object.entries(data.sessions).forEach(([sid, tours]) => {
            if (Array.isArray(tours)) {
              this.registreSessions.set(sid, tours);
            }
          });
        }
        if (Array.isArray(data.dernieresRequetes)) {
          this.dernieresRequetes = data.dernieresRequetes;
        }
        if (Array.isArray(data.connaissancesPermanentes) && data.connaissancesPermanentes.length > 0) {
          this.connaissancesPermanentes = data.connaissancesPermanentes;
        }
      }
    } catch (e) {
      // Chargement en mémoire vive silencieux
    }
  }

  sauvegarderMemoireDisque() {
    try {
      const objSessions = {};
      this.registreSessions.forEach((tours, sid) => {
        objSessions[sid] = tours;
      });
      const data = {
        derniereMiseAJour: new Date().toISOString(),
        connaissancesPermanentes: this.connaissancesPermanentes,
        dernieresRequetes: this.dernieresRequetes.slice(0, 100),
        sessions: objSessions
      };
      fs.writeFileSync(MEMOIRE_STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // Ignorer si système de fichiers en lecture seule
    }
  }

  enregistrerTour(sessionId = 'default', tour = {}) {
    if (!this.registreSessions.has(sessionId)) {
      this.registreSessions.set(sessionId, []);
    }
    const session = this.registreSessions.get(sessionId);
    session.push({
      timestamp: new Date().toISOString(),
      ...tour
    });

    // Garder les 100 derniers échanges par session
    if (session.length > 100) {
      session.shift();
    }

    this.dernieresRequetes.unshift({
      timestamp: new Date().toISOString(),
      requete: tour.requete,
      vitrine: tour.vitrine
    });

    if (this.dernieresRequetes.length > 100) {
      this.dernieresRequetes.pop();
    }

    // Persistance automatique asynchrone
    this.sauvegarderMemoireDisque();
  }

  ajouterConnaissancePermanente(cle, valeur) {
    if (!cle || !valeur) return;
    const index = this.connaissancesPermanentes.findIndex(c => c.cle === cle);
    if (index >= 0) {
      this.connaissancesPermanentes[index].valeur = valeur;
    } else {
      this.connaissancesPermanentes.push({ cle, valeur });
    }
    this.sauvegarderMemoireDisque();
  }

  synchroniserHistoriqueClient(sessionId = 'default', clientHistory = []) {
    if (!Array.isArray(clientHistory) || clientHistory.length === 0) return;
    
    const parsedHistory = [];
    clientHistory.forEach(item => {
      const req = String(item.user || item.question || item.prompt || (item.role === 'user' ? item.content : '') || '').trim();
      const rep = String(item.bot || item.reponse || item.response || item.answer || (item.role === 'model' || item.role === 'assistant' ? item.content : '') || '').trim();
      if (req && rep) {
        parsedHistory.push({
          timestamp: new Date().toISOString(),
          requete: req,
          reponse: rep,
          vitrine: 'CHAT_INTERACTIF'
        });
      }
    });

    if (parsedHistory.length > 0) {
      this.registreSessions.set(sessionId, parsedHistory.slice(-100));
      this.sauvegarderMemoireDisque();
    }
  }

  recupererHistorique(sessionId = 'default', limite = 12) {
    const session = this.registreSessions.get(sessionId) || [];
    return session.slice(-limite);
  }

  reinitialiserSession(sessionId = 'default') {
    if (this.registreSessions.has(sessionId)) {
      this.registreSessions.delete(sessionId);
      this.sauvegarderMemoireDisque();
    }
  }

  obtenirContexteGlobal() {
    return {
      statutMemoire: "CONTINUE_EXTENSIBLE_PERMANENTE",
      totalSessionsActives: this.registreSessions.size,
      connaissancesPermanentes: this.connaissancesPermanentes,
      derniersFlux: this.dernieresRequetes.slice(0, 5)
    };
  }
}

export const memoireContinue = new MemoireContinueSouveraine();
export default memoireContinue;

