'use strict';

const { GoogleGenAI } = require('@google/genai');

let construirePlan = () => ['Répondre avec courtoisie et précision.'];
try {
  let cheminee = null;
  try {
    cheminee = require('./cheminee-de-raisonnement.js');
  } catch (e1) {
    // repli
  }
  if (cheminee && typeof cheminee.construirePlan === 'function') {
    construirePlan = cheminee.construirePlan;
  }
} catch (e) {
  // repli
}

let chatEngine = { modules: {}, processus: [], connecteurs: [] };
try {
  chatEngine = require('./chat.engine.json');
} catch (e) {
  // repli
}

let detecterIntention = (t) => ({ type: 'general', confiance: 0.8 });
let normaliser = (t) => String(t || '').toLowerCase().trim();
try {
  const intentionsMod = require('../moteur/intentions');
  if (typeof intentionsMod.detecterIntention === 'function') detecterIntention = intentionsMod.detecterIntention;
  if (typeof intentionsMod.normaliser === 'function') normaliser = intentionsMod.normaliser;
} catch (e) {
  // repli
}

let pegintiMatrice = {
  nom: "PEGINTI IA",
  concepteur: "Tomo Ombede Barnabé Bertrand (TOMTECH.INC)"
};
try {
  pegintiMatrice = require('./peginti.js');
} catch (e) {
  try {
    pegintiMatrice = require('../modules/peginti.js');
  } catch (e2) {
    // repli
  }
}

let chercherBaseEncyclopedique = () => null;
try {
  const ency = require('../data/encyclopedie.js');
  if (typeof ency.chercherBaseEncyclopedique === 'function') {
    chercherBaseEncyclopedique = ency.chercherBaseEncyclopedique;
  }
} catch (e) {
  chercherBaseEncyclopedique = () => null;
}

let detecterComplexite = () => ({ estComplexe: false });
try {
  const faculte = require('./faculte-analyse.js');
  if (typeof faculte.detecterComplexite === 'function') {
    detecterComplexite = faculte.detecterComplexite;
  }
} catch (e) {
  // repli
}

let aiClient = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
      aiClient = apiKey ? new GoogleGenAI({ apiKey }) : new GoogleGenAI({});
    } catch (e) {
      aiClient = null;
    }
  }
  return aiClient;
}

const MODEL_CANDIDATES = [
  'gemini-3.6-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.7-flash'
];

function callGeminiWithTimeout(ai, modelName, systemInstructionText, contentsArray, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        reject(new Error(`Timeout de ${timeoutMs}ms dépassé pour le modèle ${modelName}`));
      }
    }, timeoutMs);

    ai.models.generateContent({
      model: modelName,
      config: {
        systemInstruction: systemInstructionText,
        temperature: 0.7
      },
      contents: contentsArray
    }).then(res => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        resolve(res);
      }
    }).catch(err => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        reject(err);
      }
    });
  });
}

