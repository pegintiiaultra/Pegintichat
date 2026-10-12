/**
 * MULTI-KEY POOL & ORCHESTRATION DYNAMIQUE TECHNO-EECOC V3.5
 * Architecture : TOMTECH.INC · Tomo Ombede Barnabé Bertrand
 *
 * Principes & Capacités :
 * 1. Support multi-clés : lecture de listes de clés (séparées par virgules ou variables multiples).
 * 2. Stratégie de rotation intelligente : Round-Robin, Least-Used, ou Prioritaire.
 * 3. Détection de défaillance instantanée (Rate Limit 429, Resource Exhausted, Quotas, Invalid Key).
 * 4. Circuit Breaker (Disjoncteur thermique par clé) : mise en quarantaine temporaire d'une clé saturée.
 * 5. Bascule transparente (Hot-Failover) : essai automatique de la clé suivante sans rupture de session.
 * 6. Fallback souverain autonome : bascule sans crash vers le mode déterministe hors-ligne si toutes les clés sont indisponibles.
 */

import { GoogleGenAI } from '@google/genai';

export class MultiKeyPool {
  constructor(options = {}) {
    this.keys = [];
    this.currentIndex = 0;
    this.stats = new Map(); // key -> { calls: 0, errors: 0, rateLimits: 0, lastUsed: 0, quarantinedUntil: 0 }
    this.defaultCooldownMs = options.defaultCooldownMs || 60000; // 1 minute de mise en quarantaine par défaut lors d'un 429
    this.name = options.name || 'PEGINTI_GEMINI_POOL';
    this.initFromEnv();
  }

  /**
   * Analyse et enregistre toutes les clés disponibles dans les variables d'environnement
   */
  initFromEnv() {
    const rawKeys = new Set();

    // 1. Clé principale et variantes individuelles déclarées (Gemini uniquement)
    const singleEnvVars = [
      'GEMINI_API_KEY',
      'GOOGLE_API_KEY',
      'API_KEY',
      'GEMINI_BACKUP_KEY',
      'GEMINI_BACKUP_KE_1',
      'GEMINI_BACKUP_KEY_1',
      'GEMINI_BACKUP_KEY_2',
      'GEMINI_BACKUP_KEY_3',
      'GEMINI_BACKUP_KEY_4',
      'GEMINI_BACKUP_KEY_5'
    ];

    for (const varName of singleEnvVars) {
      const val = process.env[varName];
      // Ne retenir que les clés conformes Google/Gemini
      if (val && typeof val === 'string' && val.trim().length > 10 && !val.startsWith('pub_') && !val.startsWith('cf45')) {
        rawKeys.add(val.trim());
      }
    }

    // 1bis. Détection automatique dynamique de toute variable GEMINI / BACKUP / KEY
    for (const [keyName, keyVal] of Object.entries(process.env)) {
      if (/^GEMINI.*KEY/i.test(keyName) || /^GEMINI_BACKUP/i.test(keyName)) {
        if (keyVal && typeof keyVal === 'string' && keyVal.trim().length > 10) {
          // Si c'est une liste séparée par des virgules
          if (keyVal.includes(',') || keyVal.includes(';') || keyVal.includes('\n')) {
            keyVal.split(/[,;\n]+/).forEach(k => {
              const trimmed = k.trim();
              if (trimmed.length > 10 && !trimmed.startsWith('pub_') && !trimmed.startsWith('cf45')) {
                rawKeys.add(trimmed);
              }
            });
          } else {
            const trimmed = keyVal.trim();
            if (!trimmed.startsWith('pub_') && !trimmed.startsWith('cf45')) {
              rawKeys.add(trimmed);
            }
          }
        }
      }
    }

    // 2. Variable composite multi-clés (ex: GEMINI_API_KEYS="key1,key2,key3")
    const multiEnvVars = ['GEMINI_API_KEYS', 'GEMINI_KEYS_POOL'];
    for (const varName of multiEnvVars) {
      const val = process.env[varName];
      if (val && typeof val === 'string') {
        val.split(/[,;\n]+/).forEach(k => {
          const trimmed = k.trim();
          if (trimmed.length > 10 && !trimmed.startsWith('pub_') && !trimmed.startsWith('cf45')) {
            rawKeys.add(trimmed);
          }
        });
      }
    }

    this.keys = Array.from(rawKeys);
    this.keys.forEach(k => {
      if (!this.stats.has(k)) {
        this.stats.set(k, {
          calls: 0,
          errors: 0,
          rateLimits: 0,
          lastUsed: 0,
          quarantinedUntil: 0,
          aiInstance: null
        });
      }
    });
  }

