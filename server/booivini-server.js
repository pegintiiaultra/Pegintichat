'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

// Importation des modules internes de la matrice
const noyau = require("./bo-oivini/noyau/matrice-interne.js");
const logique = require("./bo-oivini/logique/filtres-prives.js");
const preferences = require("./bo-oivini/preferences/comportement-noyau.json");
const systemeRegles = require("./bo-oivini/systeme/regles-ultra.js");
const systemeTrad = require("./bo-oivini/systeme/traduction-conceptuelle.js");

// Module bip : localisation doctrinale
function bipLocaliser(sujet) {
  try {
    const modulePath = `./bo-oivini/doctrinal/${sujet}.js`;
    return require(modulePath);
  } catch (err) {
    return null; // si aucun module doctrinal n’existe
  }
}

// Route /chat
app.post("/chat", (req, res) => {
  const msg = req.body.msg || "";
  const sujet = msg.toLowerCase();

  // Étape bip : localisation du module doctrinal
  const doctrinal = bipLocaliser(sujet);

  // Analyse triadique
  const analyse = doctrinal ? {
    cosmique: doctrinal.cosmique,
    communautaire: doctrinal.communautaire,
    pedagogique: doctrinal.pedagogique,
    structure: "raisonnement_triadique"
  } : {
    cosmique: "Dimension cosmique issue du noyau",
    communautaire: "Dimension communautaire issue du noyau",
    pedagogique: "Dimension pédagogique issue du noyau",
    structure: "raisonnement_triadique"
  };

  // Logique générale
  const logiqueGenerale = {
    deduction: "Si chacun respecte les lois, alors la société reste stable.",
    induction: "En observant plusieurs cas, on conclut que la justice protège les faibles.",
    comparaison: "La justice est comme une balance.",
    analogie: "La justice est au corps social ce que le système immunitaire est au corps humain."
  };

  // Simulation NSISIM
  const simulation = {
    choix: {
      option: "Créatif",
      result: `ULTRA imagine: ${msg}`,
      score: Math.random()
    },
    energie: "intarissable",
    regeneration: "auto",
    cycle: Date.now()
  };

  // Réponse finale
  res.json({
    entree: msg,
    doctrinal: doctrinal ? doctrinal : "Aucun module doctrinal trouvé, matrice interne utilisée",
    analyse,
    logique: logiqueGenerale,
    simulation,
    sortie: simulation.choix.result
  });
});

// Lancement du serveur
app.listen(4000, () => {
  console.log("🧠 BO’OIVINI serveur en écoute sur port 4000");
  console.log("♾️ NSISIM activé — énergie intarissable et auto-renouvelable");
});
'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// Import SDK Bo'oivini
const { BoOiviniSDK } = require("./bo-oivini/modules/sdk.js");

// Import bip (localisation doctrinale)
function bipLocaliser(sujet) {
  try {
    const modulePath = `./bo-oivini/doctrinal/${sujet}.js`;
    return require(modulePath);
  } catch (err) {
    return null; // aucun module trouvé
  }
}

const app = express();
app.use(bodyParser.json());

// Route principale
app.post('/chat', (req, res) => {
  const msg = req.body.msg || "";

  // Audit doctrinal via SDK
  const audit = BoOiviniSDK.auditCode(msg);
  const doctrineValide = BoOiviniSDK.validateDoctrine(msg);

  // Bip localise le module doctrinal
  const doctrinal = bipLocaliser(msg.toLowerCase());

  // Réponse finale
  res.json({
    entree: msg,
    doctrinal: doctrinal || "Aucun module doctrinal trouvé, matrice interne utilisée",
    audit,
    doctrineValide,
    analyse: doctrinal ? doctrinal : {
      cosmique: "Dimension cosmique issue du noyau",
      communautaire: "Dimension communautaire issue du noyau",
      pedagogique: "Dimension pédagogique issue du noyau",
      structure: "raisonnement_triadique"
    },
    sortie: doctrineValide ? `ULTRA imagine: ${msg}` : "❌ Message rejeté doctrinalement"
  });
});

// Démarrage serveur
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Bo'oivini serveur en ligne sur le port ${PORT}`);
});
