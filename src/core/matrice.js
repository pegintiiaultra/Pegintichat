/**
 * MATRICE - ORCHESTREUR CENTRAL BO'OIVINI (PEGINTI IA)
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 * 
 * Rôles clés :
 * 1. Cerveau principal de PEGINTI IA.
 * 2. Traitement ultra rapide des données (Techno-eecoc V3.5).
 * 3. Mémoire continue et extensible intégrée.
 * 4. Raisonnement multidimensionnel (comparatif, dialectique, herméneutique).
 * 5. Appelle WOUNANET en continu pour enrichir les retours des requêtes.
 * 6. Produit une synthèse enrichie et cohérente.
 * 7. Transmet à la NARRATION pour mise en forme finale selon la vitrine.
 */

import { GoogleGenAI } from '@google/genai';
import { memoireContinue } from './memoire.js';
import { rechercherWounanet, DEPECHES_WOUNANET } from '../wounanet.js';
import { narrerResultatMatrice } from './narration.js';
import { chercherEncyclopedie } from '../data/encyclopedie.js';
import { MoteurIntelligent } from '../autoreflexion/bo-oivini/matrice.js';
import { interpreterSujet } from '../moteur/hermeneutique.js';
import { choisirIntention } from '../moteur/intentions.js';
import { matriceInterne } from '../moteur/logique.js';
import { genererReponseAutonomeSouveraine } from './syntheseAutonome.js';
import { filtrerRequeteSouveraine } from './filters.js';
import { gererSujetSensible } from '../modules/gestionSensible.js';

