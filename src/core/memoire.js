/**
 * MÉMOIRE CONTINUE, EXTENSIBLE ET PERMANENTE (MATRICE BO'OIVINI)
 * PEGINTI IA · TomTech.inc
 * 
 * Architecture TECHNO-EECOC V3.5 :
 * - Mémoire permanente extensible enregistrant toutes les interactions et synthèses.
 * - Auto-enrichissement progressif : réutilisation et recyclage des tenseurs et réponses abordées.
 * - Aucune réponse générique ni fallback : restitution directe de haute valeur cognitive.
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
        valeur: "Rigueur intellectuelle universelle mariée à la clarté d'exposition. Frugalité Techno-eecoc V3.5."
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
    this.baseConnaissancesRecyclees = [];
    this.derniersFluxWounanet = [];
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
        if (Array.isArray(data.baseConnaissancesRecyclees)) {
          this.baseConnaissancesRecyclees = data.baseConnaissancesRecyclees;
        }
        if (Array.isArray(data.derniersFluxWounanet)) {
          this.derniersFluxWounanet = data.derniersFluxWounanet;
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
        baseConnaissancesRecyclees: this.baseConnaissancesRecyclees.slice(0, 300),
        derniersFluxWounanet: this.derniersFluxWounanet.slice(0, 50),
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

    // Auto-enrichissement permanent : recyclage de la connaissance (Techno-eecoc)
    if (tour.requete && tour.reponse && tour.reponse.length > 30) {
      this.indexerConnaissanceRecyclee(tour.requete, tour.reponse, tour.vitrine);
    }

    this.sauvegarderMemoireDisque();
  }

  indexerConnaissanceRecyclee(requete, reponse, vitrine = 'CHAT_INTERACTIF') {
    const qNorm = String(requete || '').toLowerCase().trim();
    if (qNorm.length < 4) return;

    // Ne jamais recycler de formules génériques de meublage, salutations ou messages d'erreur
    const repStr = String(reponse || '');
    const repLower = repStr.toLowerCase();
    if (
      repLower.includes("s'articule autour de ses principes fondamentaux") ||
      repLower.includes("l'analyse rigoureuse de «") ||
      repLower.includes("concernant «") ||
      repLower.includes("je n'ai pas pu obtenir") ||
      repLower.includes("bienvenue sur peginti") ||
      repLower.includes("comment puis-je vous aider") ||
      repLower.includes("que voulez-vous explorer") ||
      repLower.includes("comment puis-je vous éclairer") ||
      repLower.includes("intelligence artificielle généraliste et souveraine")
    ) {
      return;
    }

    // Éviter les doublons exacts
    const indexExistant = this.baseConnaissancesRecyclees.findIndex(c => c.requeteNorm === qNorm);
    const item = {
      timestamp: new Date().toISOString(),
      requeteNorm: qNorm,
      requeteOriginale: requete,
      reponse,
      vitrine,
      occurences: indexExistant >= 0 ? (this.baseConnaissancesRecyclees[indexExistant].occurences || 1) + 1 : 1
    };

    if (indexExistant >= 0) {
      this.baseConnaissancesRecyclees[indexExistant] = item;
    } else {
      this.baseConnaissancesRecyclees.unshift(item);
      if (this.baseConnaissancesRecyclees.length > 300) {
        this.baseConnaissancesRecyclees.pop();
      }
    }
  }

  rechercherConnaissanceRecyclee(requete) {
    const qNorm = String(requete || '').toLowerCase().trim();
    if (!qNorm || qNorm.length < 3) return null;

    const estReponseValide = (rep) => {
      const s = String(rep || '');
      const sLower = s.toLowerCase();
      return s.length > 80 &&
        !sLower.startsWith("bonjour") &&
        !sLower.startsWith("salut") &&
        !sLower.includes("bonjour, comment puis-je vous aider") &&
        !sLower.includes("s'articule autour de ses principes fondamentaux") &&
        !sLower.includes("l'analyse rigoureuse de «") &&
        !sLower.includes("concernant «") &&
        !sLower.includes("je n'ai pas pu obtenir") &&
        !sLower.includes("bienvenue sur peginti") &&
        !sLower.includes("comment puis-je vous aider") &&
        !sLower.includes("que voulez-vous explorer") &&
        !sLower.includes("comment puis-je vous éclairer") &&
        !sLower.includes("intelligence artificielle généraliste et souveraine");
    };

    // Recherche exacte ou sémantiquement proche
    const exact = this.baseConnaissancesRecyclees.find(c => c.requeteNorm === qNorm);
    if (exact && estReponseValide(exact.reponse)) return exact.reponse;

    // Recherche par inclusion de mots clés significatifs (longueur >= 4)
    const mots = qNorm.split(/\s+/).filter(m => m.length >= 4);
    if (mots.length >= 2) {
      let meilleurMatch = null;
      let maxScore = 0;

      for (const item of this.baseConnaissancesRecyclees) {
        if (!estReponseValide(item.reponse)) continue;
        let score = 0;
        for (const mot of mots) {
          if (item.requeteNorm.includes(mot)) score++;
        }
        if (score >= Math.ceil(mots.length * 0.75) && score > maxScore) {
          maxScore = score;
          meilleurMatch = item;
        }
      }

      if (meilleurMatch) return meilleurMatch.reponse;
    }

    return null;
  }

  synchroniserFluxWounanet(flux = []) {
    if (!Array.isArray(flux) || flux.length === 0) return;
    this.derniersFluxWounanet = flux.slice(0, 50);
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
      statutMemoire: "CONTINUE_EXTENSIBLE_PERMANENTE_TECHNO_EECOC",
      totalSessionsActives: this.registreSessions.size,
      totalConnaissancesRecyclees: this.baseConnaissancesRecyclees.length,
      derniersFluxWounanetActifs: this.derniersFluxWounanet.length,
      connaissancesPermanentes: this.connaissancesPermanentes,
      derniersFlux: this.dernieresRequetes.slice(0, 5)
    };
  }
}

export const memoireContinue = new MemoireContinueSouveraine();
export default memoireContinue;


