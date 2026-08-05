'use strict';

const { GoogleGenAI } = require('@google/genai');
const intentions = require('../moteur/intentions');
const doctrineData = require('../data/doctrine.js');

async function raisonner(sujet, contexte = {}) {
  const intention = intentions.detecterIntention(sujet);
  const apiKey = process.env.GEMINI_API_KEY || process.env.PEGINTIBOTAPIKEY;

  // Actualités Wounanet
  let actualitesText = '';
  let articlesArray = [];
  if (contexte.actualites) {
    if (typeof contexte.actualites === 'string') {
      actualitesText = contexte.actualites;
    } else if (contexte.actualites.text) {
      actualitesText = contexte.actualites.text;
      if (Array.isArray(contexte.actualites.articles)) {
        articlesArray = contexte.actualites.articles;
      }
    } else if (Array.isArray(contexte.actualites.articles)) {
      articlesArray = contexte.actualites.articles;
      actualitesText = articlesArray.map(a => `• ${a.title} (${a.source || 'Presse'})`).join('\n');
    }
  }

  // Contexte doctrinal
  let doctrinalText = '';
  let specificRulesMatched = [];

  if (contexte.module) {
    if (typeof contexte.module === 'string') {
      doctrinalText += contexte.module + '\n';
    } else if (typeof contexte.module === 'object') {
      if (contexte.module.narration) {
        doctrinalText += (typeof contexte.module.narration === 'string'
          ? contexte.module.narration
          : JSON.stringify(contexte.module.narration)) + '\n';
      }
      if (Array.isArray(contexte.module.doctrineDb) && contexte.module.doctrineDb.length > 0) {
        for (const doc of contexte.module.doctrineDb) {
          const ruleText = doc.reply || doc.reponse || JSON.stringify(doc);
          doctrinalText += `\n[POSITION DOCTRINALE OFFICIELLE SUR "${doc.key}"]: ${ruleText}`;
          specificRulesMatched.push({ key: doc.key, reponse: ruleText });
        }
      }
    }
  }

  if (doctrineData?.regles?.traitement) {
    const s = String(sujet).toLowerCase();
    for (const [key, rule] of Object.entries(doctrineData.regles.traitement)) {
      if (s.includes(key)) {
        doctrinalText += `\n[POSITION DOCTRINALE OFFICIELLE SUR "${key.toUpperCase()}"]: ${rule.reponse}`;
        specificRulesMatched.push({ key, reponse: rule.reponse });
      }
    }
  }

  if (!doctrinalText) {
    doctrinalText = "Cadre général PEGINTI : Souveraineté numérique, autonomie intellectuelle, réflexion critique, paix, résilience humaniste et valorisation de la pensée africaine et universelle.";
  }

  // Génération avec Gemini si clé dispo
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
      const prompt = `...`; // prompt complet conservé

      const geminiRes = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      if (geminiRes?.text) {
        const parsed = JSON.parse(geminiRes.text.trim());
        if (parsed.reponse && parsed.developpement && parsed.conclusion) return parsed;
      }
    } catch (e) {
      console.warn("Moteur Gemini indisponible, fallback algorithmique:", e.message);
    }
  }

  // Fallback algorithmique
  const sLower = String(sujet).toLowerCase();
  const estCreateur = sLower.includes('conçu') || sLower.includes('créateur') || sLower.includes('createur')
    || sLower.includes('fabriqué') || sLower.includes('origine') || sLower.includes("qui t'a") || sLower.includes("qui t’a");
  const estCreationApp = sLower.includes('creer des applications') || sLower.includes('créer des applications')
    || sLower.includes('générer une app') || sLower.includes('creer une app')
    || sLower.includes('vitrine premium') || sLower.includes('délivrance')
    || intention.type === 'creation_app';

  if (estCreateur) {
    return { reponse: "Je suis PEGINTI IA...", developpement: "Origines souveraines...", conclusion: "Doctrine humaniste..." };
  }

  if (estCreationApp) {
    return { reponse: "Oui, PEGINTI IA peut créer des apps...", developpement: "Module Code Studio Pro...", conclusion: "Clé-en-main souverain." };
  }

  if (specificRulesMatched.length > 0) {
    const primaryRule = specificRulesMatched[0];
    return {
      reponse: `Conformément au cadre doctrinal PEGINTI concernant « ${primaryRule.key} » :`,
      developpement: primaryRule.reponse,
      conclusion: "PEGINTI IA maintient la fermeté de cette position doctrinale."
    };
  }

  return { reponse: `Analyse du sujet « ${sujet} »`, developpement: "Développement doctrinal universel...", conclusion: "Conclusion souveraine." };
}

async function analyserSujet(sujet, mode = 'doctrinal') {
  const res = await raisonner(sujet, { mode });
  return {
    sujet,
    mode,
    reponse: res.reponse || '',
    developpement: res.developpement || '',
    conclusion: res.conclusion || '',
    narration: [res.reponse, res.developpement, res.conclusion].filter(Boolean).join('\n\n')
  };
}

module.exports = { raisonner, analyserSujet };
