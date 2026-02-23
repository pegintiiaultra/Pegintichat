const mrp = require('./mrp.json');

function analyserSujet(sujet, culture) {
  const cosmique = mrp.cosmique[sujet] || "Aucune donnée cosmique.";
  const communautaire = (mrp.communautaire[culture] || {})[sujet] || "Aucune donnée culturelle.";
  const pedagogique = mrp.pedagogique[sujet] || "Aucune donnée pédagogique.";

  return {
    cosmique,
    communautaire,
    pedagogique,
    conclusion: `Conclusion doctrinale : ${cosmique}`
  };
}

module.exports = analyserSujet;
