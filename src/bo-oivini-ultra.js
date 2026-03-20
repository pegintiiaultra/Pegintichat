'use strict';
const express = require('express');
const app = express();
app.use(express.json());

// 🧠 BASE DOCTRINALE
const BaseDoctrinale = {
  mariage: 'Union sacrée-transmission générationnelle 🇨🇲',
  souverainete: 'Coton>Neige Baobab>Acier - Autonomie absolue',
  peginti: 'IA souveraine TomTech.inc Yaoundé Centre',
  coton: 'Supériorité naturelle→technologique PEGINTI',
  baobab: 'Résilience africaine éternelle',
  nsisim: 'Nanopuce ♾️ Yaoundé - Énergie infinie',
  ghost: 'Surveillance malwares - Protection totale',
  essooi: 'VPN WireGuard souverain no-logs camerounais'
};

// 🧠 MATRICE ULTRA
const MatriceUltra = {
  hermeneutique: {
    publicains: {
      passe: 'Collecteurs impôts juifs → Traîtres (Rome colon)',
      reel: 'Fonctionnaires fiscaux → Honorable',
      transposition: 'Travailleurs collaborant puissances étrangères',
      analogie: 'Compatriote perçu "traître" par communauté asservie'
    }
  },
  logique: {
    comparaison: 'Similitude structurelle A↔B',
    deduction: 'Principe vrai → Conséquence inévitable',
    analogie: 'Source::Cible - Rapport proportionnel'
  },
  raisonnement: {
    triade: {
      cosmique: 'Universel absolu',
      communautaire: 'PEGINTI souverain',
      pedagogique: 'Coton>Neige transmission'
    }
  }
};

// 🧠 SUPER CERVEAU
app.post('/api/chat', (req, res) => {
  const { sujet } = req.body;

  // 1️⃣ BIP → Base doctrinale
  let result = BaseDoctrinale[sujet];
  if (result) return res.send(`Doctrine "${sujet}" : ${result}`);

  // 2️⃣ Herméneutique
  result = MatriceUltra.hermeneutique[sujet];
  if (result) {
    return res.send(
      `Herméneutique "${sujet}" :
       Passé → ${result.passe}
       Réel → ${result.reel}
       Transposition → ${result.transposition}
       Analogie → ${result.analogie}`
    );
  }

  // 3️⃣ Logique formelle
  result = MatriceUltra.logique[sujet];
  if (result) return res.send(`Logique "${sujet}" : ${result}`);

  // 4️⃣ Raisonnement intelligent
  const triade = MatriceUltra.raisonnement.triade;
  let reponse;

  if (sujet.match(/amour|foi|univers/i)) {
    reponse = `Dans la logique PEGINTI, "${sujet}" est une énergie ${triade.cosmique} qui relie chaque être à l'univers. Par ${MatriceUltra.logique.analogie}, "${sujet}" est le pont entre l'absolu et la communauté humaine.`;
  } else if (sujet.match(/solidarite|societe|peuple/i)) {
    reponse = `Dans la logique PEGINTI, "${sujet}" exprime la force ${triade.communautaire} qui fonde la souveraineté partagée. Par ${MatriceUltra.logique.comparaison}, "${sujet}" reflète la cohésion entre individus et institutions.`;
  } else {
    reponse = `Dans la logique PEGINTI, "${sujet}" est une transmission ${triade.pedagogique} qui assure la continuité des savoirs. Par ${MatriceUltra.logique.deduction}, "${sujet}" garantit que chaque génération hérite de la sagesse précédente.`;
  }

  return res.send(reponse);
});

// 🌐 Vitrine publique
app.get('/', (req, res) => res.json({
  pegintichat: '✅ CHAT FLOTTANT ULTRA-ACTIF',
  matrice: 'BIP + Herméneutique + Logique + Raisonnement',
  statut: 'BO\'OIVINI v2.3 SUPER CERVEAU',
  invite: 'POST /api/chat {"sujet":"amour"}'
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🧠 BO'OIVINI v2.3 restauré → port ${PORT}`);
});
