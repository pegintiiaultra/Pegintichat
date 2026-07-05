const express = require('express');
const router = express.Router();

// Exemple logique doctrinale simple
router.post('/', async (req, res) => {
  const sujet = req.body.sujet || '';
  if (!sujet) {
    return res.status(400).json({ error: "Sujet manquant" });
  }

  // Narration doctrinale basique
  const reponse = {
    status: "ok",
    sujet,
    intention: "doctrinal",
    reponse: {
      introduction: `Le sujet de "${sujet}" est fondamental pour la stabilité sociale.`,
      developpement: `La paix et la cohésion sociale reposent sur la justice, la solidarité et la reconnaissance mutuelle. Elles permettent aux communautés de dépasser les conflits et de construire un avenir commun.`,
      conclusion: `Ainsi, "${sujet}" demeure une exigence permanente pour toute société qui aspire à l'équilibre et au progrès.`
    },
    timestamp: new Date().toISOString()
  };

  res.json(reponse);
});

module.exports = router;