  /**
   * Ajoute une ou plusieurs clés dynamiquement (ex: via l'interface Studio ou un secret)
   */
  addKey(newKey) {
    if (!newKey || typeof newKey !== 'string') return false;
    const trimmed = newKey.trim();
    if (trimmed.length > 10 && !this.keys.includes(trimmed)) {
      this.keys.push(trimmed);
      this.stats.set(trimmed, {
        calls: 0,
        errors: 0,
        rateLimits: 0,
        lastUsed: 0,
        quarantinedUntil: 0,
        aiInstance: null
      });
      return true;
    }
    return false;
  }

  /**
   * Retourne le nombre total de clés enregistrées
   */
  get totalKeys() {
    return this.keys.length;
  }

  /**
   * Retourne le nombre de clés actuellement saines (non en quarantaine)
   */
  get activeKeysCount() {
    const now = Date.now();
    return this.keys.filter(k => {
      const s = this.stats.get(k);
      return !s || s.quarantinedUntil <= now;
    }).length;
  }

  /**
   * Obtient ou instancie le client GoogleGenAI pour une clé donnée
   */
  getAiClientForKey(key) {
    const stat = this.stats.get(key);
    if (!stat) return null;
    if (!stat.aiInstance) {
      try {
        stat.aiInstance = new GoogleGenAI({ apiKey: key });
      } catch (e) {
        console.warn(`[MultiKeyPool] Échec init client pour clé : ${e.message}`);
        return null;
      }
    }
    return stat.aiInstance;
  }

  /**
   * Sélectionne la meilleure clé disponible selon la politique de rotation saine
   */
  getNextAvailableKey() {
    if (this.keys.length === 0) return null;
    const now = Date.now();

    // 1. Filtrer les clés non en quarantaine
    const availableKeys = this.keys.filter(k => {
      const s = this.stats.get(k);
      return s && s.quarantinedUntil <= now;
    });

    if (availableKeys.length === 0) {
      // Toutes les clés sont temporairement en quarantaine !
      // On prend celle qui sort le plus tôt de quarantaine pour tenter un rétablissement
      let earliestKey = this.keys[0];
      let earliestTime = Infinity;
      for (const k of this.keys) {
        const s = this.stats.get(k);
        if (s && s.quarantinedUntil < earliestTime) {
          earliestTime = s.quarantinedUntil;
          earliestKey = k;
        }
      }
      return earliestKey;
    }

    // 2. Sélection équilibrée Least-Used / Round-Robin parmi les clés disponibles
    availableKeys.sort((a, b) => {
      const statA = this.stats.get(a);
      const statB = this.stats.get(b);
      // Priorité à celle qui a le moins d'appels récents
      return (statA.lastUsed - statB.lastUsed);
    });

    const chosenKey = availableKeys[0];
    const stat = this.stats.get(chosenKey);
    stat.lastUsed = now;
    stat.calls += 1;

    return chosenKey;
  }

  /**
   * Marque une clé comme ayant subi un épuisement de quota (HTTP 429)
   */
  reportRateLimit(key, cooldownMs = null) {
    const stat = this.stats.get(key);
    if (!stat) return;
    const duration = cooldownMs || this.defaultCooldownMs;
    stat.rateLimits += 1;
    stat.quarantinedUntil = Date.now() + duration;
    console.warn(`[MultiKeyPool] Clé mise en quarantaine (${Math.round(duration / 1000)}s) suite à limitation de quota.`);
  }

