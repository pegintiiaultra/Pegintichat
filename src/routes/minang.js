/**
 * ROUTE MINANG - Dialogue et Échanges Souverains
 */
import express from 'express';
import { raisonner } from '../core/matrice.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, question } = req.body;
    const q = message || question || 'Bonjour';
    const resultat = await raisonner(q, { vitrine: 'MINANG' });
    res.json({
      success: true,
      service: 'MINANG',
      reponse: resultat.reponse,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