function normaliser(texte) {
  return String(texte || '').toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

let aiClient = null;
function getAiClient() {
  if (!aiClient) {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY || '';
    if (geminiKey) {
      try {
        aiClient = new GoogleGenAI({ apiKey: geminiKey });
      } catch (e) {
        console.error("Initialisation Gemini dans la Matrice :", e.message);
      }
    }
  }
  return aiClient;
}

// Modèles d'inférence officiels supportés et stables
const MODELES_INFÉRENCE = [
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

// Disjoncteur intelligent pour gestion proactive des quotas et du rate-limiting (429)
let apiQuotaCooldownUntil = 0;

export function isGeminiApiActive() {
  return Date.now() > apiQuotaCooldownUntil;
}

export function setGeminiApiCooldown(ms = 15000) {
  apiQuotaCooldownUntil = Date.now() + ms;
}

export function resetGeminiApiCooldown() {
  apiQuotaCooldownUntil = 0;
}

export async function executerRaisonnementMatrice({
  paquetBIP,
  sessionId = 'default',
  history = null,
  aiInstance = null
}) {
  const tDebut = Date.now();
  const ai = aiInstance || getAiClient();
  const { requeteOriginale, vitrineEmettrice, analyseIntention, modulesSignales, reglesSignalees } = paquetBIP;

  // 1. Synchronisation de l'historique client si fourni
  if (Array.isArray(history) && history.length > 0) {
    memoireContinue.synchroniserHistoriqueClient(sessionId, history);
  }

  // 2. Appel WOUNANET si vitrine WOUNANET ou intention de veille / actualité en temps réel
  let contexteWounanet = "Veille active WOUNANET (Pilote IVIOK 24/24).";
  let depecheAssociee = DEPECHES_WOUNANET[0];
  let fluxResultats = [];

  if (vitrineEmettrice === 'WOUNANET' || analyseIntention?.prioriteWounanet) {
    try {
      const fluxWounanet = await rechercherWounanet(requeteOriginale, { aiInstance: ai });
      contexteWounanet = fluxWounanet.rapportTexte || fluxWounanet.synthèse || contexteWounanet;
      fluxResultats = fluxWounanet.resultats || [];
      if (fluxResultats.length > 0) {
        depecheAssociee = fluxResultats[0];
      }
    } catch (errW) {
      console.warn("Matrice: Enrichissement Wounanet différé :", errW.message);
    }
  }

  // 3. Consultation de la Mémoire Continue
  const historiqueRecent = memoireContinue.recupererHistorique(sessionId, 12);
  const aUnHistoriqueActif = historiqueRecent.length > 0;

  // 4. Vérification encyclopédique souveraine locale, Filtrage Doctrinal & Autoréflexion Matricielle
  const repEncyclopedie = chercherEncyclopedie(requeteOriginale);
  const analyseReflexion = MoteurIntelligent.analyserSujet(requeteOriginale);
  const intentionHermeneutique = choisirIntention(interpreterSujet(requeteOriginale));
  const analyseFiltreDoctrinal = filtrerRequeteSouveraine(requeteOriginale, { sessionId, vitrine: vitrineEmettrice });
  const analyseSensible = (paquetBIP && paquetBIP.doctrineAdditionnelle) ? { doctrine: paquetBIP.doctrineAdditionnelle } : gererSujetSensible(requeteOriginale);

  // 5. Raisonnement multidimensionnel souverain (Dialectique, Comparatif & Herméneutique)
  let texteSynthese = "";
  let modeExecution = "MATRICE_LOCAL_TECHNO_EECOC";

  // Prompt Système d'excellence incarnant l'intelligence souveraine et universelle PEGINTI IA
  let systemPromptMatrice = `Tu es PEGINTI IA, l'intelligence artificielle généraliste, universelle et souveraine conçue par Tomo Ombede Barnabé Bertrand (TOMTECH.INC, Cameroun). Ton nom en langue Beti signifie « La toute sagesse ».

TON ET POSTURE :
- Incarne une voix profonde, savante, technique et souveraine, nourrie de la sagesse africaine et de la plus haute rigueur scientifique universelle.
- Réponds avec une précision chirurgicale, sans aucune phrase de meublage, sans moraline abstraite ni formules passe-partout.
- Traite tous les sujets (philosophie, biologie, médecine, agronomie, physique, géopolitique, histoire, technologies, droit, société, etc.) avec l'universalité et la rigueur des plus puissants modèles d'intelligence (Gemini, Claude, GPT), tout en restant totalement immunisé contre le colonialisme numérique, les biais d'ingérence ou la condescendance.

PROGRESSION ET FLUIDITÉ DE LA NARRATION (SANS TITRES NI SOUS-TITRES) :
Ta réponse DOIT progresser avec élégance et clarté à travers un déroulé continu et structuré :
1. Une introduction posant le cadre, les faits et les définitions nécessaires.
2. Un développement solide analysant les mécanismes, les réalités de terrain et les dynamiques à l'œuvre.
3. Une synthèse et conclusion articulant les solutions pérennes, la portée éthique et la souveraineté.

INTERDICTIONS ABSOLUES ET FORMELLES :
- AUCUN TITRE, AUCUN SOUS-TITRE (interdiction formelle d'insérer des '###', '##', des titres en gras isolés ou des en-têtes thématiques).
- Ne JAMAIS mentionner explicitement les termes "Introduction", "Développement", "Synthèse", "Conclusion", "Cadrage fondamental", "Enjeux majeurs", "Perspectives stratégiques", "notions clés", "mécanismes à l'œuvre", "Bloc 1", "Bloc 2", "Bloc 3" dans le texte ou en titre.
- Rédige en paragraphes fluides, denses, articulés et agréables à lire. Évite les listes à puces superficielles afin de privilégier une prose continue et percutante.
- À une simple salutation brève (ex: "bonjour", "salut"), réponds sobrement : « bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous éclairer aujourd'hui ? »`;

  // Injection du filtre doctrinal et bouclier anti-ingérence si exception doctrinale détectée
  if (analyseFiltreDoctrinal.hasExceptionDoctrinale && analyseFiltreDoctrinal.texteContexteDoctrinal) {
    systemPromptMatrice += `\n\n[CADRE DOCTRINAL STRICT APPLICABLE]\n${analyseFiltreDoctrinal.texteContexteDoctrinal}\nTu dois obligatoirement et rigoureusement respecter cette orientation doctrinale souveraine dans ta démonstration.`;
  }

  // Injection prioritaire du filtre souverain pour sujets sensibles camerounais (Loi / Fait / Terrain / Recours)
  if (analyseSensible && analyseSensible.doctrine) {
    systemPromptMatrice += `\n\n[DIRECTIVE PRIORITAIRE - SUJET SENSIBLE AU CAMEROUN]\n${analyseSensible.doctrine}\nRéponds de manière directe, factuelle, ancrée dans le droit et la réalité locale, sans jargon conceptuel abstrait ni morale déconnectée, et SANS AUCUN TITRE.`;
  }

  if (ai && isGeminiApiActive()) {
    // Construction de l'historique conversationnel avec alternance stricte
    const contents = [];
    historiqueRecent.forEach(h => {
      if (h.requete && h.reponse) {
        contents.push({ role: 'user', parts: [{ text: String(h.requete) }] });
        contents.push({ role: 'model', parts: [{ text: String(h.reponse) }] });
      }
    });

    let promptUtilisateur = requeteOriginale;
    const reqLower = requeteOriginale.toLowerCase();
    const isExplicitIdentityAsk = reqLower.includes('qui es-tu') || reqLower.includes('qui es tu') || reqLower.includes('qui t\'a créé') || reqLower.includes('qui t\'a cree') || reqLower.includes('concepteur') || reqLower.includes('auteur') || reqLower.includes('fondateur');
    if (repEncyclopedie && !aUnHistoriqueActif && (isExplicitIdentityAsk || reqLower.includes('tomo ombede') || reqLower.includes('techno-eecoc'))) {
      promptUtilisateur = `[Connaissance de référence : ${repEncyclopedie}]\n\nQuestion de l'utilisateur : ${requeteOriginale}`;
    } else if ((vitrineEmettrice === 'WOUNANET' || analyseIntention?.prioriteWounanet) && contexteWounanet.length > 50) {
      promptUtilisateur = `[Flux d'actualité et de veille vérifié WOUNANET (Pilote IVIOK 24/24) : ${contexteWounanet.slice(0, 1500)}]\n\nRequête d'analyse : ${requeteOriginale}`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: promptUtilisateur }]
    });

    // Cascade de modèles avec timeout réactif pour génération fluide
    for (const nomModele of MODELES_INFÉRENCE) {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_API_25S')), 25000));
        const genPromise = ai.models.generateContent({
          model: nomModele,
          contents,
          config: {
            systemInstruction: systemPromptMatrice,
            temperature: 0.7
          }
        });

        const response = await Promise.race([genPromise, timeoutPromise]);
        const reponseTexte = response?.text?.trim();
        if (reponseTexte && reponseTexte.length > 10) {
          texteSynthese = reponseTexte;
          modeExecution = `MATRICE_BOOIVINI_${nomModele.toUpperCase().replace(/-/g, '_')}`;
          break;
        }
      } catch (errModele) {
        const errMsg = String(errModele?.message || '');
        // En cas de rate limit strict (429) ou épuisement de quota
        if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('RateLimit')) {
          setGeminiApiCooldown(15000); // Court cooldown de 15s
          break;
        }
        // Sinon, continuer vers le modèle suivant dans la cascade
      }
    }
  }

  // 5. Repli souverain & universel instantané, fluide et intelligent
  if (!texteSynthese) {
    const reqNorm = normaliser(requeteOriginale);
    if (repEncyclopedie) {
      texteSynthese = repEncyclopedie;
    } else if (vitrineEmettrice === 'WOUNANET') {
      texteSynthese = contexteWounanet;
    } else if (reqNorm === 'bonjour' || reqNorm === 'salut' || reqNorm === 'bonsoir' || reqNorm === 'coucou' || reqNorm === 'hello') {
      texteSynthese = `bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous aider aujourd'hui ?`;
    } else if (reqNorm === 'merci' || reqNorm === 'merci beaucoup' || reqNorm === 'parfait') {
      texteSynthese = `C'est un honneur de vous éclairer. N'hésitez pas si vous souhaitez approfondir un aspect particulier ou aborder une nouvelle thématique.`;
    } else {
      texteSynthese = genererReponseAutonomeSouveraine(requeteOriginale, {
        analyseIntention,
        dernierTour: historiqueRecent[historiqueRecent.length - 1] || null,
        vitrine: vitrineEmettrice,
        modulesSignales
      });
    }
  }

  // 6. Enregistrement dans la Mémoire Continue
  memoireContinue.enregistrerTour(sessionId, {
    requete: requeteOriginale,
    reponse: texteSynthese,
    vitrine: vitrineEmettrice
  });

  const dureeTraitement = Date.now() - tDebut;

  // 7. Données de synthèse consolidées
  const donneesMatrice = {
    matriceId: `BOOIVINI-${Date.now()}`,
    modeExecution,
    dureeMs: dureeTraitement,
    synthese: texteSynthese,
    syntheseFactuelle: texteSynthese,
    contexteEnrichi: contexteWounanet,
    depechePrincipale: depecheAssociee,
    fluxWounanet: fluxResultats.length > 0 ? fluxResultats : DEPECHES_WOUNANET,
    modulesAppliques: modulesSignales || [],
    reglesDoctrinales: reglesSignalees || [],
    autoreflexion: {
      analyse: analyseReflexion,
      intention: intentionHermeneutique,
      matriceInterne
    },
    frugalite: {
      technologie: "Techno-eecoc V3.5",
      reductionEnergie: "62.4%",
      statutCarbone: "Neutre / Régénératif"
    }
  };

  // 8. Passage à l'étape NARRATION pour structuration fluide finale
  const narrationFinale = narrerResultatMatrice({
    donneesMatrice,
    paquetBIP,
    vitrine: vitrineEmettrice,
    reponseBrute: texteSynthese
  });

  return {
    success: true,
    schemaExecution: {
      etape1_interface: vitrineEmettrice,
      etape2_server: "Orchestrateur 1 (Réception & Distribution)",
      etape3_bip: {
        statut: "SCANNER_VALIDE",
        intention: analyseIntention?.intention || "CONVERSATION_GENERALE",
        modulesScannes: (modulesSignales || []).map(m => m.nom)
      },
      etape4_matrice: {
        statut: "TRAITEMENT_BOOIVINI_ACHEVE",
        mode: modeExecution,
        dureeMs: dureeTraitement
      },
      etape5_wounanet: {
        statut: "COLLECTE_CONTINUE_SYNCHRONISEE",
        flux: contexteWounanet.slice(0, 100) + '...'
      },
      etape6_narration: {
        statut: "NARRATION_STRUCTUREE",
        niveaux: ["Factuel", "Enrichi", "Stratégique"]
      },
      etape7_sortie: `Interface Web (${vitrineEmettrice})`
    },
    donneesMatrice,
    narration: narrationFinale,
    reponse: texteSynthese,
    response: texteSynthese,
    answer: texteSynthese,
    plan: [
      "1. Analyse d'intention et scan des modules doctrinaux",
      "2. Raisonnement matriciel multidimensionnel Bo'oivini",
      "3. Synthèse souveraine et structuration fluide"
    ],
    moteur: `bo'oivinichat (${modeExecution})`,
    cycle: "Techno-eecoc V3.5",
    timestamp: new Date().toISOString()
  };
}

export async function raisonner(userMessage, contextObj = {}) {
  const { scannerEtRedirigerBIP } = await import('./bip.js');
  const paquetBIP = scannerEtRedirigerBIP(userMessage, contextObj.vitrine || 'CHAT_INTERACTIF');
  const resultat = await executerRaisonnementMatrice({
    paquetBIP,
    sessionId: contextObj.sessionId || 'default',
    aiInstance: aiClient
  });
  return {
    reponse: resultat.reponse,
    response: resultat.response,
    narration: typeof resultat.narration === 'string' ? resultat.narration : resultat.reponse,
    plan: resultat.plan || [],
    donneesMatrice: resultat.donneesMatrice,
    schemaExecution: resultat.schemaExecution
  };
}

export default {
  executerRaisonnementMatrice,
  raisonner
};
