/**
 * Module d'injection du thème PEGINTICHAT V3 - DSK PEGINTI IA
 * Développé par TOMTECH.INC (Tomo Ombede Barnabé Bertrand)
 */
(function injectPegintiStyles() {
  const cssStyles = `
  /* 🌌 Thème doctrinal PEGINTICHAT V3 (Optimisé DSK) */
  :root {
    --bg-dark: #090d16;
    --card-bg: rgba(15, 23, 42, 0.85);
    --green-accent: #00FF66;
    --yellow-accent: #FFD700;
    --pink-accent: #FF1493;
    --cyan-accent: #00F3FF;
    --border-color: rgba(255, 255, 255, 0.12);
    --glow-shadow: 0 0 15px rgba(0, 243, 255, 0.25);
  }

  body {
    margin: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: var(--bg-dark);
    color: #f8fafc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  /* 🔱 Barre supérieure */
  .topbar {
    background: rgba(10, 14, 23, 0.92);
    backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .brand-box {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid var(--yellow-accent);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .logo:hover {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.8);
  }

  .brand-title {
    margin: 0;
    font-size: 1.4rem;
    color: var(--yellow-accent);
    letter-spacing: 1px;
    font-weight: 800;
  }

  .brand-subtitle {
    font-size: 0.8rem;
    color: #94a3b8;
  }

  .status-badge {
    background: rgba(0, 255, 102, 0.12);
    color: var(--green-accent);
    border: 1px solid var(--green-accent);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    box-shadow: 0 0 10px rgba(0, 255, 102, 0.2);
  }

  /* 💬 Zone Principale */
  .app-main {
    width: 92%;
    max-width: 950px;
    margin: 25px auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .chat-display-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }

  .chat-text {
    height: 380px;
    max-height: 50vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-right: 8px;
  }

  /* Custom Scrollbar */
  .chat-text::-webkit-scrollbar {
    width: 6px;
  }
  .chat-text::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  .chat-text::-webkit-scrollbar-thumb {
    background: var(--cyan-accent);
    border-radius: 10px;
  }

  .user-message {
    align-self: flex-end;
    background: rgba(255, 215, 0, 0.15);
    border: 1px solid var(--yellow-accent);
    color: #fff;
    padding: 12px 16px;
    border-radius: 14px 14px 0 14px;
    max-width: 80%;
    line-height: 1.5;
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.1);
  }

  .bot-message {
    align-self: flex-start;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(0, 243, 255, 0.4);
    color: #f1f5f9;
    padding: 14px 18px;
    border-radius: 14px 14px 14px 0;
    max-width: 88%;
    line-height: 1.6;
    box-shadow: var(--glow-shadow);
  }

  /* Boutons & Contrôles */
  .row-btn {
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  }

  .row-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.15);
  }

  .btn-green {
    background: var(--green-accent);
    color: #000;
    box-shadow: 0 0 12px rgba(0, 255, 102, 0.4);
  }

  .btn-yellow {
    background: var(--yellow-accent);
    color: #000;
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
  }

  .btn-pink {
    background: var(--pink-accent);
    color: #fff;
    box-shadow: 0 0 12px rgba(255, 20, 147, 0.4);
  }
  `;

  const styleElement = document.createElement('style');
  styleElement.id = 'dsk-peginti-theme';
  styleElement.textContent = cssStyles;
  document.head.appendChild(styleElement);
})();
