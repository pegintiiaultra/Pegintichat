const fs = require('fs');
const path = require('path');

function creerFichier(chemin, contenu) {
  const dossier = path.dirname(chemin);
  if (!fs.existsSync(dossier)) {
    fs.mkdirSync(dossier, { recursive: true });
  }
  fs.writeFileSync(chemin, contenu, 'utf8');
}

function genererMRP() {
  creerFichier(
    'mrp/mrp.json',
`{
  "cosmique": {
    "homosexualite": "Selon la Bible, cette pratique est contraire à l’ordre de création établi par Dieu.",
    "sorcellerie": "Selon la Bible, la sorcellerie est strictement interdite et considérée comme une transgression grave.",
    "idolatrie": "Selon la Bible, l'idolâtrie est une rupture directe avec le Créateur."
  },
  "communautaire": {
    "afrique": {
      "homosexualite": "Dans plusieurs communautés africaines, cette pratique est perçue comme moralement inacceptable.",
      "sorcellerie": "La sorcellerie est perçue comme une réalité mystique dangereuse.",
      "idolatrie": "Les pratiques traditionnelles peuvent être vues comme spirituellement sensibles."
    },
    "europe": {
      "homosexualite": "Dans plusieurs sociétés européennes, cette pratique est perçue comme une liberté individuelle.",
      "sorcellerie": "La sorcellerie est souvent perçue comme symbolique ou folklorique.",
      "idolatrie": "Les pratiques spirituelles sont souvent relativisées culturellement."
    }
  },
  "pedagogique": {
    "homosexualite": "Les cultures interprètent différemment la norme morale, mais la vérité cosmique reste indépendante des variations culturelles.",
    "sorcellerie": "Les perceptions culturelles varient, mais la doctrine biblique reste constante.",
    "idolatrie": "La différence entre tradition culturelle et vérité cosmique doit être expliquée avec clarté."
  }
}`
  );

  creerFichier(
    'mrp/mrp.js',
`const mrp = require('./mrp.json');

function analyserSujet(sujet, culture) {
  const cosmique = mrp.cosmique[sujet] || "Aucune donnée cosmique.";
  const communautaire = (mrp.communautaire[culture] || {})[sujet] || "Aucune donnée culturelle.";
  const pedagogique = mrp.pedagogique[sujet] || "Aucune donnée pédagogique.";

  return {
    cosmique,
    communautaire,
    pedagogique,
    conclusion: \`Conclusion doctrinale : \${cosmique}\`
  };
}

module.exports = analyserSujet;`
  );

  creerFichier(
    'raisonner.js',
`const analyser = require('./mrp/mrp.js');

function raisonner(sujet, culture) {
  const resultat = analyser(sujet, culture);
  console.log(resultat);
}

if (require.main === module) {
  const sujet = process.argv[2] || "homosexualite";
  const culture = process.argv[3] || "afrique";
  raisonner(sujet, culture);
}

module.exports = raisonner;`
  );

  console.log("MRP BO’OIVINI générée avec succès.");
}

if (require.main === module) {
  genererMRP();
}

module.exports = genererMRP;
