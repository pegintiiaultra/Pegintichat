const bip = require('./bip');
const strat = require('./strat');
const philo = require('./philo');
const mirap = require('./mirap');
const collab = require('./collab');

module.exports = {
  raisonner: (question) => {
    const route = collab.router(question);
    const cadres = [
      bip.reference(question),
      philo.tradition(question),
      mirap.conscience(question)
    ];
    const plan = strat.ultraRapide(question);

    return {
      question,
      destination: route.cible,
      module: route.module,
      type: route.type,
      cadres,
      plan,
      status: "Réponse dynamique générée par matrice PEGINTI"
    };
  }
};