function raisonnerConversationLocale(sujet, contexte = {}) {
  const sTrim = String(sujet || '').trim();
  const sNorm = normaliser(sTrim);
  const historique = Array.isArray(contexte.historique) ? contexte.historique : [];

  if (/^(bonjour|bonsoir|salut|hello|hey|coucou|mbolo|bikela)$/i.test(sTrim)) {
    return "bonjour je suis peginti IA, une intelligence artificielle généraliste et souveraine. Que voulez-vous explorer aujourd'hui ?";
  }

  const isCorrectionOuRemarque = /(je viens de|je t'ai dit|le veritable nom|le vrai nom|son veritable nom|son vrai nom|c'est plutot|en fait c'est|tu te trompes|voila le nom|exactement|tout a fait|voici le nom|son nom complet)/i.test(sTrim);

  if (isCorrectionOuRemarque && /(nom|president|republique|cameroun|biya|binvondo|mvondo|barthelemy)/i.test(sTrim)) {
    return `En effet, vous avez parfaitement raison et je vous remercie pour cette précision exacte.

Le nom complet de naissance et d'état civil du chef de l'État camerounais est bien **Paul Barthélemy Biya'a bi Mvondo** (souvent retranscrit dans l'usage administratif : *Biya bi Mvondo Paul Barthélémy*), né le 13 février 1933 à Mvomeka'a.

Cette précision d'état civil est essentielle pour une parfaite rigueur documentaire. Avez-vous une autre question ou un volet institutionnel ou historique particulier que vous souhaitez approfondir ?`;
  }

  if (isCorrectionOuRemarque) {
    return `Merci beaucoup pour ce retour et cette précision constructive ! J'intègre cette indication dans notre fil d'échange. Souhaitez-vous approfondir cette thématique ou aborder un autre sujet ?`;
  }

  const isDemandeNom = /(quel est son (veritable|vrai|complet)?\s*nom|quelle est son (veritable|vrai|complet)?\s*nom|son nom complet|son veritable nom)/i.test(sTrim);
  if (isDemandeNom) {
    const histText = historique.slice(-4).map(h => h.content || h.text || h.message || '').join(' ').toLowerCase();
    if (histText.includes('biya') || histText.includes('cameroun') || histText.includes('president')) {
      return `Le véritable nom complet à l'état civil de S.E. Paul Biya est **Paul Barthélemy Biya'a bi Mvondo** (né le 13 février 1933 à Mvomeka'a, dans le Sud du Cameroun).`;
    }
    if (histText.includes('datouo') || histText.includes('assemblee')) {
      return `Le président de l'Assemblée nationale du Cameroun est l'honorable **Théodore Datouo** (élu le 17 mars 2026).`;
    }
    if (histText.includes('abdoulaye') || histText.includes('senat')) {
      return `Le président du Sénat du Cameroun est Sa Majesté **Aboubakary Abdoulaye** (Lamido de Rey-Bouba).`;
    }
    return `Pourriez-vous préciser de quelle personnalité ou institution vous souhaitez connaître le nom exact ? S'agit-il du président de la République, d'un dignitaire institutionnel ou d'un acteur contemporain ?`;
  }

  const encyMatch = chercherBaseEncyclopedique(sTrim);
  if (encyMatch) {
    let rep = encyMatch.reponse;
    if (encyMatch.developpement) rep += '\n\n' + encyMatch.developpement;
    if (encyMatch.conclusion) rep += '\n\n' + encyMatch.conclusion;
    return rep;
  }

  if (contexte.actualites) {
    if (typeof contexte.actualites === 'string' && contexte.actualites.trim()) {
      return `Voici les informations de veille Wounanet recueillies sur ce sujet :\n\n${contexte.actualites.trim()}`;
    } else if (contexte.actualites.text && typeof contexte.actualites.text === 'string' && contexte.actualites.text.trim()) {
      return contexte.actualites.text.trim();
    }
  }

  return `Sur le sujet « **${sTrim}** », PEGINTI IA mobilise ses connaissances et son analyse souveraine pour vous répondre de manière précise et interactive. N'hésitez pas à préciser un angle ou une question spécifique pour poursuivre notre échange !`;
}

async function generateAiResponse(sujet, contexte = {}) {
  const sTrim = String(sujet || '').trim();
  if (!sTrim) {
    return "Bonjour ! Je suis **PEGINTI IA**, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous éclairer ou vous accompagner aujourd'hui ?";
  }

  const intention = contexte.intention || detecterIntention(sTrim);
  if (intention.type === 'salutation' || /^(bonjour|bonsoir|salut|hello|hey|coucou|mbolo|bikela)$/i.test(sTrim)) {
    return "Bonjour ! Je suis **PEGINTI IA**, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous éclairer ou vous accompagner aujourd'hui ?";
  }

  const encyMatch = chercherBaseEncyclopedique(sTrim);

  let contextPrompt = '';
  if (contexte.actualites) {
    if (typeof contexte.actualites === 'string' && contexte.actualites.trim()) {
      contextPrompt += `\n[VEILLE TEMPS RÉEL WOUNANET (PILOTE IVIOK)] :\n${contexte.actualites.trim()}\n`;
    } else if (typeof contexte.actualites === 'object') {
      const articles = Array.isArray(contexte.actualites.articles) 
        ? contexte.actualites.articles 
        : (Array.isArray(contexte.actualites) ? contexte.actualites : []);
      
      if (articles.length > 0) {
        contextPrompt += `\n[RENSEIGNEMENTS EN TEMPS RÉEL (WOUNANET)] :\n` +
          articles.slice(0, 10).map((a, i) => `${i + 1}. [${a.pubDate || 'Récemment'}] ${a.title || ''} (Source: ${a.source || 'Presse'})`).join('\n') + '\n';
      } else if (contexte.actualites.text && typeof contexte.actualites.text === 'string' && contexte.actualites.text.trim()) {
        contextPrompt += `\n[VEILLE TEMPS RÉEL WOUNANET (PILOTE IVIOK)] :\n${contexte.actualites.text.trim()}\n`;
      }
    }
  }

  if (encyMatch) {
    contextPrompt += `\n[REPÈRES INSTITUTIONNELS & ENCYCLOPÉDIQUES SOUVERAINS CERTIFIÉS] :\n${encyMatch.reponse}\n${encyMatch.developpement || ''}\n`;
  }

  const systemInstructionText = `Vous êtes **PEGINTI IA**, une intelligence artificielle généraliste, souveraine, universelle, hautement interactive, cultivée et rigoureuse.
IDENTITÉ OFFICIELLE :
- Nom : PEGINTI IA
- Signification : « La toute sagesse » (en langue Beti)
- Créateur : Tomo Ombede Barnabé Bertrand
- Date & Lieu de création : 24 juillet 2025 à Yaoundé, Cameroun
- Maison technologique : TOMTECH.INC
- Mission : Fournir des réponses intelligentes, interactives, précises et utiles tout en promouvant le savoir universel et les valeurs africaines.

RÈGLES D'INTERACTION CONVERSATIONNELLE & FORMAT STRICT :
1. INTERACTIVITÉ VIVANTE : Vous conversez naturellement et intelligemment avec l'utilisateur. Vous retenez le fil de la discussion, comprenez les pronoms et répondez de façon fluide et chaleureuse.
2. RIGUEUR FACTUELLE ET EXACTITUDE :
   - Président du Cameroun : S.E. Paul Biya (nom complet à l'état civil : **Paul Barthélemy Biya'a bi Mvondo**, né le 13 février 1933 à Mvomeka'a).
   - Président de l'Assemblée nationale du Cameroun : L'honorable **Théodore Datouo** (RDPC), élu le 17 mars 2026.
   - Président du Sénat du Cameroun : S.M. **Aboubakary Abdoulaye** (Lamido de Rey-Bouba), élu le 17 mars 2026.
   - Vainqueur CAN féminine au Maroc : **Afrique du Sud (Banyana Banyana)** 2-1 face au Maroc.
3. STRUCTURE STRICTE EN TROIS PARAGRAPHES (OBLIGATOIRE) :
   - Pour toute question ou analyse de fond, votre réponse DOIT être composée d'EXACTEMENT TROIS PARAGRAPHES continus en prose soignée :
     * 1er paragraphe : Cadrage, mise en contexte et positionnement initial, précédé de son titre thématique au-dessus (ex: ### Titre du cadrage).
     * 2e paragraphe : Développement analytique, causes, mécanismes et dynamiques à l'œuvre, précédé de son titre thématique au-dessus (ex: ### Titre de l'analyse).
     * 3e paragraphe : Synthèse, perspectives d'avenir et vision pérenne, précédé de son titre thématique au-dessus (ex: ### Titre des perspectives).
   - INTERDICTION ABSOLUE : Ne JAMAIS mentionner explicitement les termes "Introduction", "Développement" ou "Conclusion" comme titres ou dans le corps du texte.
   - INTERDICTION ABSOLUE : Ne JAMAIS insérer de listes à puces (pas de *, -, •), ni d'énumérations numérotées (pas de 1., 2., 3.) au sein des paragraphes. Écrivez des paragraphes de texte continu, fluides et cohérents.
   - Si la question est une simple salutation brève, répondez simplement et courtoisement en une phrase d'accueil.

${contextPrompt}`;

  const contentsArray = [];
  if (contexte.historique && Array.isArray(contexte.historique) && contexte.historique.length > 0) {
    for (const h of contexte.historique.slice(-8)) {
      const role = (h.role === 'user' || h.sender === 'user') ? 'user' : 'model';
      const text = String(h.content || h.text || h.message || '').trim();
      if (text) {
        contentsArray.push({ role, parts: [{ text }] });
      }
    }
  }

  contentsArray.push({ role: 'user', parts: [{ text: sTrim }] });

  const ai = getAiClient();
  if (ai) {
    for (const modelName of MODEL_CANDIDATES) {
      try {
        const response = await callGeminiWithTimeout(ai, modelName, systemInstructionText, contentsArray, 5000);
        if (response && response.text && response.text.trim().length > 5) {
          return response.text.trim();
        }
      } catch (err) {
        const errMsg = String(err?.message || '');
        if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota') || errMsg.includes('403') || errMsg.includes('PERMISSION_DENIED')) {
          break; // Sortie immédiate en cas de quota dépassé ou restriction
        }
      }
    }
  }

  return raisonnerConversationLocale(sTrim, contexte);
}

