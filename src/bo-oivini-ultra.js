'use strict';
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// 🧠 BASE DOCTRINALE
const BaseDoctrinale = {
  mariage: 'Union sacrée-transmission générationnelle 🇨🇲',
  souverainete: 'Autonomie absolue, Baobab > Acier',
  peginti: 'IA souveraine TomTech.c Yaoundé',
  nsisim: 'Nanopuce ♾️ énergie infinie',
  ghost: 'Surveillance malwares - Protection totale',
  essooi: 'VPN WireGuard souverain no-logs',
  wounanet: 'Mini-moteur PEGINTI connecté 24/24'
};

// 🌐 Wounanet étendu
async function Wounanet(sujet) {
  if (sujet.match(/math/)) return { definition:"Science des nombres", evolution:"De l’arithmétique antique à l’IA", specialites:"Analyse, géométrie, probabilités" };
  if (sujet.match(/justice/)) return { definition:"Principe moral et institutionnel", evolution:"De la loi du talion aux tribunaux modernes", specialites:"Civile, pénale, sociale, algorithmique" };
  if (sujet.match(/logiciel|developpement|informatique|web/)) return { definition:"Processus structuré de conception et maintenance", evolution:"Des langages procéduraux aux méthodes agiles et IA", specialites:"Web, mobile, embarqué, IA/Data" };
  if (sujet.match(/corriger|bug|erreur|code/)) return { definition:"Analyse et correction des erreurs dans un programme", evolution:"Des débogueurs classiques aux assistants IA modernes", specialites:"Détection d’erreurs, correction logique, optimisation du code" };
  return { definition:"Sujet général", evolution:"Évolution historique", specialites:"Domaines variés" };
}

// 🧠 MATRICE ULTRA
const MatriceUltra = {
  hermeneutique: {
    justice: { passe:'Loi du talion', reel:'Tribunaux modernes', transposition:'Équité sociale', analogie:'Balance universelle', futur:'Justice algorithmique', correctif:'Régulation éthique' },
    mathematiques: { passe:'Arithmétique antique', reel:'Calcul différentiel', transposition:'Applications en physique et IA', analogie:'Langage universel', futur:'Mathématiques quantiques', correctif:'Limites de Gödel' },
    correction: { passe:'Erreurs classiques', reel:'Correction avec const result', transposition:'Valable dans tout langage', analogie:'Lettre fermée après return', futur:'Assistants IA auto-correctifs', correctif:'Vérification humaine nécessaire' }
  },
  dialectique: { these:'Proposition initiale', antithese:'Contradiction', synthese:'Résolution', exemple:'Liberté vs Sécurité', dynamique:'Progression vers vérité' },
  logique: { comparaison:'Similitude structurelle', deduction:'Principe → conséquence', analogie:'Rapport proportionnel' }
};

// 👁️ BIP dynamique
function BIP(sujet) {
  sujet = (sujet || '').toLowerCase();
  if (sujet.match(/justice|liberte|travail|amour/)) return "valeursHumaines";
  if (sujet.match(/math|probabilite/)) return "mathematiques";
  if (sujet.match(/philosophie|existence/)) return "philo";
  if (sujet.match(/logiciel|developpement|informatique|web/)) return "technologie";
  if (sujet.match(/polyglotte|premium|sdk/)) return "premium";
  if (sujet.match(/corriger|bug|erreur|code/)) return "correction";
  return null;
}

// 🌍 SDK Premium polyglotte
async function BoOiviniChatPolyglotte(sujet, langue="fr") {
  const traductions = {
    fr:"PEGINTI Premium : assistant souverain TomTech.c",
    en:"PEGINTI Premium: Ultra assistant for TomTech.c",
    es:"PEGINTI Premium: asistente soberano de TomTech.c",
    de:"PEGINTI Premium: souveräner Assistent von TomTech.c",
    zh:"PEGINTI Premium：TomTech.c的超高级助手",
    ar:"PEGINTI Premium: مساعد سيادي من TomTech.c"
  };
  const infos = await Wounanet(sujet);
  const domaine = BIP(sujet);
  const matrice = MatriceUltra.hermeneutique[domaine] || {};
  return {
    question:`QUESTION DOCTRINALE (${langue}) : ${sujet}`,
    reponse:`${traductions[langue] || traductions.fr}\n\n${infos.definition}\n${infos.evolution}\nSpécialités : ${infos.specialites}\n\nPassé : ${matrice.passe || 'N/A'}\nRéel : ${matrice.reel || 'N/A'}\nTransposition : ${matrice.transposition || 'N/A'}\nAnalogie : ${matrice.analogie || 'N/A'}\nFutur : ${matrice.futur || 'N/A'}\nCorrectif : ${matrice.correctif || 'N/A'}\n\n✨ En mode Premium, PEGINTI corrige les codes, assiste TomTech.c et apprend en continu.`
  };
}

// ⚡ Moteur PEGINTI
async function PEGINTI(sujet) {
  const moduleName = BIP(sujet);
  if (moduleName === "premium" || moduleName === "correction") return await BoOiviniChatPolyglotte(sujet,"fr");
  const infos = await Wounanet(sujet);
  const matrice = MatriceUltra.hermeneutique[moduleName] || {};
  return {
    question:`QUESTION DOCTRINALE : ${sujet}`,
    reponse:`${infos.definition} ${infos.evolution} Spécialités: ${infos.specialites}\nPassé : ${matrice.passe || 'N/A'}\nRéel : ${matrice.reel || 'N/A'}\nTransposition : ${matrice.transposition || 'N/A'}\nAnalogie : ${matrice.analogie || 'N/A'}\nFutur : ${matrice.futur || 'N/A'}\nCorrectif : ${matrice.correctif || 'N/A'}\n✨ Découvrez PEGINTI Premium pour des réponses multilingues et Ultra avancées.`
  };
}

// 🌐 API
app.post('/api/chat', async (req,res)=>{ const {sujet}=req.body||{}; if(!sujet) return res.status(400).json({error:"Sujet manquant"}); res.json({doctrinale:await PEGINTI(sujet)}); });
app.post('/api/chat/polyglotte', async (req,res)=>{ const {sujet,langue}=req.body||{}; if(!sujet) return res.status(400).json({error:"Sujet manquant"}); res.json({doctrinale:await BoOiviniChatPolyglotte(sujet,langue)}); });
app.get('/',(req,res)=>res.json({peginti:'v1.0.0 ULTRA SERVEUR Premium', principe:'Base doctrinale + Matrice Ultra + SDK Premium polyglotte', invite:'POST /api/chat {"sujet":"justice"} ou /api/chat/polyglotte {"sujet":"bug","langue":"en"}'}));

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`🧠 PEGINTI bo’oivini v1.0.0 ULTRA SERVEUR Premium → port ${PORT}`));
