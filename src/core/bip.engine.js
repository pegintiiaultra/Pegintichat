/**
 * Moteur BIP - Platforme PEGINTI IA
 * Développé sous l'architecture DSK PEGINTI IA
 * (c) TOMTECH.INC, Yaoundé, Cameroun
 */
import { fetchWounanetNews } from '../services/wounanet.js';

class DoctrinalModules {
  constructor() {
    this.registry = new Map([
      ['SECURITY',   { filters: ['SANITIZE', 'VERIFY_TOKEN', 'ENCRYPT'], priority: 'HIGH',    doctrine: 'GARDIEN MAAT' }],
      ['ANALYTICS',  { filters: ['NORMALIZE', 'VECTORIZE', 'WOUNANET_SCAN'], priority: 'MEDIUM', doctrine: 'SAGE GRIOT' }],
      ['COMMAND',    { filters: ['AUTHORIZE', 'AUDIT_LOG', 'EXECUTE'], priority: 'CRITICAL', doctrine: 'INGENIEUR DSK' }],
      ['SPIRITUEL',  { filters: ['BENEDICTION', 'SAGESSE'], priority: 'HIGH', doctrine: 'GARDIEN MAAT' }],
      ['DEFAULT',    { filters: ['DEFAULT_FILTER'], priority: 'LOW', doctrine: 'SAGE' }]
    ]);
  }

  scan(nature) {
    const key = nature.toUpperCase();
    return this.registry.get(key) || this.registry.get('DEFAULT');
  }
}

class Matrix {
  async process(payload, doctrinalElements) {
    let result = { ...payload };
    
    for (const filter of doctrinalElements.filters) {
      result = await this.applyFilter(result, filter, payload);
    }
    
    return {
      matrixId: `MTX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      processedData: result,
      appliedFilters: doctrinalElements.filters,
      doctrine: doctrinalElements.doctrine,
      status: 'PROCESSED'
    };
  }

  async applyFilter(data, filterName, originalPayload) {
    switch(filterName) {
      case 'WOUNANET_SCAN':
        const news = await fetchWounanetNews(originalPayload.query || '');
        data._wounanet = news;
        break;
      case 'SANITIZE':
        data.query = String(data.query || '').replace(/<script>/gi, '');
        break;
    }
    data._metadata = { ...(data._metadata || {}), [filterName]: true, timestamp: Date.now() };
    return data;
  }
}

export class BipEngine {
  constructor(matrix, doctrinalModules) {
    this.matrix = matrix;
    this.doctrinalModules = doctrinalModules;
    console.log('[BIP] Moteur d\'orchestration DSK initialisé. Les 2 piliers sont actifs.');
  }

  async orchestrate(incomingRequest) {
    // 1. Identification de la nature et de l'objet
    const { nature, object } = this.identifyRequest(incomingRequest);
    console.log(`[BIP -> SCAN] Nature: ${nature} | Objet: ${object.query || 'N/A'}`);

    // 2. Scan des modules doctrinaux
    const doctrinalElements = this.doctrinalModules.scan(nature);
    console.log(`[BIP -> DOCTRINE] Module activé: ${doctrinalElements.doctrine} | Priorité: ${doctrinalElements.priority}`);

    // 3. Envoi à la Matrice pour traitement filtré
    const matrixResponse = await this.matrix.process(object, doctrinalElements);
    console.log(`[BIP -> MATRICE] Traitement terminé. ID: ${matrixResponse.matrixId}`);

    return {
      nature,
      doctrine: doctrinalElements.doctrine,
      matrixResponse
    };
  }

  identifyRequest(req) {
    const nature = (req.nature || 'DEFAULT').toUpperCase();
    const object = { query: req.query || '', ...req };
    return { nature, object };
  }
}