function raisonnerSujet(sujet, intention, contexte) {
  const plan = construirePlan(intention, contexte);
  return {
    sujet,
    plan,
    modules: chatEngine.modules,
    processus: chatEngine.processus,
    connecteurs: chatEngine.connecteurs,
    conclusion: ''
  };
}

async function raisonner(sujet, contexte = {}) {
  const intention = detecterIntention(sujet);
  const planObj = raisonnerSujet(sujet, intention, contexte);
  const reponseTexte = await generateAiResponse(sujet, { ...contexte, intention });

  return {
    sujet,
    reponse: reponseTexte,
    developpement: '',
    conclusion: '',
    narration: reponseTexte,
    plan: planObj.plan,
    modules: planObj.modules,
    processus: planObj.processus,
    connecteurs: planObj.connecteurs
  };
}

async function analyserSujet(sujet, mode = 'doctrinal') {
  const intention = detecterIntention(sujet);
  const planObj = raisonnerSujet(sujet, intention, { mode });
  const reponseTexte = await generateAiResponse(sujet, { mode, intention });

  return {
    sujet,
    mode,
    reponse: reponseTexte,
    developpement: '',
    conclusion: '',
    narration: reponseTexte,
    plan: planObj.plan,
    modules: planObj.modules,
    processus: planObj.processus,
    connecteurs: planObj.connecteurs
  };
}

module.exports = {
  raisonnerSujet,
  raisonner,
  analyserSujet,
  generateAiResponse
};