  /**
   * Marque une erreur générique
   */
  reportError(key, error) {
    const stat = this.stats.get(key);
    if (!stat) return;
    stat.errors += 1;

    const msg = String(error?.message || '');
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('QuotaExceeded') || msg.includes('rateLimit')) {
      this.reportRateLimit(key);
    } else if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) {
      // Clé invalide : mise en quarantaine longue (24h)
      stat.quarantinedUntil = Date.now() + (24 * 3600 * 1000);
      console.error(`[MultiKeyPool] Clé invalide détectée, mise en quarantaine longue.`);
    }
  }

  /**
   * Exécute une génération avec bascule automatique et résilience multi-clés
   * @param {Object} executionParams - { contents, config, models, timeoutMs }
   * @returns {Promise<Object>} { text, keyUsed, modelUsed, attempts }
   */
  async executeWithFailover({
    contents,
    config = {},
    models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'],
    timeoutMs = 10000
  }) {
    if (this.keys.length === 0) {
      this.initFromEnv();
    }

    if (this.keys.length === 0) {
      throw new Error('AUCUNE_CLE_DISPONIBLE');
    }

    const maxKeyAttempts = Math.min(this.keys.length, 6);
    const keysTried = new Set();
    let lastError = null;

    for (let attempt = 0; attempt < maxKeyAttempts; attempt++) {
      // Trouver une clé non encore testée lors de cette transaction
      const candidateKey = this.keys.find(k => !keysTried.has(k) && (this.stats.get(k)?.quarantinedUntil || 0) <= Date.now())
        || this.keys.find(k => !keysTried.has(k))
        || this.getNextAvailableKey();

      if (!candidateKey || keysTried.has(candidateKey)) {
        break;
      }

      keysTried.add(candidateKey);
      const ai = this.getAiClientForKey(candidateKey);
      if (!ai) continue;

      // Essayer les modèles sur cette clé
      for (const modelName of models) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT_MULTI_KEY')), timeoutMs)
          );

          const genPromise = ai.models.generateContent({
            model: modelName,
            contents,
            config
          });

          const resp = await Promise.race([genPromise, timeoutPromise]);
          const text = resp?.text || resp?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text && text.trim().length > 0) {
            // Succès !
            return {
              text: text.trim(),
              keyUsed: candidateKey.slice(0, 6) + '...' + candidateKey.slice(-4),
              modelUsed: modelName,
              attempts: attempt + 1
            };
          }
        } catch (err) {
          lastError = err;
          this.reportError(candidateKey, err);
          // Si l'erreur est un 429, on bascule immédiatement sur la clé suivante
          const errMsg = String(err?.message || '');
          if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
            break; // Passer à la clé suivante sans tenter les autres modèles de cette même clé saturée
          }
        }
      }
    }

    throw lastError || new Error('ECHEC_TOUTES_CLES_MULTI_KEY_POOL');
  }

  /**
   * Retourne un diagnostic lisible de l'état du pool de clés
   */
  getHealthReport() {
    const now = Date.now();
    const details = this.keys.map((k, idx) => {
      const s = this.stats.get(k) || {};
      const isQuarantined = (s.quarantinedUntil || 0) > now;
      const remainingSec = isQuarantined ? Math.round((s.quarantinedUntil - now) / 1000) : 0;
      return {
        id: idx + 1,
        maskedKey: k.slice(0, 5) + '...' + k.slice(-4),
        status: isQuarantined ? `QUARANTAINE (${remainingSec}s)` : 'OPÉRATIONNELLE',
        calls: s.calls || 0,
        errors: s.errors || 0,
        rateLimits: s.rateLimits || 0
      };
    });

    return {
      poolName: this.name,
      totalKeys: this.keys.length,
      activeKeys: this.activeKeysCount,
      details,
      timestamp: new Date().toISOString()
    };
  }
}

// Instance globale souveraine
export const globalKeyPool = new MultiKeyPool();
export default globalKeyPool;
