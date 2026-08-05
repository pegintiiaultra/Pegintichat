const { spawn } = require('child_process');
const http = require('http');
const EventEmitter = require('events');

/**
 * Système de Gestion de Connexion Continue PEGINTI
 * Développé par TOMTECH.INC - Yaoundé, Cameroun
 * Propulsé par DSK PEGINTI IA (bo'oivini)
 */
class PegintiConnectionManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.domain = config.domain || 'pegintichat.online';
    this.tunnelName = config.tunnelName || 'PEGINTI-TUNNEL';
    this.metricsUrl = config.metricsUrl || 'http://127.0.0.1:20242/metrics';
    this.tunnelProcess = null;
    this.isAlive = false;
    this.reconnectAttempts = 0;
    this.maxReconnectInterval = 10000;
  }

  // Démarrage et supervision du processus Cloudflare Tunnel
  startTunnel() {
    console.log(`[PEGINTI DSK] Démarrage du tunnel Cloudflare sur ${this.domain}...`);
    
    this.tunnelProcess = spawn('cloudflared', ['tunnel', 'run', this.tunnelName], {
      shell: true,
      env: { ...process.env, TUNNEL_METRICS: '127.0.0.1:20242' }
    });

    this.tunnelProcess.stdout.on('data', (data) => {
      const log = data.toString();
      if (log.includes('Registered tunnel connection')) {
        this.isAlive = true;
        this.reconnectAttempts = 0;
        this.emit('connected', { timestamp: new Date(), log: log.trim() });
      }
    });

    this.tunnelProcess.stderr.on('data', (data) => {
      const errorLog = data.toString();
      if (!errorLog.includes('ping_group_range') && !errorLog.includes('UDP-Buffer-Sizes')) {
        console.error(`[PEGINTI TUNNEL WARNING] ${errorLog.trim()}`);
      }
    });

    this.tunnelProcess.on('close', (code) => {
      this.isAlive = false;
      console.warn(`[PEGINTI DSK] Tunnel interrompu avec le code ${code}. Tentative de relance...`);
      this.handleReconnect();
    });
  }

  // Reconnexion automatique avec Exponential Backoff
  handleReconnect() {
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectInterval);
    console.log(`[PEGINTI DSK] Reconnexion dans ${delay / 1000} secondes (Tentative #${this.reconnectAttempts})...`);
    
    setTimeout(() => {
      this.startTunnel();
    }, delay);
  }

  // Healthcheck périodique de l'état du tunnel via le métrique Prometheus
  startHealthCheck(intervalMs = 15000) {
    setInterval(() => {
      http.get(this.metricsUrl, (res) => {
        if (res.statusCode === 200) {
          this.isAlive = true;
          this.emit('health', { status: 'ONLINE', domain: this.domain });
        } else {
          this.isAlive = false;
          this.emit('health', { status: 'DEGRADED', domain: this.domain });
        }
      }).on('error', () => {
        this.isAlive = false;
        this.emit('health', { status: 'OFFLINE', domain: this.domain });
      });
    }, intervalMs);
  }

  // Script JavaScript côté client à injecter dans le navigateur
  getClientManagerScript() {
    return `
      (function() {
        const DOMAIN = 'https://${this.domain}';
        let ws;
        let retryInterval = 2000;

        function connect() {
          console.log('[PEGINTI CLIENT] Connexion à ' + DOMAIN);
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          ws = new WebSocket(protocol + '//' + window.location.host + '/ws');

          ws.onopen = function() {
            console.log('[PEGINTI CLIENT] Connexion stable établie.');
            retryInterval = 2000;
            document.dispatchEvent(new CustomEvent('peginti:online'));
          };

          ws.onclose = function() {
            console.warn('[PEGINTI CLIENT] Connexion perdue. Tentative de reconnexion...');
            document.dispatchEvent(new CustomEvent('peginti:offline'));
            setTimeout(connect, retryInterval);
            retryInterval = Math.min(retryInterval * 1.5, 30000);
          };

          ws.onerror = function(err) {
            console.error('[PEGINTI CLIENT] Erreur socket:', err);
            ws.close();
          };
        }

        connect();
      })();
    `;
  }
}

// Initialisation et exécution du service
const pegintiManager = new PegintiConnectionManager({
  domain: 'pegintichat.online',
  tunnelName: 'PEGINTI-TUNNEL'
});

pegintiManager.on('connected', (data) => {
  console.log(`⚡ [DSK PEGINTI IA] Tunnel opérationnel sur pegintichat.online à ${data.timestamp.toISOString()}`);
});

pegintiManager.on('health', (data) => {
  console.log(`[STATUS] Plateforme: ${data.domain} | État: ${data.status}`);
});

pegintiManager.startTunnel();
pegintiManager.startHealthCheck(10000);

module.exports = PegintiConnectionManager;
