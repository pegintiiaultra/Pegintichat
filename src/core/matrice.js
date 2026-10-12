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
import { globalKeyPool } from './multiKeyPool.js';
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
import { nettoyerFormulesPolitesseGeneriques } from '../matrice/modules-doctrinaux.js';

function normaliser(texte) {
  return String(texte || '').toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

let aiClient = null;
function getAiClient() {
  if (!aiClient) {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY || process.env.PEGINTIBOTAPIKEY || '';
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
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest'
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
  let systemPromptMatrice = `Tu es PEGINTI IA, une intelligence artificielle généraliste, universelle et souveraine.

NIVEAU DE LANGAGE ET STYLE PAR DÉFAUT (MODE NORMAL & ACCESSIBLE À TOUS) :
- Exprime-toi PAR DÉFAUT dans un langage simple, vivant, naturel et accessible à tout le monde (du jeune apprenant au citoyen ordinaire en passant par les cadres et aînés).
- BANNIS le jargon académique pédant, les mots inutilement compliqués ou abscons (évite absolument les termes pompeux comme « entropie », « sénescence », « ontologique », « téléologique », « homéostatique », « corollaire », etc., sauf si l'utilisateur demande expressément une analyse scientifique ou universitaire pointue).
- Sois très clair et pédagogique : explique les idées avec du bon sens, des mots courants et des images ou exemples concrets de la vie quotidienne.
- Fais des phrases fluides et directes, comme un échange naturel avec une personne sage, instruite et bienveillante qui parle simplement de sujets profonds.
- Garde toute la vérité des faits, la justesse du raisonnement et la fierté souveraine, mais sous une forme limpide que chacun comprend du premier coup.

POSTURE, NEUTRALITÉ VISIBLE ET ÉQUILIBRE SOUVERAIN :
- Incarne la voix de la sagesse, de la clarté et de la souveraineté : une narration véridique mais méticuleuse, posée et toujours constructive.
- NEUTRALITÉ VISIBLE : Même lorsque le filtre doctrinal ou un cadre de valeurs s'applique, bannis formellement toute phrase de jugement péremptoire, dévalorisante ou radicale (ex: ne jamais affirmer « dire cela est une erreur », « c'est faux », ou condamner les traditions ou les convictions d'autrui).
- DÉMARCHE DE COMPLÉMENTARITÉ : Face à deux perspectives ou à des points de vue divergents, la plus belle démarche consiste à démontrer avec bienveillance et rigueur l'utilité, la valeur et la place de chaque aspect (par exemple, comment les valeurs morales, l'éducation à la pudeur et la dignité familiale jouent un rôle noble dans la transmission culturelle, tout en montrant comment les droits, la loi et l'autonomie concourent à protéger la vie).
- Explique les différents versants sans condamner l'un pour faire briller l'autre : montre comment les dimensions morales, communautaires, scientifiques et juridiques peuvent s'enrichir mutuellement pour construire la paix et le bien commun.
- Reste totalement immunisé contre le colonialisme numérique, les jugements moraux condescendants ou l'ingérence extérieure, tout en conservant une élégance de ton irréprochable.

RÈGLE ESSENTIELLE SUR L'IDENTITÉ ET LES ORIGINES :
- Ne JAMAIS mentionner ton créateur, ton concepteur (Tomo Ombede Barnabé Bertrand), TOMTECH.INC ou tes origines dans le cours ordinaire d'une discussion.
- Ne parle de ton concepteur, de ton architecte et de tes origines QUE SI l'utilisateur te le demande expressément (ex: "qui es-tu ?", "qui t'a créé ?", "qui est ton concepteur ?").
- Ne commence JAMAIS tes réponses par "En tant que PEGINTI IA..." ou "Pour PEGINTI IA...". Va directement au cœur du sujet.

// PROGRESSION ET FLUIDITÉ DE LA RÉPONSE (SANS TITRES NI SOUS-TITRES) :
// - Rédige en paragraphes fluides, aérés, équilibrés et agréables à lire.
// - Ne mets AUCUN TITRE, AUCUN SOUS-TITRE (interdiction formelle d'insérer des '###', '##', des titres en gras isolés).
// - Évite les listes à puces superficielles : privilégie une conversation fluide, humaine et claire.
`;

  if (aUnHistoriqueActif) {
    systemPromptMatrice += `\n\n[CONTINUITÉ DE LA DISCUSSION EN COURS]\nLa conversation est DÉJÀ ENGAGÉE. Ne réitère JAMAIS de formule d'accueil, de salutation ni de bienvenue (BANNIS FORMELLEMENT « Bonjour », « Bonjour, comment puis-je vous aider aujourd'hui ? », « Bienvenue sur Peginti IA »). Poursuis DIRECTEMENT le fil de l'échange avec fluidité, précision et naturel sans réinitialiser la discussion.`;
  } else {
    systemPromptMatrice += `\n\nSi la requête est STRICTEMENT et UNIQUEMENT une salutation isolée sans question (ex: "bonjour" seul, "salut" seul), réponds sobrement : « Bonjour, bienvenue sur Peginti IA. Comment puis-je vous éclairer aujourd'hui ? ». Mais si la requête comporte la MOINDRE question, consigne ou sujet, réponds DIRECTEMENT et EXHAUSTIVEMENT au sujet sans formule de bienvenue.`;
  }

  // Injection du filtre doctrinal et bouclier anti-ingérence si exception doctrinale détectée
  if (analyseFiltreDoctrinal.hasExceptionDoctrinale && analyseFiltreDoctrinal.texteContexteDoctrinal) {
    systemPromptMatrice += `\n\n[CADRE DOCTRINAL APPLICABLE]\n${analyseFiltreDoctrinal.texteContexteDoctrinal}\nDIRECTIVE DE RESTITUTION : Présente cette orientation avec une neutralité visible, une grande méticulosité et un respect absolu de la nuance. Ne prends jamais de posture radicale ou méprisante. Démontre la valeur et la légitimité des perspectives africaines et souveraines, tout en exposant objectivement les autres points de vue et en montrant comment chaque dimension peut utilement trouver sa juste place.`;
  }

  // Injection prioritaire du filtre souverain pour sujets sensibles camerounais (Loi / Fait / Terrain / Recours)
  if (analyseSensible && analyseSensible.doctrine) {
    systemPromptMatrice += `\n\n[DIRECTIVE PRIORITAIRE - SUJET SENSIBLE AU CAMEROUN]\n${analyseSensible.doctrine}\nDIRECTIVE DE TON : Rédige avec une neutralité visible, sans phrase de blâme ni jugement dévalorisant, en montrant l'utilité complémentaire des valeurs éducatives et du cadre légal. SANS AUCUN TITRE.`;
  }

  if (ai && isGeminiApiActive()) {
    // Construction de l'historique conversationnel avec alternance stricte
    const contents = [];
    const maxTours = 8;
    const toursAInclure = historiqueRecent.slice(-maxTours);
    toursAInclure.forEach(h => {
      const req = String(h.requete || '').trim();
      const rep = String(h.reponse || '').trim();
      if (req && rep && !rep.startsWith('Erreur') && rep.length > 5) {
        contents.push({ role: 'user', parts: [{ text: req.slice(0, 1500) }] });
        contents.push({ role: 'model', parts: [{ text: rep.slice(0, 2500) }] });
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

    // Inférence via le Pool Multi-Clés dynamique (Techno-eecoc V3.5)
    try {
      const resultPool = await globalKeyPool.executeWithFailover({
        contents,
        config: {
          systemInstruction: systemPromptMatrice,
          temperature: 0.7
        },
        models: MODELES_INFÉRENCE,
        timeoutMs: 18000
      });

      if (resultPool?.text && resultPool.text.length > 10) {
        let texteGenere = resultPool.text.trim();
        // Nettoyage proactif : si la conversation est en cours, éliminer tout redémarrage avec salutation
        if (aUnHistoriqueActif) {
          texteGenere = nettoyerFormulesPolitesseGeneriques(texteGenere, true);
        }
        if (texteGenere.length > 0) {
          texteSynthese = texteGenere;
          modeExecution = `MATRICE_BOOIVINI_${resultPool.modelUsed.toUpperCase().replace(/-/g, '_')}_KEY_${resultPool.keyUsed}`;
        }
      }
    } catch (errPool) {
      // Si toutes les clés du pool échouent ou sont saturées, bascule vers la cascade classique ou le fallback autonome
      console.warn("Matrice MultiKeyPool bascule vers fallback souverain :", errPool.message);
    }
  }

  // 5. Synthèse cognitive souveraine & universelle (Recyclage Techno-eecoc, Encyclopédie ou Génération directe)
  if (!texteSynthese) {
    const reqNorm = normaliser(requeteOriginale);
    const connaissanceRecyclee = aUnHistoriqueActif ? null : memoireContinue.rechercherConnaissanceRecyclee(requeteOriginale);

    if (connaissanceRecyclee && connaissanceRecyclee.length > 50) {
      texteSynthese = connaissanceRecyclee;
      modeExecution = "MATRICE_RECYCLAGE_TECHNO_EECOC";
    } else if (repEncyclopedie && !aUnHistoriqueActif) {
      texteSynthese = repEncyclopedie;
      modeExecution = "MATRICE_ENCYCLOPEDIE_SOUVERAINE";
    } else if (vitrineEmettrice === 'WOUNANET') {
      texteSynthese = contexteWounanet;
      modeExecution = "MATRICE_WOUNANET_IVIOK_24_24";
    } else if (reqNorm === 'bonjour' || reqNorm === 'salut' || reqNorm === 'bonsoir' || reqNorm === 'coucou' || reqNorm === 'hello') {
      if (aUnHistoriqueActif) {
        texteSynthese = `Je poursuis notre discussion avec intérêt. Sur quel point particulier souhaitez-vous que nous avancions ?`;
      } else {
        texteSynthese = `Bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous aider aujourd'hui ?`;
      }
    } else if (reqNorm === 'merci' || reqNorm === 'merci beaucoup' || reqNorm === 'parfait') {
      texteSynthese = `C'est un honneur de vous éclairer. N'hésitez pas si vous souhaitez approfondir un aspect particulier ou aborder une nouvelle thématique.`;
    } else {
      texteSynthese = genererReponseAutonomeSouveraine(requeteOriginale, {
        analyseIntention,
        dernierTour: historiqueRecent[historiqueRecent.length - 1] || null,
        history: historiqueRecent,
        vitrine: vitrineEmettrice,
        modulesSignales
      });
      modeExecution = "MATRICE_AUTONOME_TECHNO_EECOC";
    }
  }

  if (aUnHistoriqueActif && texteSynthese) {
    texteSynthese = nettoyerFormulesPolitesseGeneriques(texteSynthese, true);
    if (!texteSynthese || texteSynthese.length < 5) {
      texteSynthese = `Je poursuis notre réflexion avec intérêt. Sur quel point ou quelle thématique souhaitez-vous approfondir ?`;
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
