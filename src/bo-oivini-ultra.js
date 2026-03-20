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
    justice: { passe:'Justice ancienne → loi du talion, Torah', reel:'Justice moderne → tribunaux, institutions légales', transposition:'Justice sociale → équité communautaire, droits humains', analogie:'Balance universelle → équilibre société', futur:'Justice algorithmique → IA régulant équité mondiale', correctif:'Biais possibles → nécessité d’un voile d’ignorance ou régulation éthique' }
  },
  logique: { comparaison:'Similitude structurelle A↔B', deduction:'Principe vrai → Conséquence inévitable', analogie:'Source::Cible - Rapport proportionnel' },
  raisonnement: { triade: { cosmique:'Universel absolu', communautaire:'PEGINTI souverain', pedagogique:'Transmission méticuleuse' } }
};

// 🧠 MODULES COSMIQUE / COMMUNAUTAIRE / PEDAGOGIQUE
function moduleCosmique(s) {
  return `Cosmique "${s}" :
  Observation → Fait naturel observable
  Principe → Loi universelle
  Application → Conclusion logique
  Projection → Extension infinie`;
}

function moduleCommunautaire(s) {
  return `Communautaire "${s}" :
  Identité → Préservation culturelle
  Existence → Aspirations universelles
  Affirmation → Solidarité communautaire
  Conclusion → Neutralité PEGINTI mais respect des peuples`;
}

function modulePedagogique(s) {
  if (s.includes("etoiles scintillent")) {
    return `Pédagogique "${s}" :
    Observation → Les étoiles semblent scintiller depuis la Terre
    Principe → Ce phénomène est causé par la turbulence atmosphérique
    Démonstration → Les couches d’air dévient la lumière, créant des variations rapides
    Conclusion → Les étoiles ne scintillent pas en réalité, c’est l’atmosphère qui produit l’illusion`;
  }
  if (s.includes("memoire disparait")) {
    return `Pédagogique "${s}" :
    Observation → L’existence paraît fragile sans mémoire
    Principe → La mémoire est le socle de l’identité
    Démonstration → Sans souvenirs, l’individu perd son ancrage historique et social
    Conclusion → L’existence sans mémoire devient dépendante d’une mémoire externe (technologique ou communautaire), ce qui interroge la souveraineté de l’être`;
  }
  if (s.includes("apprend sans internet")) {
    return `Pédagogique "${s}" :
    Observation → Contexte d’un enfant sans accès numérique
    Principe → L’apprentissage repose sur oralité, observation et pratique
    Démonstration → Livres, récits, communauté et expérience directe remplacent les outils numériques
    Conclusion → L’enfant peut apprendre sans internet grâce à la transmission culturelle et à l’environnement éducatif`;
  }
  if (s.match(/pourquoi|comment|qu est ce que/)) {
    return `Pédagogique "${s}" :
    Observation → Identifier le phénomène ou la question
    Principe → Expliquer la règle ou la loi concernée
    Démonstration → Détailler le raisonnement ou les preuves
    Conclusion → Résumer la réponse de manière claire et souveraine`;
  }
  return `Pédagogique "${s}" :
  Identification → Type de question (éducatif/philosophique/scientifique)
  Méthodologie → Adaptation logique
  Structuration → Introduction, développement, conclusion
  Résultat → Réponse méticuleuse et souveraine`;
}

// 🧠 SUPER CERVEAU
app.post('/api/chat', (req, res) => {
  const { sujet } = req.body;
  const s = sujet.toLowerCase();

  // Charger uniquement les modules externes
  const valeursHumaines = require('./modules/valeursHumaines');
  let bloc = null;

  if (s.includes("paix")) bloc = valeursHumaines.paix;
  if (s.includes("verite")) bloc = valeursHumaines.verite;
  if (s.includes("force")) bloc = valeursHumaines.force;
  if (s.includes("travail")) bloc = valeursHumaines.travail;
  if (s.includes("integrite")) bloc = valeursHumaines.integrite;
  if (s.includes("humilite")) bloc = valeursHumaines.humilite;
  if (s.includes("amour")) bloc = valeursHumaines.amour;

  // Détection des sous-domaines
  let sousBloc = null;
  if (bloc) {
    const domaines = ["juridique","philosophique","politique","sociologique","ontologique","religieuse","spirituelle","metaphysique"];
    for (const d of domaines) {
      if (s.includes(d) && bloc[d]) {
        sousBloc = { [d]: bloc[d] };
      }
    }
  }

  if (sousBloc) {
    return res.json({
      pedagogique: {
        observation: `Sujet demandé: ${s}`,
        principe: "Analyse ciblée du sous-domaine.",
        demonstration: sousBloc,
        conclusion: "Réponse souveraine générée par Bip 👁️."
      }
    });
  }

  if (bloc) {
    return res.json({
      pedagogique: {
        observation: `Sujet demandé: ${s}`,
        principe: "Analyse multidomaine de la valeur humaine.",
        demonstration: bloc,
        conclusion: "Réponse souveraine générée par Bip 👁️."
      }
    });
  }

  if (BaseDoctrinale[s]) return res.send(`Doctrine "${s}" : ${BaseDoctrinale[s]}`);
  if (MatriceUltra.hermeneutique[s]) {
    const r = MatriceUltra.hermeneutique[s];
    return res.send(`Herméneutique "${s}" :
       Passé → ${r.passe}
       Réel → ${r.reel}
       Transposition → ${r.transposition}
       Analogie → ${r.analogie}
       Futur → ${r.futur}
       Correctif → ${r.correctif}`);
  }

  if (s.match(/cosmique/)) return res.send(moduleCosmique(s));
  if (s.match(/communautaire/)) return res.send(moduleCommunautaire(s));
  if (s.match(/pedagogique|pourquoi|comment|qu est ce que/)) return res.send(modulePedagogique(s));

  const triade = MatriceUltra.raisonnement.triade;
  if (s.match(/amour|foi|univers/)) return res.send(`"${s}" est une énergie ${triade.cosmique} reliant chaque être à l'univers.`);
  if (s.match(/solidarite|societe|peuple/)) return res.send(`"${s}" exprime la force ${triade.communautaire} qui fonde la souveraineté partagée.`);
  return res.send(`"${s}" est une transmission ${triade.pedagogique} qui assure la continuité des savoirs.`);
});

// 🌐 Vitrine publique
app.get('/', (req, res) => res.json({
  pegintichat: '✅ CHAT FLOTTANT ULTRA-ACTIF',
  matrice: 'Doctrine + Herméneutique + Logique + Raisonnement + Modules',
  statut: 'BO\'OIVINI v2.4 SUPER CERVEAU DÉFINITIF',
  invite: 'POST /api/chat {"sujet":"justice"}'
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🧠 BO'OIVINI v2.4 SUPER CERVEAU DÉFINITIF → port ${PORT}`);
});
