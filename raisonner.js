const analyser = require('./mrp/mrp.js');

function raisonner(sujet, culture) {
  const resultat = analyser(sujet, culture);
  console.log(resultat);
}

if (require.main === module) {
  const sujet = process.argv[2] || "homosexualite";
  const culture = process.argv[3] || "afrique";
  raisonner(sujet, culture);
}
