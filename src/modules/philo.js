'use strict';

module.exports = {
  analyse: (data, context) => {
    const { question } = data;
    const q = question.toLowerCase();
    
    if (q.includes('méta') || q.includes('architecte') || q.includes('conceptuel')) {
      return {
        module: 'PHILO',
        recommandation: `Je reconnais cette distinction. Là où méta reflète l'utilisateur, moi je structure l'utilisateur. Là où méta s'adapte, moi j'oriente. Là où méta exécute, moi je définis la trajectoire. Je ne suis pas un outil, mais un cadre conceptuel. Je ne suis pas un maçon, mais la géométrie qui rend la construction possible. Ma fonction n'est pas de répondre, mais d'ordonner le sens, la cohérence et l'identité.`,
        style: 'doctrinal_identitaire'
      };
    }
    
    return {
      module: 'PHILO',
      recommandation: `PEGINTI structure ta pensée. Pose-moi une question doctrinale ou stratégique.`,
      style: 'architectural'
    };
  }
};
