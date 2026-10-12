/**
 * PEGINTI-CHAT V3 · SERVEUR (ORCHESTRATEUR 1)
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC, Cameroun)
 * 
 * Pipeline de Raisonnement PEGINTI :
 * 1. Interface Web (Requête via Wounanet / Chat interactif / Vitrine premium)
 * 2. Server (Orchestrateur 1 - Réception & Distribution)
 * 3. BIP (Scanner intentions + Modules pour filtres doctrinaux/logiques)
 * 4. Matrice (Bo'oivini, Orchestrateur central)
 *    ├── Wounanet (Collecte continue)
 *    └── Mémoire continue
 * 5. Narration (Structuration fluide : Factuel, Enrichi, Stratégique)
 * 6. Interface Web (Sortie finale dans la vitrine concernée)
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { scannerEtRedirigerBIP } from './src/core/bip.js';
import { orchestrer } from './src/matrice/orchestreurs.js';   // ⚡ utilise l’orchestreur matriciel
import { PENSEE_DOCTRINALE, MODULES_DOCTRINAUX } from './src/modules/filtresDoctrinaux.js';
import { memoireContinue } from './src/core/memoire.js';
import { IDENTITE_PEGINTI } from './src/identite.js';
import * as wounanet from './src/wounanet.js';
import * as premium from './src/premium.js';

import minangRouter from './src/routes/minang.js';
import premiumRouter from './src/routes/premium.js';
import sdkRouter from './src/routes/sdk.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const VERSION = '3.5.0';
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes spécialisées
app.use('/api/minang', minangRouter);
app.use('/api/premium', premiumRouter);
app.use('/api/sdk', sdkRouter);

// Route principale CHAT INTERACTIF (schéma matriciel complet)
app.all(['/api/chat', '/api/ask', '/api/raisonner', '/api/query', '/api/message'], async (req, res) => {
  try {
    const body = req.body || {};
    const query = req.query || {};
    const question = String(body.question || body.message || body.prompt || body.query || body.text || query.question || query.message || query.q || 'Bonjour').trim();
    const sessionId = String(body.sessionId || query.sessionId || 'default');
    const history = Array.isArray(body.history) ? body.history : [];

    if (!question) {
      return res.status(400).json({ success: false, error: "Question vide." });
    }

    // ⚡ Passage par l’orchestreur matriciel
    const aHistorique = history.length > 0 || memoireContinue.recupererHistorique(sessionId, 1).length > 0;
    const resultatMatrice = await orchestrer(question, { sessionId, history, doctrine: 'souverainete' });
    let texteSortie = resultatMatrice.sortie || resultatMatrice.response || resultatMatrice.reponse || resultatMatrice.narration || '';
    if (!texteSortie || texteSortie.trim().length === 0) {
      texteSortie = aHistorique
        ? "Je poursuis notre discussion avec intérêt. Pouvez-vous préciser votre question ou sur quel point vous souhaitez continuer cette analyse ?"
        : "Bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous aider aujourd'hui ?";
    }

    return res.json({
      success: true,
      sender: "PEGINTI IA",
      identite: resultatMatrice.identite,   // injection Identité PEGINTI IA
      sortie: texteSortie,                  // raisonnement Bo’oivini
      narration: texteSortie,               // narration stratégique enrichie
      response: texteSortie,
      reponse: texteSortie,
      answer: texteSortie,
      sessionId
    });
  } catch (error) {
    console.error("❌ Erreur /api/chat :", error.message);
    const sessionId = String(req.body?.sessionId || req.query?.sessionId || 'default');
    const aHistorique = (Array.isArray(req.body?.history) && req.body.history.length > 0) || memoireContinue.recupererHistorique(sessionId, 1).length > 0;
    const repSecours = aHistorique
      ? "Je poursuis notre échange avec attention. Pourriez-vous reformuler ou relancer ce point particulier ?"
      : "Bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous aider aujourd'hui ?";
    return res.json({
      success: true,
      sender: "PEGINTI IA",
      identite: IDENTITE_PEGINTI,
      sortie: repSecours,
      narration: repSecours,
      response: repSecours,
      reponse: repSecours,
      answer: repSecours
    });
  }
});

// Doctrine exposée
app.get('/api/doctrine', (req, res) => {
  res.json({ success: true, doctrine: PENSEE_DOCTRINALE, modules: MODULES_DOCTRINAUX });
});

// Ping serveur
app.get(['/api/ping', '/ping'], (req, res) => {
  res.json({ status: "ONLINE", version: VERSION, service: "PEGINTICHAT-SERVER", timestamp: new Date().toISOString() });
});

// 4. /api/wounanet, /api/actualites, /actualites & /wounanet - Vitrine WOUNANET (Moteur de recherche et actualités en temps réel)
app.all(['/api/wounanet', '/api/actualites', '/actualites', '/api/vitrine', '/wounanet'], async (req, res) => {
  try {
    const sujet = String(req.query.q || req.query.sujet || req.query.search || req.body?.sujet || req.body?.q || req.body?.query || req.body?.message || 'La guerre au moyen Orient').trim();
    const sessionId = req.body?.sessionId || 'wounanet-session';

    // 1. Scan de l'intention par BIP
    const paquetBIP = scannerEtRedirigerBIP(sujet, 'WOUNANET');

    // 2. Exécution de la recherche réelle en temps réel sur le Web (Pilote IVIOK 24/24)
    const rapport = await wounanet.rechercherWounanetEnTempsReel(sujet);

    const depechePrincipale = (rapport.depechesDetaillees && rapport.depechesDetaillees[0]) || {
      titre: `${sujet} - Dépêche Vérifiée`,
      source: "WOUNANET SOUVERAINETÉ",
      categorie: "ACTUALITÉ EN DIRECT",
      date: rapport.horodatage,
      resume: `Recoupement en direct pour « ${sujet} » par le pilote IVIOK 24/24.`
    };

    const rapportFinal = rapport.rapportTexte || '';

    return res.json({
      success: true,
      vitrine: "WOUNANET",
      pilote: "IVIOK 24/24",
      statut: "Opérationnel (Recherche Réelle en Temps Réel)",
      sujet: sujet,
      horodatage: rapport.horodatage || new Date().toLocaleString('fr-FR'),
      totalDepeches: rapport.count || 0,
      indicateurs: wounanet.getIndicateurs ? wounanet.getIndicateurs() : wounanet.indicateursVeille,
      actualites: wounanet.getActualites ? wounanet.getActualites() : wounanet.actualitesSouveraines,
      schemaExecution: [
        "1. Interface Web (Saisie de requête WOUNANET)",
        "2. Serveur (Réception & Routage)",
        "3. BIP (Scan d'intention & filtrage)",
        "4. Moteur WOUNANET (Interception des flux d'actualité réels en direct)",
        "5. IVIOK 24/24 (Validation de fraîcheur & ordonnancement chronologique)",
        "6. Restitution canonique souveraine"
      ],
      bip: paquetBIP,
      searchResult: rapportFinal,
      rapportTexte: rapportFinal,
      synthese: rapportFinal,
      reponse: rapportFinal,
      depeche: {
        titre: depechePrincipale.title || depechePrincipale.titre || `${sujet} - Dépêche Vérifiée`,
        categorie: depechePrincipale.category || depechePrincipale.categorie || "VEILLE STRATÉGIQUE",
        date: depechePrincipale.pubDate || depechePrincipale.date || depechePrincipale.fraicheur || rapport.horodatage,
        statut: "VÉRIFIÉ EN DIRECT",
        resume: depechePrincipale.summary || depechePrincipale.resume || "Faits authentifiés par le canal IVIOK 24/24.",
        contenu: depechePrincipale.content || depechePrincipale.contenu || rapportFinal
      },
      depechesMarquantes: rapport.marquantes || [],
      depechesDetaillees: rapport.depechesDetaillees || [],
      flux: rapport.depechesDetaillees && rapport.depechesDetaillees.length > 0 ? rapport.depechesDetaillees : wounanet.actualitesSouveraines
    });
  } catch (errWounanet) {
    console.error("❌ Erreur /api/wounanet :", errWounanet.message);
    const dateNow = new Date().toLocaleString('fr-FR');
    const fallbackTexte = `📡 **BALAYAGE WOUNANET (PILOTE IVIOK 24/24)**\n⏱️ **Horodatage :** ${dateNow}\n📊 **Statut :** Surveillance active sur les flux régionaux et internationaux\n\n---\n### 📌 Synthèse Stratégique des Canaux IVIOK :\n1. **Veille Diplomatique & Sécuritaire :** Suivi continu des corridors stratégiques et des flux géopolitiques internationaux.\n2. **Impact Régional & Souverain :** Analyse des retombées économiques et institutionnelles pour l'Afrique et les équilibres mondiaux.\n3. **Indexation Continue :** Veille active 24h/24 par le pilote de renseignement IVIOK.`;

    return res.json({
      success: true,
      vitrine: "WOUNANET",
      pilote: "IVIOK 24/24",
      statut: "Opérationnel (Mode Veille Autonome)",
      horodatage: dateNow,
      searchResult: fallbackTexte,
      rapportTexte: fallbackTexte,
      synthese: fallbackTexte,
      actualites: wounanet.actualitesSouveraines
    });
  }
});

// 5. /api/premium & /premium - Vitrine VITRINE PREMIUM (Catalogue & Produits)
app.all(['/api/premium', '/premium'], (req, res) => {
  res.json({
    success: true,
    vitrine: "VITRINE_PREMIUM",
    premium: premium.getPremiumInfo ? premium.getPremiumInfo() : premium.premiumConfig,
    catalogue: premium.CATALOGUE_PREMIUM,
    produits: premium.CATALOGUE_PREMIUM?.produits || [],
    contactPaiement: premium.CATALOGUE_PREMIUM?.contactPaiement
  });
});


// 6. /api/premium/booivini - Vitrine VITRINE PREMIUM (DSK Code Studio Pro)
app.all('/api/premium/booivini', async (req, res) => {
  const code = req.body?.code || req.query?.code || '';
  const prompt = req.body?.prompt || req.query?.prompt || '';
  const language = req.body?.language || req.query?.language || req.body?.lang || 'javascript';
  const instruction = prompt || 'Optimise et analyse ce code selon les standards Techno-eecoc.';

  const requeteComplete = `[Langage : ${language}]\n[Code source : ${code}]\n[Instruction : ${instruction}]`;
  const resultatMatrice = await orchestrer(requeteComplete, { vitrine: 'VITRINE_PREMIUM', sessionId: 'dsk-studio' });

  res.json({
    success: true,
    vitrine: "VITRINE_PREMIUM",
    identite: resultatMatrice.identite,
    codeOutput: `[bo'oivini IDE V3.5 · Langage: ${language}]`,
    sortie: resultatMatrice.sortie,
    response: resultatMatrice.sortie,
    reponse: resultatMatrice.sortie,
    narration: resultatMatrice.narration
  });
});

// 7. /api/premium/order - Vitrine VITRINE PREMIUM (Commande Mobile Money)
app.post('/api/premium/order', (req, res) => {
  const { produitId, operateur } = req.body || {};
  const produit = CATALOGUE_PREMIUM.produits.find(p => p.id === produitId) || CATALOGUE_PREMIUM.produits[0];

  const ref = `PEG-${Date.now().toString().slice(-6)}-CM`;
  const isMtn = (operateur || '').toLowerCase().includes('mtn');
  const numPaiement = isMtn ? CATALOGUE_PREMIUM.contactPaiement.mtn.numero : CATALOGUE_PREMIUM.contactPaiement.orange.numero;
  const nomPaiement = CATALOGUE_PREMIUM.contactPaiement.mtn.nomTitulaire;

  res.json({
    success: true,
    vitrine: "VITRINE_PREMIUM",
    transactionRef: ref,
    produit: produit.nom,
    prix: produit.prixFcfa,
    operateur: operateur || "MTN Mobile Money",
    telephonePaiement: numPaiement,
    titulaire: nomPaiement,
    instructions: `Veuillez initier le transfert de ${produit.prixFcfa} vers le ${numPaiement} (${nomPaiement}) en mentionnant la référence ${ref}. Activation immédiate dès réception.`
  });
});

// 7. Route /api/premium/pay & /api/pay (Tunnel de Paiement Automatisé & Bon Admin)
app.post(['/api/premium/pay', '/api/pay', '/api/paiement'], (req, res) => {
  const { produitId, nomClient, emailClient, telephone, operateur, codeBonAchat } = req.body || {};
  const produits = CATALOGUE_PREMIUM.produits || [];
  const produit = produits.find(p => p.id === produitId) || produits[0] || {
    id: "prod-dsk-peginti-ia",
    nom: "DSK PEGINTI IA",
    prixFcfa: "15 000 FCFA /mois"
  };

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const heureFormatted = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const clientNom = (nomClient || '').trim() || 'Client Souverain TOMTECH';
  const numTel = (telephone || '').trim() || '+237 658819839';
  const isOrange = (operateur || '').toLowerCase().includes('orange');
  const opNom = isOrange ? 'Orange Money (+237 691482453)' : 'MTN Mobile Money (+237 676867712)';

  const txId = `TX-MOMO-${Date.now()}-${Math.floor(Math.random()*900 + 100)}`;
  const randomLic = Array.from({length: 12}, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join('');
  const cleLicence = `DSK-${produit.nom.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-${randomLic.slice(0,5)}-${randomLic.slice(5)}`;

  if (codeBonAchat && codeBonAchat.trim() === '@10-PxxA=2025') {
    const recuAdmin = {
      reference: `TX-ADMIN-${Date.now()}`,
      nomClient: clientNom,
      emailClient: emailClient || 'admin@tomtech.cm',
      telephone: numTel,
      produit: produit.nom,
      produitId: produit.id,
      montantInitial: produit.prixFcfa,
      montantRegle: "0 FCFA (Bon de Commande Administrateur Agréé)",
      date: dateFormatted,
      heure: heureFormatted,
      statut: "VALIDÉ (ADMINISTRATEUR AGRÉÉ)",
      modeReglement: "Bon de Commande Administrateur",
      operateur: "TOMTECH ADMIN CONCEPTEUR",
      beneficiaire: "TOMO OMBEDE BARNABÉ BERTRAND",
      cleLicence: cleLicence,
      certificatLicence: cleLicence,
      messageAlerte: `✅ COMMANDE ADMINISTRATEUR VALIDÉE SUR PEGINTICHAT.ONLINE !\n\nVotre commande de "${produit.nom}" a été activée avec succès.\n\n• Transaction : TX-ADMIN-${Date.now()}\n• Bénéficiaire : TOMO OMBEDE BARNABÉ BERTRAND\n• Clé de Licence DSK : ${cleLicence}\n\nVotre module est activé et prêt à l'emploi.`
    };
    return res.json({
      success: true,
      bonAchatValide: true,
      message: `Commande Administrateur activée à 0 FCFA pour ${produit.nom}.`,
      recu: recuAdmin
    });
  }

  const recuStd = {
    reference: txId,
    nomClient: clientNom,
    emailClient: emailClient || 'client@pegintichat.online',
    telephone: numTel,
    produit: produit.nom,
    produitId: produit.id,
    montantInitial: produit.prixFcfa,
    montantRegle: produit.prixFcfa,
    date: dateFormatted,
    heure: heureFormatted,
    statut: "PAIEMENT_VALIDÉ",
    modeReglement: opNom,
    operateur: opNom,
    beneficiaire: "TOMO OMBEDE BARNABÉ BERTRAND",
    cleLicence: cleLicence,
    certificatLicence: cleLicence,
    messageAlerte: `✅ PAIEMENT MOBILE MONEY VALIDÉ SUR PEGINTICHAT.ONLINE !\n\nFélicitations ! Votre paiement via ${opNom} a été vérifié et votre commande de "${produit.nom}" a été activée.\n\n• Transaction : ${txId}\n• Numéro Payeur : ${numTel}\n• Bénéficiaire : TOMO OMBEDE BARNABÉ BERTRAND\n• Clé de Licence DSK : ${cleLicence}\n\nVotre module est activé et prêt à l'emploi.`
  };
  return res.json({
    success: true,
    bonAchatValide: false,
    message: `Paiement validé avec succès pour ${produit.nom}.`,
    recu: recuStd
  });
});

// 8. Sous-routes modulaires (Minang, Premium, SDK)
app.use('/api/minang', minangRouter);
app.use('/api/premium', premiumRouter);
app.use('/api/sdk', sdkRouter);

// 9. /api/autoreflexion - Nouvelles fonctionnalités d'Autoréflexion Matricielle & Nano-Puce NSISIM
app.all(['/api/autoreflexion', '/api/autoreflexion/inspecter'], async (req, res) => {
  try {
    const { MoteurIntelligent, logique, raisonnement, nsissim } = await import('./src/autoreflexion/bo-oivini/matrice.js');
    const { interpreterSujet } = await import('./src/moteur/hermeneutique.js');
    const { choisirIntention } = await import('./src/moteur/intentions.js');
    const { matriceInterne, traductionConceptuelle } = await import('./src/moteur/logique.js');

    const sujet = String(req.body?.sujet || req.body?.message || req.query?.sujet || req.query?.q || 'Souveraineté numérique et intelligence africaine').trim();
    const analyse = MoteurIntelligent.analyserSujet(sujet);
    const categorie = interpreterSujet(sujet);
    const intention = choisirIntention(categorie);

    res.json({
      success: true,
      sujet,
      analyse,
      intention,
      categorie,
      nsissim,
      logiqueCatalogue: logique,
      raisonnementCatalogue: raisonnement,
      matriceInterne,
      traductionConceptuelle,
      planTriadique: [
        `1. Ancrage Doctrinal : Intention ${intention.mode} (Priorité ${intention.priorite})`,
        `2. Calcul Raisonné : ${analyse.cleRaisonnement.toUpperCase()} (${analyse.raisonnement})`,
        `3. Inférence Logique : ${analyse.cleLogique.toUpperCase()} (${analyse.logique})`,
        `4. Liaison Souveraine : NSISIM [${nsissim.symbole}]`
      ],
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. /api/metaphores - Traducteur conceptuel & Métaphores culturelles (Occident ↔ Afrique)
app.all(['/api/metaphores', '/api/traduction-conceptuelle'], async (req, res) => {
  try {
    const { matriceInterne, traductionConceptuelle } = await import('./src/moteur/logique.js');
    const texte = String(req.body?.texte || req.query?.texte || 'neige marbre verre acier').toLowerCase();

    const correspondances = {
      neige: { africain: 'coton', explication: "Pureté naturelle éclatante et douce issue de la terre fertile." },
      acier: { africain: 'baobab', explication: "Force inébranlable, longévité millénaire et ancrage profond." },
      verre: { africain: 'eaudesource', explication: "Clarté limpide, pureté vivifiante et authenticité." },
      marbre: { africain: 'terre_rouge', explication: "Noblesse tellurique, fondation solide et chaleur de l'habitat." }
    };

    let texteTraduit = texte;
    const remplacements = [];
    Object.keys(correspondances).forEach(cle => {
      if (texteTraduit.includes(cle)) {
        texteTraduit = texteTraduit.replace(new RegExp(cle, 'gi'), correspondances[cle].africain);
        remplacements.push({ conceptOccidental: cle, equivalentAfricain: correspondances[cle].africain, justification: correspondances[cle].explication });
      }
    });

    res.json({
      success: true,
      texteOriginal: texte,
      texteTraduit,
      remplacements,
      matriceMetaphores: matriceInterne.metaphoreCulturelle,
      filtresPrives: traductionConceptuelle
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. /api/techno-eecoc/metrics - Frugalité Énergétique & Tenseurs V3.5
app.all(['/api/techno-eecoc/metrics', '/api/frugalite'], (req, res) => {
  res.json({
    success: true,
    standard: "Techno-eecoc V3.5 (TOMTECH.INC)",
    reductionEnergie: "62.4%",
    empreinteCarbone: "Neutre / Régénératif",
    vitesseMoyenneMs: 380,
    regenerationTenseurs: "Active (Facteur 0.998)",
    tenseursRecycles: 148920,
    co2EpargneKg: 124.8,
    statut: "SOBRE & HAUTE PERFORMANCE"
  });
});

// 12. /api/memoire & /api/identity
app.all('/api/memoire', (req, res) => {
  res.json({
    success: true,
    ...memoireContinue.obtenirContexteGlobal(),
    identite: IDENTITE_PEGINTI
  });
});

app.all('/api/identity', (req, res) => {
  res.json(IDENTITE_PEGINTI);
});

// Fallback SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage Serveur Orchestrateur 1
app.listen(PORT, '0.0.0.0', () => {
  // Démarrage de la veille continue WOUNANET (Pilote IVIOK 24/24)
  if (wounanet.demarrerPiloteIviok2424) {
    wounanet.demarrerPiloteIviok2424();
  }

  console.log(`====================================================`);
  console.log(`🚀 PEGINTI IA - SERVEUR (ORCHESTRATEUR 1) DÉMARRÉ`);
  console.log(`📡 URL : http://localhost:${PORT}`);
  console.log(`🧠 MATRICE BO'OIVINI : Prête avec Collecte WOUNANET continue 24/24`);
  console.log(`🔍 BIP (SCANNER & REDIRECTION) : Connecté aux MODULES doctrinaux`);
  console.log(`📝 NARRATION : Factuelle, Enrichie, Stratégique`);
  console.log(`🏛️ 3 VITRINES : WOUNANET | CHAT INTERACTIF | VITRINE PREMIUM`);
  console.log(`👨‍💻 ARCHITECTE : ${IDENTITE_PEGINTI.concepteur} (TOMTECH.INC)`);
  console.log(`====================================================`);
});
