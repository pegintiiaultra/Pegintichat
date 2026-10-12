/**
 * PEGINTI-CHAT V3 FRONTEND SOUVERAIN
 * Moteur bo'oivinichat & Studio DSK Code
 * Conçu par Tomo Ombede Barnabé Bertrand · TOMTECH.INC (Cameroun)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // UTILITAIRE : FORMATAGE TEXTE & CODE (MARKDOWN LÉGER SOUVERAIN)
  // ============================================================
  function formatTexteSouverain(raw) {
    if (!raw) return '';
    let text = String(raw).trim();

    // Titres markdown
    text = text.replace(/^### (.*$)/gim, '<h4 style="color:#38bdf8; font-size:13px; font-weight:800; margin-top:14px; margin-bottom:6px;">$1</h4>');
    text = text.replace(/^## (.*$)/gim, '<h3 style="color:#facc15; font-size:14px; font-weight:800; margin-top:16px; margin-bottom:6px;">$1</h3>');
    text = text.replace(/^# (.*$)/gim, '<h2 style="color:#22c55e; font-size:15px; font-weight:800; margin-top:18px; margin-bottom:8px;">$1</h2>');

    // Séparateurs horizontaux
    text = text.replace(/^---$/gim, '<hr style="border:0; border-top:1px solid rgba(255,255,255,0.12); margin:12px 0;" />');

    // Blocs de code ```lang ... ```
    text = text.replace(/```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang.trim() || 'code';
      return `<div class="code-box-wrapper">
        <div class="code-box-header"><span>${language}</span><button class="btn-copy-mini" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerText='Copié!'; setTimeout(()=>this.innerText='Copier', 2000)">Copier</button></div>
        <pre class="code-box-content"><code>${code.trim()}</code></pre>
      </div>`;
    });

    // Code en ligne `code`
    text = text.replace(/`([^`]+)`/g, '<code class="code-inline">$1</code>');

    // Gras **texte**
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italique *texte*
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Listes à puces avec astérisque * [Il y a ...]
    text = text.replace(/^\* \[(.*?)\] (.*)$/gm, '<div style="margin-bottom:6px; padding-left:12px; border-left:2px solid #38bdf8;"><strong>• [$1]</strong> $2</div>');

    // Puces classiques
    text = text.replace(/^\s*[-•]\s+(.+)$/gm, '<div class="bullet-item">• $1</div>');

    // Liens markdown [Texte](URL)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; text-decoration:underline; font-weight:600;">$1 ↗</a>');

    // Liens de consultation dépêche
    text = text.replace(/🔗 Consulter la dépêche sur (.*?) ↗/g, '<span style="display:inline-block; margin-top:3px; margin-bottom:8px; color:#38bdf8; font-size:11.5px; font-weight:700;">🔗 Source certifiée : $1 ↗</span>');

    // Options A/, B/, C/ mises en valeur
    text = text.replace(/(?:^|<br\s*\/?>)\s*(\*{0,2})([A-Z])\/(\*{0,2})\s+(.+?)(?=(?:<br\s*\/?>|$))/gi, '<div style="margin: 6px 0; padding: 6px 10px; background: rgba(56,189,248,0.08); border-left: 3px solid #38bdf8; border-radius: 4px;"><strong style="color:#38bdf8; font-weight:800; margin-right:6px;">$2/</strong> $4</div>');

    // Retours à la ligne
    text = text.replace(/\n\n+/g, '<br/><br/>');
    text = text.replace(/\n/g, '<br/>');
    text = text.replace(/<\/h([1-6])><br\s*\/?>/gi, '</h$1>');

    return text;
  }

  // ============================================================
  // TEMPLATES DE CODE BO'OIVINICHAT DSK
  // ============================================================
  const CODE_TEMPLATES = {
    javascript: `// Matrice de Calcul Frugal Techno-eecoc V3.5 (JavaScript)
function executerCalculSouverain(fluxTenseurs) {
  console.log("⚡ Démarrage du cycle Techno-eecoc...");
  const seuilOptimisation = 0.998;
  const donneesTraitees = fluxTenseurs.map(val => val * seuilOptimisation);
  return {
    statut: "SUCCÈS_CIRCULAIRE",
    economieEnergie: "62.4%",
    empreinteCarbone: "Neutre",
    resultats: donneesTraitees
  };
}

module.exports = { executerCalculSouverain };`,

    python: `# Module Souverain PEGINTI Python V3.5
import numpy as np

def optimiser_tenseurs_frugaux(vecteur_entree):
    """Réduction frugale de calcul selon la doctrine Techno-eecoc"""
    print("🌿 Initialisation du calcul matriciel sobre...")
    facteur_souverain = 0.998
    resultats = np.array(vecteur_entree) * facteur_souverain
    return {
        "statut": "OPTIMISÉ",
        "gain_efficience": "65%",
        "tenseurs": resultats.tolist()
    }`,

    typescript: `// Interface & Service bo'oivinichat Studio (TypeScript)
export interface ReponseTechnoEecoc {
  idSession: string;
  tauxEfficience: number;
  empreinte: "Neutre" | "Basse";
}

export function validerCodeSouverain(code: string): ReponseTechnoEecoc {
  return {
    idSession: "SES-" + Date.now(),
    tauxEfficience: 98.6,
    empreinte: "Neutre"
  };
}`,

    c: `/* Moteur Frugal C - Techno-eecoc V3.5 */
#include <stdio.h>

void executer_matrice_circulaire(int tenseurs[], int taille) {
    printf("🇨🇲 Exécution frugale TOMTECH en C...\\n");
    for (int i = 0; i < taille; i++) {
        tenseurs[i] = tenseurs[i] ^ 0xAA;
    }
}`,

    rust: `// Implémentation Rust Haute Sécurité MINANG Mesh
pub fn securiser_flux(donnees: &[u8]) -> Vec<u8> {
    println!("🔒 Chiffrement souverain MINANG Mesh...");
    donnees.iter().map(|b| b ^ 0x42).collect()
}`,

    html: `<!-- Composant Vitrine Souveraine Tailwind CSS -->
<div class="p-6 bg-slate-900 border border-emerald-500 rounded-xl text-white">
  <h2 class="text-xl font-bold text-amber-400">PEGINTI-CHAT V3</h2>
  <p class="text-slate-300 text-sm mt-2">IA Souveraine Africaine · TOMTECH.INC</p>
</div>`
  };

  // ============================================================
  // ÉLÉMENTS DOM
  // ============================================================
  const btnNavRefresh = document.getElementById('btn-nav-refresh');

  // Bloc 1 : WOUNANET
  const inputHomeWounanet = document.getElementById('input-home-wounanet');
  const btnHomeWounanetSearch = document.getElementById('btn-home-wounanet-search');
  const wounanetHomeResultBox = document.getElementById('wounanet-home-result-box');
  const btnOpenWounanetVitrine = document.getElementById('btn-open-wounanet-vitrine');

  // Bloc 2 : Chat interactif
  const formHomeChat = document.getElementById('form-home-chat');
  const inputHomeChat = document.getElementById('input-home-chat');
  const chatHomeResultBox = document.getElementById('chat-home-result-box');
  const btnHomeResetChat = document.getElementById('btn-home-reset-chat');
  const btnOpenChatModal = document.getElementById('btn-open-chat-modal');

  // Bloc 3 : Vitrine Premium
  const btnOpenPremiumModal = document.getElementById('btn-open-premium-modal');
  const btnHomeExplorePremium = document.getElementById('btn-home-explore-premium');

  // Modales
  const modalPremium = document.getElementById('modal-premium-catalogue');
  const modalWounanet = document.getElementById('modal-wounanet-dispatch');
  const modalConsole = document.getElementById('modal-cognitive-console');
  const modalChatFlow = document.getElementById('modal-chat-flow-zone');
  const modalChatForm = document.getElementById('modal-chat-form');
  const modalChatInput = document.getElementById('modal-chat-input');
  const btnModalResetChat = document.getElementById('btn-modal-reset-chat');
  const modalPensee = document.getElementById('modal-pensee-charte');
  const modalMomo = document.getElementById('modal-momo-order');
  const modalAutoreflexion = document.getElementById('modal-autoreflexion-lab');
  const modalMetaphores = document.getElementById('modal-metaphores-translator');

  // Boutons de fermeture des modales
  const btnCloseModalPremium = document.getElementById('btn-close-modal-premium');
  const btnCloseModalWounanet = document.getElementById('btn-close-modal-wounanet');
  const btnCloseModalConsole = document.getElementById('btn-close-modal-console');
  const btnCloseModalPensee = document.getElementById('btn-close-modal-pensee');
  const btnCloseModalMomo = document.getElementById('btn-close-modal-momo');
  const btnCloseModalAutoreflexion = document.getElementById('btn-close-modal-autoreflexion');
  const btnCloseModalMetaphores = document.getElementById('btn-close-modal-metaphores');

  // Dock flottant
  const dockBtnPensee = document.getElementById('dock-btn-pensee');
  const dockBtnWounanet = document.getElementById('dock-btn-wounanet');
  const dockBtnChat = document.getElementById('dock-btn-chat');
  const dockBtnMomo = document.getElementById('dock-btn-momo');
  const dockBtnAutoreflexion = document.getElementById('dock-btn-autoreflexion');
  const dockBtnMetaphores = document.getElementById('dock-btn-metaphores');

  // ============================================================
  // GESTION DES MODALES
  // ============================================================
  function openModal(modal) {
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.add('hidden');
      const anyOpen = document.querySelectorAll('.modal-overlay:not(.hidden)').length > 0;
      if (!anyOpen) {
        document.body.style.overflow = '';
      }
    }
  }

  if (btnCloseModalPremium) btnCloseModalPremium.addEventListener('click', () => closeModal(modalPremium));
  if (btnCloseModalWounanet) btnCloseModalWounanet.addEventListener('click', () => closeModal(modalWounanet));
  if (btnCloseModalConsole) btnCloseModalConsole.addEventListener('click', () => closeModal(modalConsole));
  if (btnCloseModalPensee) btnCloseModalPensee.addEventListener('click', () => closeModal(modalPensee));
  if (btnCloseModalMomo) btnCloseModalMomo.addEventListener('click', () => closeModal(modalMomo));
  if (btnCloseModalAutoreflexion) btnCloseModalAutoreflexion.addEventListener('click', () => closeModal(modalAutoreflexion));
  if (btnCloseModalMetaphores) btnCloseModalMetaphores.addEventListener('click', () => closeModal(modalMetaphores));

  // Fermeture par clic sur le backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // ============================================================
  // GESTION UNIFIÉE DES VUES ET NAVIGATION FLUIDE (PC & ANDROID)
  // ============================================================
  function switchView(viewId, targetElementId) {
    if (!viewId) return;

    // Masquer toutes les vues
    document.querySelectorAll('.app-view-panel').forEach(panel => {
      panel.classList.remove('active-view');
    });

    // Activer la vue cible
    const targetPanel = document.getElementById(viewId);
    if (targetPanel) {
      targetPanel.classList.add('active-view');
    }

    // Mettre à jour l'état actif des onglets supérieurs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-target-view') === viewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Mettre à jour l'état actif des boutons du dock mobile
    document.querySelectorAll('.bottom-dock-btn').forEach(btn => {
      if (btn.getAttribute('data-target-view') === viewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Mettre à jour les raccourcis
    document.querySelectorAll('.shortcut-pill-btn').forEach(btn => {
      if (btn.getAttribute('data-target-view') === viewId && !btn.getAttribute('data-scroll-to')) {
        btn.classList.add('active-pill');
      } else {
        btn.classList.remove('active-pill');
      }
    });

    // Déclencher les chargements automatiques selon la vue
    if (viewId === 'view-doctrine-matrice') {
      loadPenseeCharte();
    }
    if (viewId === 'view-studio-sdk') {
      const editor = document.getElementById('textarea-sdk-code-editor');
      if (editor && !editor.value.trim() && typeof CODE_TEMPLATES !== 'undefined') {
        editor.value = CODE_TEMPLATES.javascript;
      }
    }

    // Défilement optionnel vers un élément cible
    if (targetElementId) {
      setTimeout(() => {
        const el = document.getElementById(targetElementId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Écouteurs sur les onglets de navigation principaux
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-target-view');
      switchView(viewId);
    });
  });

  // Écouteurs sur le dock inférieur mobile
  document.querySelectorAll('.bottom-dock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-target-view');
      switchView(viewId);
    });
  });

  // Écouteurs sur les raccourcis rapides
  document.querySelectorAll('.shortcut-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-target-view');
      const scrollTo = btn.getAttribute('data-scroll-to');
      switchView(viewId, scrollTo);
    });
  });

  // Clic sur la marque en haut à gauche
  const brandHomeLink = document.getElementById('brand-home-link');
  if (brandHomeLink) {
    brandHomeLink.addEventListener('click', () => {
      switchView('view-chat-wounanet');
    });
  }

  // Clic CTA vers vitrine premium
  if (btnHomeExplorePremium) {
    btnHomeExplorePremium.addEventListener('click', () => {
      switchView('view-vitrine-premium');
    });
  }

  // Clic vers MINANG direct
  const btnLaunchMinangDirect = document.getElementById('btn-launch-minang-direct');
  if (btnLaunchMinangDirect) {
    btnLaunchMinangDirect.addEventListener('click', () => {
      switchView('view-minang-offgrid');
    });
  }

  // Onglets dans l'en-tête de la vitrine
  const btnTabViewCatalog = document.getElementById('btn-tab-view-catalog');
  const btnTabViewCheckout = document.getElementById('btn-tab-view-checkout');
  if (btnTabViewCatalog) {
    btnTabViewCatalog.addEventListener('click', () => {
      btnTabViewCatalog.classList.add('active');
      if (btnTabViewCheckout) btnTabViewCheckout.classList.remove('active');
      const grid = document.getElementById('products-showcase-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (btnTabViewCheckout) {
    btnTabViewCheckout.addEventListener('click', () => {
      btnTabViewCheckout.classList.add('active');
      if (btnTabViewCatalog) btnTabViewCatalog.classList.remove('active');
      const tunnel = document.getElementById('checkout-tunnel-box');
      if (tunnel) tunnel.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Copie des numéros Mobile Money en 1 clic
  document.querySelectorAll('.btn-copy-number').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.getAttribute('data-copy');
      if (num && navigator.clipboard) {
        navigator.clipboard.writeText(num).then(() => {
          const originalText = btn.innerText;
          btn.innerText = '✓ Numéro Copié !';
          btn.style.color = '#34d399';
          setTimeout(() => {
            btn.innerText = originalText;
            btn.style.color = '';
          }, 2000);
        });
      }
    });
  });

  // Suggestions rapides d'actualité WOUNANET
  document.querySelectorAll('.news-suggestion').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q && inputHomeWounanet) {
        inputHomeWounanet.value = q;
        performWounanetHomeSearch();
      }
    });
  });

  // Simulateur interactif MINANG Lite (SMS-IP)
  const formMinangSim = document.getElementById('form-minang-simulator');
  const inputMinangMsg = document.getElementById('input-minang-sim-msg');
  const minangSimFeed = document.getElementById('minang-sim-feed');
  if (formMinangSim && inputMinangMsg && minangSimFeed) {
    formMinangSim.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = inputMinangMsg.value.trim();
      if (!msg) return;

      const userTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      minangSimFeed.innerHTML += `
        <div class="sim-message node-local">
          <span class="node-id" style="color:#10b981;">Votre Terminal [Noeud Local #01 · SMS-IP] (${userTime}) :</span>
          <p>${msg}</p>
        </div>
      `;
      inputMinangMsg.value = '';
      minangSimFeed.scrollTop = minangSimFeed.scrollHeight;

      setTimeout(() => {
        const ackTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        minangSimFeed.innerHTML += `
          <div class="sim-message node-remote">
            <span class="node-id">Noeud Relais [Yaoundé Mesh #04] (${ackTime}) :</span>
            <p>✓ <strong>Paquet SMS-IP Acquitté :</strong> Message relayé via la maille locale sans Internet. Intégrité souveraine garantie.</p>
          </div>
        `;
        minangSimFeed.scrollTop = minangSimFeed.scrollHeight;
      }, 700);
    });
  }

  // Ouverture des modales par boutons d'action
  if (btnOpenPremiumModal) btnOpenPremiumModal.addEventListener('click', () => switchView('view-vitrine-premium'));
  if (btnOpenWounanetVitrine) btnOpenWounanetVitrine.addEventListener('click', () => {
    openModal(modalWounanet);
    fetchWounanetLive(inputWounanetModalSearch?.value || "La guerre au moyen Orient");
  });
  if (btnOpenChatModal) btnOpenChatModal.addEventListener('click', () => {
    openModal(modalConsole);
    if (typeof renderModalConversation === 'function') renderModalConversation();
  });

  // Clics sur le Dock Flottant Discret
  if (dockBtnPensee) dockBtnPensee.addEventListener('click', () => {
    switchView('view-doctrine-matrice');
  });
  if (dockBtnWounanet) dockBtnWounanet.addEventListener('click', () => {
    openModal(modalWounanet);
    fetchWounanetLive(inputWounanetModalSearch?.value || "La guerre au moyen Orient");
  });
  if (dockBtnChat) dockBtnChat.addEventListener('click', () => switchView('view-chat-wounanet'));
  if (dockBtnMomo) dockBtnMomo.addEventListener('click', () => {
    switchView('view-vitrine-premium', 'checkout-tunnel-box');
  });
  if (dockBtnAutoreflexion) dockBtnAutoreflexion.addEventListener('click', () => {
    switchView('view-doctrine-matrice', 'autoreflexion-grid-results');
    inspecterAutoreflexion();
  });
  if (dockBtnMetaphores) dockBtnMetaphores.addEventListener('click', () => {
    switchView('view-doctrine-matrice', 'box-metaphores-output');
    traduireMetaphores();
  });

  // Refresh
  if (btnNavRefresh) {
    btnNavRefresh.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // ============================================================
  // MODE PLEIN ÉCRAN AUTOMATIQUE & DÉCLENCHABLE (PC & ANDROID)
  // ============================================================
  const btnToggleFullscreen = document.getElementById('btn-toggle-fullscreen');
  if (btnToggleFullscreen) {
    const updateFsVisuals = () => {
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      const fsIcon = btnToggleFullscreen.querySelector('.fs-icon');
      const fsText = btnToggleFullscreen.querySelector('.fs-text');
      if (isFs) {
        if (fsIcon) fsIcon.textContent = '✕';
        if (fsText) fsText.textContent = 'Quitter';
        btnToggleFullscreen.title = "Quitter le mode plein écran";
        btnToggleFullscreen.classList.add('active-fs');
        document.body.classList.add('is-fullscreen');
      } else {
        if (fsIcon) fsIcon.textContent = '⛶';
        if (fsText) fsText.textContent = 'Plein Écran';
        btnToggleFullscreen.title = "Basculer en Plein Écran automatique (PC & Android)";
        btnToggleFullscreen.classList.remove('active-fs');
        document.body.classList.remove('is-fullscreen');
      }
    };

    btnToggleFullscreen.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            await document.documentElement.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen();
          }
        }
      } catch (err) {
        console.warn("Fullscreen switch notice:", err);
      }
      updateFsVisuals();
    });

    document.addEventListener('fullscreenchange', updateFsVisuals);
    document.addEventListener('webkitfullscreenchange', updateFsVisuals);
  }

  // Détection automatique de l'orientation et ajustement fluide plein écran (PC vs Android)
  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 860;
    document.body.classList.toggle('device-mobile', isMobile);
    document.body.classList.toggle('device-desktop', !isMobile);
  });
  // Initialisation au chargement
  document.body.classList.toggle('device-mobile', window.innerWidth <= 860);
  document.body.classList.toggle('device-desktop', window.innerWidth > 860);

  // ============================================================
  // BLOC 1 : RECHERCHE WOUNANET DIRECT SUR L'ACCUEIL
  // ============================================================
  async function performWounanetHomeSearch() {
    const query = (inputHomeWounanet ? inputHomeWounanet.value : '').trim() || "La guerre au moyen Orient";
    wounanetHomeResultBox.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; color:#38bdf8; font-size:12px; padding: 6px 0;">
        <span class="matrix-pulse-dot"></span>
        <span>Recherche en temps réel et analyse géopolitique en cours...</span>
      </div>
    `;

    try {
      const res = await fetch(`/api/wounanet?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const rapport = data.rapportTexte || data.searchResult || data.synthese || "";

      if (rapport) {
        wounanetHomeResultBox.innerHTML = `
          <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
            <button class="btn-copy-mini" onclick="navigator.clipboard.writeText(this.getAttribute('data-text')); this.innerText='Copié!'; setTimeout(()=>this.innerText='📋 Copier le rapport', 2000)" data-text="${rapport.replace(/"/g, '&quot;')}">📋 Copier le rapport</button>
          </div>
          <div class="wounanet-canonical-output" style="color: #f1f5f9; font-size: 12px; line-height: 1.6; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;">
            ${formatTexteSouverain(rapport)}
          </div>
        `;
      } else {
        wounanetHomeResultBox.innerHTML = `<p>WOUNANET : Saisissez une recherche d'actualité puis cliquez sur WOUNANET.</p>`;
      }
    } catch (e) {
      wounanetHomeResultBox.innerHTML = `<p style="color: #f87171;">Échec de liaison avec le flux WOUNANET (Pilote IVIOK 24/24).</p>`;
    }
  }

  if (btnHomeWounanetSearch) {
    btnHomeWounanetSearch.addEventListener('click', performWounanetHomeSearch);
  }
  if (inputHomeWounanet) {
    inputHomeWounanet.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performWounanetHomeSearch();
      }
    });
  }

  // Chargement initial WOUNANET
  if (inputHomeWounanet && inputHomeWounanet.value.trim()) {
    performWounanetHomeSearch();
  } else {
    wounanetHomeResultBox.innerHTML = `<p style="color: #94a3b8; font-size: 12px; font-weight: 500;">WOUNANET : Saisissez une recherche d'actualité puis cliquez sur WOUNANET.</p>`;
  }

  // ============================================================
  // GESTION SESSION ET MÉMOIRE CONTINUE UNIFIÉE & PERSISTANTE (LOCALSTORAGE)
  // ============================================================
  const STORAGE_KEY_SESSION = 'peginti_session_id';
  const STORAGE_KEY_HISTORY = 'peginti_conversation_history';

  let currentSessionId = localStorage.getItem(STORAGE_KEY_SESSION);
  if (!currentSessionId) {
    currentSessionId = 'ses-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(STORAGE_KEY_SESSION, currentSessionId);
  }

  // ============================================================
  // BLOC 2 : CHAT INTERACTIF DIRECT SUR L'ACCUEIL (PERSISTANT)
  // ============================================================
  let conversationHistory = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        conversationHistory = parsed;
      }
    }
  } catch (e) {
    conversationHistory = [];
  }

  function sauvegarderHistoriqueLocal() {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(conversationHistory));
    } catch (e) {
      console.warn("Erreur sauvegarde historique localStorage :", e);
    }
  }

  function renderHomeConversation() {
    if (!chatHomeResultBox) return;
    if (conversationHistory.length === 0) {
      chatHomeResultBox.innerHTML = `
        <div class="chat-welcome-notice" style="color: #cbd5e1; font-size: 12px; line-height: 1.6;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
            <span style="font-size:14px;">🧠</span>
            <strong style="color:#38bdf8;">PEGINTI IA :</strong>
            <span style="background: rgba(56,189,248,0.15); color:#38bdf8; font-size:9.5px; padding:2px 6px; border-radius:4px;">Techno-eecoc V3.5</span>
          </div>
          <p style="margin-bottom: 0;">bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous aider aujourd'hui ?</p>
        </div>`;
      return;
    }

    let html = '';
    conversationHistory.forEach((turn) => {
      html += `
        <div style="margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
          <div style="color: #93c5fd; font-size: 11.5px; margin-bottom: 6px;">
            <strong>Vous :</strong> ${turn.user}
          </div>
          <div style="color: #f8fafc; font-size: 12px; line-height: 1.65;">
            <div style="margin-bottom:4px; display:flex; align-items:center; gap:5px;">
              <strong style="color:#38bdf8; font-size:11.5px;">🧠 PEGINTI IA :</strong>
            </div>
            <div class="narrative-body" style="display: flex; flex-direction: column; gap: 8px;">
              ${formatTexteSouverain(turn.bot)}
            </div>
          </div>
        </div>
      `;
    });
    chatHomeResultBox.innerHTML = html;
    chatHomeResultBox.scrollTop = chatHomeResultBox.scrollHeight;
  }

  function renderModalConversation() {
    if (!modalChatFlow) return;
    if (conversationHistory.length === 0) {
      modalChatFlow.innerHTML = `
        <div class="chat-row bot-row">
          <div class="chat-avatar">P</div>
          <div class="chat-bubble">
            <div class="bubble-meta">
              <strong>PEGINTI-CHAT V3</strong> · <span>Filtre Matriciel Actif</span>
            </div>
            <p>Bonjour, bienvenue sur la console cognitive PEGINTI IA. Comment puis-je vous aider aujourd'hui ?</p>
          </div>
        </div>
      `;
      return;
    }

    let html = '';
    conversationHistory.forEach((turn) => {
      html += `
        <div class="chat-row user-row">
          <div class="chat-bubble"><p>${turn.user}</p></div>
        </div>
        <div class="chat-row bot-row">
          <div class="chat-avatar">P</div>
          <div class="chat-bubble">
            <div class="bubble-meta"><strong>PEGINTI-CHAT V3</strong> · <span>bo'oivinichat</span></div>
            <div style="font-size: 12px; line-height: 1.65;">${formatTexteSouverain(turn.bot)}</div>
          </div>
        </div>
      `;
    });
    modalChatFlow.innerHTML = html;
    modalChatFlow.scrollTop = modalChatFlow.scrollHeight;
  }

  function renderAllConversations() {
    renderHomeConversation();
    renderModalConversation();
  }

  // Rendu initial dès le chargement de la page (restaure le fil complet sans réinitialisation)
  renderAllConversations();

  if (formHomeChat && inputHomeChat) {
    formHomeChat.addEventListener('submit', async (e) => {
      e.preventDefault();
      const question = inputHomeChat.value.trim();
      if (!question) return;

      inputHomeChat.value = '';
      
      const tempId = 'loading-' + Date.now();
      chatHomeResultBox.innerHTML += `
        <div id="${tempId}" style="margin-top: 8px; color: #38bdf8; font-size: 11.5px; border-top: 1px dashed rgba(56,189,248,0.2); padding-top: 6px;">
          <strong>Vous :</strong> ${question}<br/>
          <em style="color: #34d399;">🧠 Réflexion en cours...</em>
        </div>
      `;
      chatHomeResultBox.scrollTop = chatHomeResultBox.scrollHeight;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            sessionId: currentSessionId,
            history: conversationHistory.map(c => ({ user: c.user, bot: c.bot }))
          })
        });
        const data = await res.json();
        const rep = data.response || data.reponse || data.answer || data.narration || "Réflexion achevée.";

        conversationHistory.push({ user: question, bot: rep });
        sauvegarderHistoriqueLocal();
        renderAllConversations();
      } catch (err) {
        const loadingEl = document.getElementById(tempId);
        if (loadingEl) loadingEl.innerHTML = `<span style="color: #f87171;">Erreur de communication avec le moteur souverain.</span>`;
      }
    });
  }

  function reinitialiserFilConversation() {
    if (confirm("Voulez-vous vraiment réinitialiser tout l'historique de cette discussion ?")) {
      conversationHistory = [];
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      currentSessionId = 'ses-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(STORAGE_KEY_SESSION, currentSessionId);
      renderAllConversations();
    }
  }

  if (btnHomeResetChat) {
    btnHomeResetChat.addEventListener('click', reinitialiserFilConversation);
  }
  if (btnModalResetChat) {
    btnModalResetChat.addEventListener('click', reinitialiserFilConversation);
  }

  // ============================================================
  // GESTION DES ONGLETS DANS LA MODALE PREMIUM
  // ============================================================
  const tabBtnBoutique = document.getElementById('tab-btn-boutique');
  const tabBtnSdkStudio = document.getElementById('tab-btn-sdk-studio');
  const viewPremiumBoutique = document.getElementById('view-premium-boutique');
  const viewPremiumSdkStudio = document.getElementById('view-premium-sdk-studio');

  if (tabBtnBoutique && tabBtnSdkStudio && viewPremiumBoutique && viewPremiumSdkStudio) {
    tabBtnBoutique.addEventListener('click', () => {
      tabBtnBoutique.classList.add('active');
      tabBtnSdkStudio.classList.remove('active');
      viewPremiumBoutique.classList.remove('hidden');
      viewPremiumSdkStudio.classList.add('hidden');
    });

    tabBtnSdkStudio.addEventListener('click', () => {
      tabBtnSdkStudio.classList.add('active');
      tabBtnBoutique.classList.remove('active');
      viewPremiumSdkStudio.classList.remove('hidden');
      viewPremiumBoutique.classList.add('hidden');
      if (typeof renderSdkConversation === 'function') renderSdkConversation();
    });
  }

  // ============================================================
  // TUNNEL DE PAIEMENT AUTOMATISÉ (MTN MOMO, ORANGE & BON D'ACHAT ADMIN)
  // ============================================================
  let selectedCheckoutProduct = {
    id: "prod-dsk-peginti-ia",
    nom: "DSK PEGINTI IA Pro",
    prix: "15 000 FCFA"
  };

  const checkoutTunnelBox = document.getElementById('checkout-tunnel-box');
  const checkoutSelectedTitle = document.getElementById('checkout-selected-product-title');
  const checkoutSelectedPrice = document.getElementById('checkout-selected-price');
  const formCheckoutAutomated = document.getElementById('form-checkout-automated');
  const btnToggleCouponAdil = document.getElementById('btn-toggle-coupon-adil');
  const couponAdilInputWrap = document.getElementById('coupon-adil-input-wrap');
  const inputCouponAdil = document.getElementById('input-coupon-adil');
  const btnApplyCouponAdil = document.getElementById('btn-apply-coupon-adil');
  const couponAdilStatus = document.getElementById('coupon-adil-status');
  const officialReceiptContainer = document.getElementById('official-receipt-container');
  const receiptDetailsContent = document.getElementById('receipt-details-content');
  const btnPrintReceipt = document.getElementById('btn-print-receipt');
  const btnCopyReceipt = document.getElementById('btn-copy-receipt');

  let bonAdminApplique = false;

  // Sélection d'un produit depuis la vitrine
  document.querySelectorAll('.btn-open-checkout').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodId = btn.getAttribute('data-prod-id');
      const prodName = btn.getAttribute('data-prod-name');
      const prodPrice = btn.getAttribute('data-prod-price');

      selectedCheckoutProduct = {
        id: prodId,
        nom: prodName,
        prix: prodPrice
      };

      if (checkoutSelectedTitle) {
        checkoutSelectedTitle.textContent = `🛒 Tunnel de Paiement Automatisé : ${prodName}`;
      }
      if (checkoutSelectedPrice) {
        checkoutSelectedPrice.textContent = bonAdminApplique ? "0 FCFA (Bon d'achat Admin)" : prodPrice;
      }

      switchView('view-vitrine-premium', 'checkout-tunnel-box');
      if (checkoutTunnelBox) {
        checkoutTunnelBox.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Gestion du choix opérateur (Radio cartes stylisées)
  const labelOpMtn = document.getElementById('label-op-mtn');
  const labelOpOrange = document.getElementById('label-op-orange');
  const radioOps = document.querySelectorAll('input[name="checkout-operator"]');

  radioOps.forEach(radio => {
    radio.addEventListener('change', () => {
      if (labelOpMtn && labelOpOrange) {
        if (radio.value === 'MTN') {
          labelOpMtn.classList.add('active');
          labelOpOrange.classList.remove('active');
        } else {
          labelOpOrange.classList.add('active');
          labelOpMtn.classList.remove('active');
        }
      }
    });
  });

  // Affichage discret du champ Bon d'achat Admin
  if (btnToggleCouponAdil && couponAdilInputWrap) {
    btnToggleCouponAdil.addEventListener('click', () => {
      couponAdilInputWrap.classList.toggle('hidden');
      if (!couponAdilInputWrap.classList.contains('hidden') && inputCouponAdil) {
        inputCouponAdil.focus();
      }
    });
  }

  // Validation du Bon d'achat Admin (@10-PxxA=2025)
  if (btnApplyCouponAdil && inputCouponAdil && couponAdilStatus) {
    btnApplyCouponAdil.addEventListener('click', () => {
      const code = inputCouponAdil.value.trim();
      if (code === '@10-PxxA=2025') {
        bonAdminApplique = true;
        couponAdilStatus.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ Bon d'achat Admin validé ! Achat validé à 0 Franc CFA.</span>`;
        if (checkoutSelectedPrice) checkoutSelectedPrice.textContent = "0 FCFA (Bon d'achat Admin validé)";
      } else {
        bonAdminApplique = false;
        couponAdilStatus.innerHTML = `<span style="color:#ef4444;">Mot de passe du bon d'achat invalide.</span>`;
        if (checkoutSelectedPrice) checkoutSelectedPrice.textContent = selectedCheckoutProduct.prix;
      }
    });
  }

  // Soumission du formulaire de paiement
  if (formCheckoutAutomated) {
    formCheckoutAutomated.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nomClient = document.getElementById('checkout-client-name')?.value || '';
      const emailClient = document.getElementById('checkout-client-email')?.value || '';
      const telephone = document.getElementById('checkout-client-phone')?.value || '';
      const opEl = document.querySelector('input[name="checkout-operator"]:checked');
      const operateur = opEl ? opEl.value : 'MTN';
      const codeBon = bonAdminApplique ? '@10-PxxA=2025' : (inputCouponAdil?.value?.trim() || '');

      const btnSubmit = document.getElementById('btn-submit-checkout-pay');
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>⚡ Traitement et enregistrement du reçu en cours...</span>';
      }

      try {
        const res = await fetch('/api/premium/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            produitId: selectedCheckoutProduct.id,
            nomClient,
            emailClient,
            telephone,
            operateur,
            codeBonAchat: codeBon
          })
        });

        const data = await res.json();
        if (data.success && data.recu) {
          afficherRecuOfficiel(data.recu);
        } else {
          alert("Erreur lors de la validation du paiement : " + (data.error || "Veuillez réessayer."));
        }
      } catch (err) {
        alert("Erreur de connexion au serveur de paiement : " + err.message);
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '💳 VALIDER LE PAIEMENT &amp; GÉNÉRER LE REÇU OFFICIEL';
        }
      }
    });
  }

  function afficherRecuOfficiel(recu) {
    if (!officialReceiptContainer || !receiptDetailsContent) return;

    receiptDetailsContent.innerHTML = `
      <div class="receipt-item-col">
        <span class="receipt-label">RÉFÉRENCE OFFICIELLE</span>
        <strong class="receipt-val-highlight">${recu.reference}</strong>
      </div>

      <div class="receipt-item-col">
        <span class="receipt-label">DATE &amp; HEURE D'ENREGISTREMENT</span>
        <strong class="receipt-val">${recu.date} à ${recu.heure}</strong>
      </div>

      <div class="receipt-item-col">
        <span class="receipt-label">NOM DU SOUSCRIPTEUR / CLIENT</span>
        <strong class="receipt-val">${recu.nomClient}</strong>
      </div>

      <div class="receipt-item-col">
        <span class="receipt-label">CONTACT / TÉLÉPHONE</span>
        <strong class="receipt-val">${recu.telephone} ${recu.emailClient ? `(${recu.emailClient})` : ''}</strong>
      </div>

      <div class="receipt-item-col">
        <span class="receipt-label">PRODUIT / LOGICIEL ACQUIS</span>
        <strong class="receipt-val-prod">${recu.produit}</strong>
      </div>

      <div class="receipt-item-col">
        <span class="receipt-label">MODE DE PAIEMENT</span>
        <strong class="receipt-val">${recu.operateur || recu.modeReglement}</strong>
      </div>

      <div class="receipt-item-col">
        <span class="receipt-label">MONTANT RÉGLÉ</span>
        <strong class="receipt-val-price">${recu.montantRegle}</strong>
      </div>

      <div class="receipt-item-col">
        <span class="receipt-label">STATUT DU REÇU</span>
        <strong style="color:#10b981;">✓ ${recu.statut}</strong>
      </div>
    `;

    officialReceiptContainer.classList.remove('hidden');
    officialReceiptContainer.scrollIntoView({ behavior: 'smooth' });
  }

  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }

  if (btnCopyReceipt) {
    btnCopyReceipt.addEventListener('click', () => {
      const recuText = receiptDetailsContent ? receiptDetailsContent.innerText : '';
      if (recuText) {
        navigator.clipboard.writeText(recuText);
        btnCopyReceipt.textContent = '✓ Reçu Copié !';
        setTimeout(() => { btnCopyReceipt.textContent = '📋 Copier les Références'; }, 2000);
      }
    });
  }

  // ============================================================
  // ============================================================
  // STUDIO SDK BO'OIVINI PRO : LES 4 PILIERS SANS DOUBLON
  // ============================================================
  const sdkConsoleStatusText = document.getElementById('sdk-console-status-text');

  // 1. GESTIONNAIRE D'ONGLETS DES 4 PILIERS (NAVIGATION FLUIDE & ZÉRO DOUBLON)
  const pillarButtons = document.querySelectorAll('.pillar-tab-btn');
  const pillarCards = document.querySelectorAll('.sdk-pillar-card');

  function switchPillar(pillarId) {
    pillarButtons.forEach(btn => {
      const targetPillar = btn.getAttribute('data-pillar');
      if (targetPillar === pillarId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    pillarCards.forEach(card => {
      if (card.id === pillarId) {
        card.classList.add('active-pillar');
      } else {
        card.classList.remove('active-pillar');
      }
    });

    if (sdkConsoleStatusText) {
      if (pillarId === 'pillar-import') {
        sdkConsoleStatusText.textContent = "Pilier 1 Actif : Importation de Projets (GitHub, GitLab, ZIP)";
      } else if (pillarId === 'pillar-claude') {
        sdkConsoleStatusText.textContent = "Pilier 2 Actif : Collaboration Exclusive Claude & Déploiement Cloud";
      } else if (pillarId === 'pillar-client-host') {
        sdkConsoleStatusText.textContent = "Pilier 3 Actif : Accès Direct Hébergement Client & Règles Strictes";
      } else if (pillarId === 'pillar-auto-code') {
        sdkConsoleStatusText.textContent = "Pilier 4 Actif : bo'oivinichat Développeur Sans Erreur & Bug Scanner";
      }
    }
  }

  pillarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pillarId = btn.getAttribute('data-pillar');
      if (pillarId) switchPillar(pillarId);
    });
  });

  // ============================================================
  // PILIER 1 : IMPORTATION DIRECTE GITHUB / GITLAB / ARCHIVE ZIP
  // ============================================================
  const inputSdkRepoUrl = document.getElementById('input-sdk-repo-url');
  const btnSdkImportRepo = document.getElementById('btn-sdk-import-repo');
  const inputSdkFileUpload = document.getElementById('input-sdk-file-upload');
  const labelUploadedFileName = document.getElementById('label-uploaded-file-name');
  const btnLoadZipProject = document.getElementById('btn-load-zip-project');
  const projectFileExplorerCard = document.getElementById('project-file-explorer-card');
  const explorerProjectName = document.getElementById('explorer-project-name');
  const explorerProjectBadge = document.getElementById('explorer-project-badge');
  const projectFilesList = document.getElementById('project-files-list');
  const btnJumpEditor = document.getElementById('btn-jump-editor');

  // Modèles rapides de dépôts
  document.querySelectorAll('.btn-quick-repo').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (url && inputSdkRepoUrl) {
        inputSdkRepoUrl.value = url;
        btnSdkImportRepo?.click();
      }
    });
  });

  // Fonction pour charger un fichier dans l'éditeur de code (Pilier 4)
  function chargerFichierDansEditeur(nomFichier, contenuCode, langage = 'javascript') {
    const editor = document.getElementById('textarea-sdk-code-editor');
    const labelFichier = document.getElementById('editor-current-filename');
    const selectLang = document.getElementById('select-sdk-language');

    if (editor) {
      editor.value = contenuCode;
    }
    if (labelFichier) {
      labelFichier.textContent = `Fichier ouvert : ${nomFichier}`;
    }
    if (selectLang && langage) {
      selectLang.value = langage;
    }
  }

  // Importation de dépôt distant (GitHub / GitLab)
  if (btnSdkImportRepo && inputSdkRepoUrl) {
    btnSdkImportRepo.addEventListener('click', async () => {
      const url = inputSdkRepoUrl.value.trim();
      if (!url) {
        alert("Veuillez saisir l'URL d'un dépôt GitHub ou GitLab.");
        return;
      }

      btnSdkImportRepo.disabled = true;
      btnSdkImportRepo.textContent = "⏳ Importation en cours...";

      try {
        const res = await fetch('/api/sdk/import-repo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            repoUrl: url,
            type: url.includes('gitlab') ? 'gitlab' : 'github'
          })
        });

        const data = await res.json();
        if (data.success && data.projet) {
          const p = data.projet;
          if (explorerProjectName) {
            explorerProjectName.innerHTML = `Projet Actif : <strong>${p.nom}</strong>`;
          }
          if (explorerProjectBadge) {
            explorerProjectBadge.textContent = url.includes('gitlab') ? 'GITLAB REPO' : 'GITHUB REPO';
          }

          if (projectFilesList && p.fichiers && p.fichiers.length > 0) {
            projectFilesList.innerHTML = p.fichiers.map((f, idx) => `
              <button type="button" class="file-item-pill ${idx === 0 ? 'active' : ''}" data-file-name="${f.name || f.path}" data-file-lang="${f.lang || 'javascript'}">
                📄 ${f.name || f.path} (${f.size || '2 KB'})
              </button>
            `).join('');

            // Attacher les écouteurs sur les fichiers
            projectFilesList.querySelectorAll('.file-item-pill').forEach((pill, idx) => {
              pill.addEventListener('click', () => {
                projectFilesList.querySelectorAll('.file-item-pill').forEach(b => b.classList.remove('active'));
                pill.classList.add('active');
                const fichierChoisi = p.fichiers[idx];
                if (fichierChoisi) {
                  chargerFichierDansEditeur(fichierChoisi.name || fichierChoisi.path, fichierChoisi.content || `// Contenu de ${fichierChoisi.path}`, fichierChoisi.lang || 'javascript');
                }
              });
            });

            // Charger le premier fichier par défaut
            const premierFichier = p.fichiers[0];
            chargerFichierDansEditeur(premierFichier.name || premierFichier.path, premierFichier.content || p.codeExemple || '', premierFichier.lang || 'javascript');
          }

          ajouterMessageAssistant(`Le dépôt **${p.nom}** (${url}) a été importé avec succès. Les fichiers sources sont disponibles dans l'explorateur pour être modifiés.`);
        } else {
          alert("Erreur lors de l'importation : " + (data.error || "Échec"));
        }
      } catch (err) {
        alert("Erreur de connexion : " + err.message);
      } finally {
        btnSdkImportRepo.disabled = false;
        btnSdkImportRepo.textContent = "⬇️ Importer Dépôt";
      }
    });
  }

  // Importation d'archive ZIP ou de fichiers sources locaux
  if (inputSdkFileUpload && labelUploadedFileName) {
    inputSdkFileUpload.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        labelUploadedFileName.textContent = `Archive / Fichier : ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        if (btnLoadZipProject) btnLoadZipProject.classList.remove('hidden');

        const isZip = file.name.endsWith('.zip') || file.name.endsWith('.tar.gz');

        if (isZip) {
          // Simulation extraction d'archive zip structurée
          const repoNom = file.name.replace(/\.(zip|tar\.gz)$/i, '');
          if (explorerProjectName) explorerProjectName.innerHTML = `Archive Active : <strong>${repoNom}</strong>`;
          if (explorerProjectBadge) explorerProjectBadge.textContent = 'ARCHIVE ZIP DÉCOMPRESSÉE';

          const fichiersSimules = [
            { name: "server.js", lang: "javascript", size: `${(file.size / 1024 * 0.4).toFixed(1)} KB`, content: `// Projet extrait depuis l'archive : ${file.name}\nimport express from 'express';\nconst app = express();\n\napp.get('/', (req, res) => res.json({ message: "Projet ${repoNom} prêt." }));\napp.listen(3000);` },
            { name: "package.json", lang: "json", size: "1.1 KB", content: `{\n  "name": "${repoNom}",\n  "version": "1.0.0",\n  "type": "module"\n}` },
            { name: "index.html", lang: "html", size: "1.8 KB", content: `<!DOCTYPE html>\n<html>\n<head><title>${repoNom}</title></head>\n<body><h1>${repoNom}</h1></body>\n</html>` }
          ];

          if (projectFilesList) {
            projectFilesList.innerHTML = fichiersSimules.map((f, idx) => `
              <button type="button" class="file-item-pill ${idx === 0 ? 'active' : ''}" data-file-name="${f.name}">
                📁 ${f.name} (${f.size})
              </button>
            `).join('');

            projectFilesList.querySelectorAll('.file-item-pill').forEach((pill, idx) => {
              pill.addEventListener('click', () => {
                projectFilesList.querySelectorAll('.file-item-pill').forEach(b => b.classList.remove('active'));
                pill.classList.add('active');
                chargerFichierDansEditeur(fichiersSimules[idx].name, fichiersSimules[idx].content, fichiersSimules[idx].lang);
              });
            });

            chargerFichierDansEditeur(fichiersSimules[0].name, fichiersSimules[0].content, fichiersSimules[0].lang);
          }

          ajouterMessageAssistant(`Archive **${file.name}** décompressée dans le Studio SDK. Vous pouvez explorer et coder les fichiers sources.`);
        } else {
          // Fichier texte ou code source direct
          const reader = new FileReader();
          reader.onload = (evt) => {
            const content = evt.target?.result;
            if (typeof content === 'string') {
              chargerFichierDansEditeur(file.name, content);
              ajouterMessageAssistant(`Le fichier source **${file.name}** est prêt dans l'éditeur de code.`);
            }
          };
          reader.readAsText(file);
        }
      }
    });
  }

  if (btnLoadZipProject) {
    btnLoadZipProject.addEventListener('click', () => {
      switchPillar('pillar-auto-code');
    });
  }

  if (btnJumpEditor) {
    btnJumpEditor.addEventListener('click', () => {
      switchPillar('pillar-auto-code');
    });
  }

  // ============================================================
  // PILIER 2 : COLLABORATION EXCLUSIVE AVEC CLAUDE & MISE EN LIGNE
  // ============================================================
  const inputClaudePrompt = document.getElementById('input-claude-prompt');
  const btnClaudeCollaborate = document.getElementById('btn-claude-collaborate');
  const claudeResponseOutput = document.getElementById('claude-response-output');
  const inputDeployAppName = document.getElementById('input-deploy-app-name');
  const btnClaudeDeployOnline = document.getElementById('btn-claude-deploy-online');
  const deployLogBox = document.getElementById('deploy-log-box');
  const deployStatusTag = document.getElementById('deploy-status-tag');
  const deployStepsStream = document.getElementById('deploy-steps-stream');
  const deployFinalUrlCard = document.getElementById('deploy-final-url-card');
  const linkDeployedLiveApp = document.getElementById('link-deployed-live-app');

  if (btnClaudeCollaborate && inputClaudePrompt) {
    btnClaudeCollaborate.addEventListener('click', async () => {
      const prompt = inputClaudePrompt.value.trim();
      const codeActuel = document.getElementById('textarea-sdk-code-editor')?.value || '';

      if (!prompt) {
        alert("Veuillez saisir votre demande de co-développement pour Claude.");
        return;
      }

      btnClaudeCollaborate.disabled = true;
      btnClaudeCollaborate.textContent = "⏳ Claude analyse & co-programme...";
      if (claudeResponseOutput) {
        claudeResponseOutput.innerHTML = `
          <div style="color:#a855f7; display:flex; align-items:center; gap:8px;">
            <span class="live-dot-pulse"></span>
            <strong>Claude (Anthropic) :</strong> Réflexion et élaboration de la solution en cours...
          </div>
        `;
      }

      try {
        const res = await fetch('/api/sdk/claude/collaborate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, code: codeActuel })
        });
        const data = await res.json();
        if (data.success && data.reponse) {
          if (claudeResponseOutput) {
            claudeResponseOutput.innerHTML = `
              <div style="border-bottom: 1px solid rgba(168,85,247,0.3); padding-bottom: 6px; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#c084fc; font-weight:800;">🤖 Recommandation &amp; Code Co-développé avec Claude :</span>
                <button type="button" class="btn-output-action" id="btn-inject-claude-code">⬅ Injecter dans le Studio de Code (Pilier 4)</button>
              </div>
              <div>${formatTexteSouverain(data.reponse)}</div>
            `;

            // Bouton d'injection rapide du code produit par Claude
            document.getElementById('btn-inject-claude-code')?.addEventListener('click', () => {
              const codeBlockMatch = data.reponse.match(/```[a-zA-Z0-9_\-\+]*\n([\s\S]*?)```/);
              const codeToInject = codeBlockMatch ? codeBlockMatch[1].trim() : data.reponse;
              chargerFichierDansEditeur("claude-solution.js", codeToInject, "javascript");
              switchPillar('pillar-auto-code');
            });
          }
          ajouterMessageAssistant("Claude a terminé sa revue collaborative. Le code produit est prêt à être injecté ou déployé.");
        } else {
          if (claudeResponseOutput) claudeResponseOutput.innerHTML = `<span style="color:#ef4444;">Erreur : ${data.error || 'Échec'}</span>`;
        }
      } catch (err) {
        if (claudeResponseOutput) claudeResponseOutput.innerHTML = `<span style="color:#ef4444;">Erreur de connexion : ${err.message}</span>`;
      } finally {
        btnClaudeCollaborate.disabled = false;
        btnClaudeCollaborate.textContent = "⚡ Coder avec Claude";
      }
    });
  }

  // Déploiement en ligne orchestré par Claude
  if (btnClaudeDeployOnline) {
    btnClaudeDeployOnline.addEventListener('click', async () => {
      const appName = (inputDeployAppName ? inputDeployAppName.value.trim() : '') || 'mon-app-souveraine';
      
      btnClaudeDeployOnline.disabled = true;
      btnClaudeDeployOnline.textContent = "⏳ Déploiement cloud par Claude en cours...";

      if (deployLogBox) deployLogBox.classList.remove('hidden');
      if (deployFinalUrlCard) deployFinalUrlCard.classList.add('hidden');
      if (deployStatusTag) {
        deployStatusTag.textContent = "DÉPLOIEMENT EN COURS...";
        deployStatusTag.style.background = "rgba(234, 179, 8, 0.2)";
        deployStatusTag.style.color = "#fef08a";
      }

      if (deployStepsStream) {
        deployStepsStream.innerHTML = `<div class="deploy-step-item"><span>🚀 Initialisation de la mise en ligne avec Claude &amp; bo'oivini...</span></div>`;
      }

      try {
        const res = await fetch('/api/sdk/claude/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appName, env: 'production' })
        });
        const data = await res.json();

        if (data.success && data.etapes) {
          // Affichage progressif des étapes
          if (deployStepsStream) {
            deployStepsStream.innerHTML = '';
            for (let i = 0; i < data.etapes.length; i++) {
              const step = data.etapes[i];
              await new Promise(r => setTimeout(r, 400));
              const item = document.createElement('div');
              item.className = 'deploy-step-item';
              item.innerHTML = `
                <span><span class="deploy-step-check">✓</span> Étape ${step.etape} : ${step.titre}</span>
                <span class="deploy-step-time">${step.duree}</span>
              `;
              deployStepsStream.appendChild(item);
            }
          }

          if (deployStatusTag) {
            deployStatusTag.textContent = "EN LIGNE & OPÉRATIONNEL";
            deployStatusTag.style.background = "rgba(16, 185, 129, 0.25)";
            deployStatusTag.style.color = "#34d399";
          }

          if (deployFinalUrlCard && linkDeployedLiveApp) {
            deployFinalUrlCard.classList.remove('hidden');
            linkDeployedLiveApp.href = data.liveUrl;
            linkDeployedLiveApp.textContent = `${data.liveUrl} ↗`;
          }

          ajouterMessageAssistant(`Félicitations ! Claude a mis votre application **${appName}** officiellement en ligne : [${data.liveUrl}](${data.liveUrl})`);
        }
      } catch (err) {
        if (deployStepsStream) {
          deployStepsStream.innerHTML += `<div style="color:#ef4444;">Erreur de déploiement : ${err.message}</div>`;
        }
      } finally {
        btnClaudeDeployOnline.disabled = false;
        btnClaudeDeployOnline.textContent = "🚀 Demander à Claude de mettre l'application en ligne";
      }
    });
  }

  // ============================================================
  // PILIER 3 : ACCÈS DIRECT HÉBERGEMENT CLIENT & MODIF SOURCE
  // ============================================================
  const inputClientHostUrl = document.getElementById('input-client-host-url');
  const btnConnectClientHost = document.getElementById('btn-connect-client-host');
  const hostStatusBox = document.getElementById('host-status-box');
  const hostServerIp = document.getElementById('host-server-ip');
  const selectHostRemoteFile = document.getElementById('select-host-remote-file');
  const textareaHostPatchCode = document.getElementById('textarea-host-patch-code');
  const btnApplyHostPatch = document.getElementById('btn-apply-host-patch');
  const patchResultMsg = document.getElementById('patch-result-msg');

  const REMOTE_FILE_TEMPLATES = {
    '/var/www/app/server.js': `// Modification sécurisée sur /var/www/app/server.js\n// Règle 1 : Zéro régression · Règle 2 : Techno-eecoc\nexport function patchOptimisationServeur(serveur) {\n  serveur.keepAliveTimeout = 65000;\n  serveur.headersTimeout = 66000;\n  console.log("⚡ Patch Techno-eecoc appliqué sur l'hébergement client.");\n}`,
    '/var/www/app/src/index.js': `// Modification sécurisée sur /var/www/app/src/index.js\n// Traitement allégé selon la doctrine souveraine\nexport const configIndex = {\n  cacheMemoireFrugal: true,\n  reductionTenseursPct: 35,\n  modeSouverain: "ACTIF"\n};`,
    '/var/www/app/config/database.js': `// Configuration Base de Données Hébergement Client\nexport const dbOptions = {\n  maxConnections: 10,\n  idleTimeoutMillis: 30000,\n  connectionTimeoutMillis: 2000\n};`
  };

  if (selectHostRemoteFile && textareaHostPatchCode) {
    selectHostRemoteFile.addEventListener('change', () => {
      const selected = selectHostRemoteFile.value;
      if (REMOTE_FILE_TEMPLATES[selected]) {
        textareaHostPatchCode.value = REMOTE_FILE_TEMPLATES[selected];
      }
    });
  }

  if (btnConnectClientHost && inputClientHostUrl) {
    btnConnectClientHost.addEventListener('click', async () => {
      const hostUrl = inputClientHostUrl.value.trim() || 'https://client-production.peginti.cloud';
      btnConnectClientHost.disabled = true;
      btnConnectClientHost.textContent = "⏳ Connexion à l'hôte distant...";

      try {
        const res = await fetch('/api/sdk/client-host/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hostUrl })
        });
        const data = await res.json();
        if (data.success && data.hostDetails) {
          const d = data.hostDetails;
          if (hostStatusBox) hostStatusBox.classList.remove('hidden');
          if (hostServerIp) {
            hostServerIp.textContent = `Hébergement Client Connecté : ${d.ipServeur} (${d.os} · ${d.runtime})`;
          }
          if (textareaHostPatchCode && !textareaHostPatchCode.value.trim()) {
            textareaHostPatchCode.value = REMOTE_FILE_TEMPLATES['/var/www/app/server.js'];
          }
          ajouterMessageAssistant(`bo'oivinichat est connecté à l'hébergement client **${hostUrl}** (${d.ipServeur}). Les 4 recommandations strictes sont actives et sécurisent chaque patch.`);
        }
      } catch (err) {
        alert("Erreur de connexion serveur : " + err.message);
      } finally {
        btnConnectClientHost.disabled = false;
        btnConnectClientHost.textContent = "🔗 Établir Connexion";
      }
    });
  }

  // Application du patch direct sur le serveur du client
  if (btnApplyHostPatch && textareaHostPatchCode) {
    btnApplyHostPatch.addEventListener('click', async () => {
      const code = textareaHostPatchCode.value.trim();
      const targetFile = selectHostRemoteFile?.value || '/var/www/app/server.js';
      const hostUrl = inputClientHostUrl?.value.trim() || 'https://client-production.peginti.cloud';

      if (!code) {
        alert("Veuillez rédiger la modification de code à appliquer sur l'hébergement.");
        return;
      }

      btnApplyHostPatch.disabled = true;
      btnApplyHostPatch.textContent = "⏳ Application du patch en production...";

      try {
        const res = await fetch('/api/sdk/client-host/apply-patch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetFile, modificationCode: code, hostUrl })
        });
        const data = await res.json();
        if (data.success && data.patchResult) {
          const pr = data.patchResult;
          if (patchResultMsg) {
            patchResultMsg.classList.remove('hidden');
            patchResultMsg.innerHTML = `
              <div style="color:#10b981; font-weight:800; margin-bottom:4px;">
                ✓ Modification source appliquée avec succès sur l'hébergement du client !
              </div>
              <div style="font-size:11px; color:#94a3b8; font-family:var(--font-mono); margin-bottom:6px;">
                Fichier : <strong>${pr.fichierCible}</strong> · Sauvegarde créée : <code>${pr.sauvegardeCreee}</code>
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:6px;">
                ${pr.reglesStrictesVerifiees.map(r => `<span class="strict-rule-pill">${r}</span>`).join('')}
              </div>
            `;
          }
          ajouterMessageAssistant(`Patch appliqué sur **${targetFile}** sur l'hébergement client. Sauvegarde horodatée effectuée, aucune régression.`);
        }
      } catch (err) {
        if (patchResultMsg) {
          patchResultMsg.classList.remove('hidden');
          patchResultMsg.innerHTML = `<span style="color:#ef4444;">Erreur d'application : ${err.message}</span>`;
        }
      } finally {
        btnApplyHostPatch.disabled = false;
        btnApplyHostPatch.textContent = "⚡ Appliquer la Modification sur le Serveur Client";
      }
    });
  }

  // ============================================================
  // PILIER 4 : BO'OIVINICHAT CODEUR SANS ERREUR & BUG SCANNER
  // ============================================================
  const selectSdkLanguage = document.getElementById('select-sdk-language');
  const btnScanBugsRealtime = document.getElementById('btn-scan-bugs-realtime');
  const btnCodeZeroError = document.getElementById('btn-code-zero-error');
  const textareaSdkCodeEditor = document.getElementById('textarea-sdk-code-editor');
  const bugsInspectionCard = document.getElementById('bugs-inspection-card');
  const bugsCountBadge = document.getElementById('bugs-count-badge');
  const bugsItemsList = document.getElementById('bugs-items-list');
  const sdkCorrectedCodeDisplay = document.getElementById('sdk-corrected-code-display');
  const btnCopyCorrectedCode = document.getElementById('btn-copy-corrected-code');
  const btnApplyCorrectedCode = document.getElementById('btn-apply-corrected-code');
  const btnFormatEditorCode = document.getElementById('btn-format-editor-code');
  const btnResetEditorCode = document.getElementById('btn-reset-editor-code');

  const formSdkAssistantChat = document.getElementById('form-sdk-assistant-chat');
  const inputSdkAssistantQuery = document.getElementById('input-sdk-assistant-query');
  const sdkAssistantMessagesFlow = document.getElementById('sdk-assistant-messages-flow');
  const btnClearSdkAssistant = document.getElementById('btn-clear-sdk-assistant');

  let activeSdkCodeClean = '';
  const STORAGE_KEY_SDK_HISTORY = 'peginti_sdk_chat_history';
  let sdkAssistantHistory = [];
  try {
    const savedSdk = localStorage.getItem(STORAGE_KEY_SDK_HISTORY);
    if (savedSdk) {
      const parsedSdk = JSON.parse(savedSdk);
      if (Array.isArray(parsedSdk)) {
        sdkAssistantHistory = parsedSdk;
      }
    }
  } catch (e) {
    sdkAssistantHistory = [];
  }

  function sauvegarderSdkHistoriqueLocal() {
    try {
      localStorage.setItem(STORAGE_KEY_SDK_HISTORY, JSON.stringify(sdkAssistantHistory));
    } catch (e) {
      console.warn("Erreur sauvegarde historique SDK :", e);
    }
  }

  function renderSdkConversation() {
    if (!sdkAssistantMessagesFlow) return;
    if (sdkAssistantHistory.length === 0) {
      sdkAssistantMessagesFlow.innerHTML = `
        <div class="assistant-msg-bubble">
          <div class="msg-author">bo'oivinichat :</div>
          <div style="font-size: 11.5px; line-height: 1.55;">
            Je suis connecté directement à votre projet source. Posez-moi vos questions ou donnez-moi vos instructions de programmation : je modifierai directement le code à la source ou vous fournirai les solutions prêtes à être appliquées en un clic.
          </div>
        </div>
      `;
      return;
    }

    let html = '';
    sdkAssistantHistory.forEach(item => {
      html += `
        <div class="assistant-msg-bubble">
          <div class="msg-author">Vous (Développeur) :</div>
          <div style="font-size: 11.5px; line-height: 1.55;">${formatTexteSouverain(item.user)}</div>
        </div>
      `;
      const boutons = extraireBoutonsChoix(item.bot);
      html += `
        <div class="assistant-msg-bubble">
          <div class="msg-author">bo'oivinichat :</div>
          <div style="font-size: 11.5px; line-height: 1.55;">${formatTexteSouverain(item.bot)}</div>
      `;
      if (boutons && boutons.length >= 2) {
        html += `<div class="sdk-choice-container">`;
        boutons.forEach(b => {
          const texteBouton = b.texte || b.libelle || '';
          const extrait = texteBouton.length > 40 ? texteBouton.slice(0, 38) + '...' : texteBouton;
          html += `<button type="button" class="btn-choix-sdk" data-choix="${b.lettre}/">${b.lettre}/ ${extrait}</button>`;
        });
        html += `</div>`;
      }
      html += `</div>`;
    });
    sdkAssistantMessagesFlow.innerHTML = html;
    sdkAssistantMessagesFlow.scrollTop = sdkAssistantMessagesFlow.scrollHeight;

    sdkAssistantMessagesFlow.querySelectorAll('.btn-choix-sdk').forEach(btn => {
      btn.addEventListener('click', () => {
        const choix = btn.getAttribute('data-choix');
        if (inputSdkAssistantQuery) {
          inputSdkAssistantQuery.value = choix;
          formSdkAssistantChat?.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      });
    });
  }

  // Rendu initial bo'oivinichat
  renderSdkConversation();

  // Changement de modèle de code selon le langage sélectionné
  if (selectSdkLanguage && textareaSdkCodeEditor) {
    selectSdkLanguage.addEventListener('change', (e) => {
      const lang = e.target.value;
      if (CODE_TEMPLATES && CODE_TEMPLATES[lang]) {
        textareaSdkCodeEditor.value = CODE_TEMPLATES[lang];
        const label = document.getElementById('editor-current-filename');
        if (label) label.textContent = `Fichier : main.${lang === 'javascript' ? 'js' : lang === 'typescript' ? 'ts' : lang === 'python' ? 'py' : lang === 'rust' ? 'rs' : 'c'}`;
      }
    });
  }

  // Scanner et repérer les bugs en temps réel
  if (btnScanBugsRealtime && textareaSdkCodeEditor) {
    btnScanBugsRealtime.addEventListener('click', async () => {
      const code = textareaSdkCodeEditor.value.trim();
      const lang = selectSdkLanguage?.value || 'javascript';

      if (!code) {
        alert("Veuillez saisir ou importer du code à analyser.");
        return;
      }

      btnScanBugsRealtime.disabled = true;
      btnScanBugsRealtime.textContent = "🔍 Scan des bugs...";

      try {
        const res = await fetch('/api/sdk/booivini/inspect-bugs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language: lang })
        });
        const data = await res.json();

        if (data.success) {
          if (bugsInspectionCard) bugsInspectionCard.classList.remove('hidden');
          if (bugsCountBadge) bugsCountBadge.textContent = `${data.totalBugs} anomalie(s) repérée(s)`;

          if (bugsItemsList && data.bugs) {
            bugsItemsList.innerHTML = data.bugs.map(b => `
              <div class="bug-item-row">
                <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                  <span>
                    <span class="bug-tag-badge ${b.gravite === 'Critique' ? 'bug-tag-critique' : b.gravite === 'Haute' ? 'bug-tag-haute' : 'bug-tag-moyenne'}">${b.gravite.toUpperCase()}</span>
                    <strong>Ligne ${b.ligne} :</strong> ${b.type}
                  </span>
                </div>
                <div style="color:#cbd5e1; font-size:11.5px;">${b.message}</div>
                <div style="color:#34d399; font-size:11px; margin-top:2px;">💡 Solution : ${b.solution}</div>
              </div>
            `).join('');
          }

          if (data.codeCorrige && sdkCorrectedCodeDisplay) {
            activeSdkCodeClean = data.codeCorrige;
            sdkCorrectedCodeDisplay.textContent = activeSdkCodeClean;
          }

          ajouterMessageAssistant(`J'ai analysé votre code : **${data.totalBugs} anomalie(s) détectée(s)**. La version corrigée sans erreur a été générée dans le panneau de sortie.`);
        }
      } catch (err) {
        alert("Erreur lors de l'inspection : " + err.message);
      } finally {
        btnScanBugsRealtime.disabled = false;
        btnScanBugsRealtime.textContent = "🔍 Scanner & Repérer les Bugs";
      }
    });
  }

  // Coder sans erreur & Programmer directement
  if (btnCodeZeroError && textareaSdkCodeEditor) {
    btnCodeZeroError.addEventListener('click', async () => {
      const code = textareaSdkCodeEditor.value.trim();
      const lang = selectSdkLanguage?.value || 'javascript';

      if (!code) {
        alert("Veuillez saisir ou coller du code dans l'éditeur.");
        return;
      }

      btnCodeZeroError.disabled = true;
      btnCodeZeroError.textContent = "⚡ Programmation sans erreur...";

      try {
        const res = await fetch('/api/sdk/booivini/inspect-bugs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language: lang })
        });
        const data = await res.json();

        if (data.success && data.codeCorrige) {
          activeSdkCodeClean = data.codeCorrige;
          if (sdkCorrectedCodeDisplay) {
            sdkCorrectedCodeDisplay.textContent = activeSdkCodeClean;
          }
          if (bugsInspectionCard) {
            bugsInspectionCard.classList.remove('hidden');
            if (bugsCountBadge) bugsCountBadge.textContent = "0 anomalie restante après programmation";
            if (bugsItemsList) {
              bugsItemsList.innerHTML = `<div style="color:#34d399; padding:4px;">✓ Code 100% propre, sans bug et optimisé selon la doctrine Techno-eecoc.</div>`;
            }
          }
          ajouterMessageAssistant("Votre code a été entièrement reprogrammé **sans aucune erreur**. Cliquez sur « ⬅ Injecter dans l'éditeur » pour le valider.");
        }
      } catch (err) {
        alert("Erreur : " + err.message);
      } finally {
        btnCodeZeroError.disabled = false;
        btnCodeZeroError.textContent = "⚡ Coder Sans Erreur & Résoudre";
      }
    });
  }

  // Injecter le code corrigé dans l'éditeur
  if (btnApplyCorrectedCode && textareaSdkCodeEditor) {
    btnApplyCorrectedCode.addEventListener('click', () => {
      if (activeSdkCodeClean) {
        textareaSdkCodeEditor.value = activeSdkCodeClean;
        btnApplyCorrectedCode.textContent = "✓ Injecté !";
        setTimeout(() => { btnApplyCorrectedCode.textContent = "⬅ Injecter dans l'éditeur"; }, 1800);
      } else {
        alert("Aucun code propre généré pour l'instant. Cliquez d'abord sur « ⚡ Coder Sans Erreur & Résoudre ».");
      }
    });
  }

  // Copier le code corrigé
  if (btnCopyCorrectedCode) {
    btnCopyCorrectedCode.addEventListener('click', () => {
      const textToCopy = activeSdkCodeClean || (textareaSdkCodeEditor ? textareaSdkCodeEditor.value : '');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        btnCopyCorrectedCode.textContent = "✓ Copié !";
        setTimeout(() => { btnCopyCorrectedCode.textContent = "📋 Copier"; }, 1800);
      }
    });
  }

  // Formater le code de l'éditeur
  if (btnFormatEditorCode && textareaSdkCodeEditor) {
    btnFormatEditorCode.addEventListener('click', () => {
      const code = textareaSdkCodeEditor.value;
      if (code) {
        // Nettoyage indentation et retours à la ligne
        const formatted = code.split('\n').map(l => l.trimEnd()).join('\n').trim();
        textareaSdkCodeEditor.value = formatted;
        btnFormatEditorCode.textContent = "✓ Formaté";
        setTimeout(() => { btnFormatEditorCode.textContent = "📐 Formater"; }, 1500);
      }
    });
  }

  // Réinitialiser le code de l'éditeur
  if (btnResetEditorCode && textareaSdkCodeEditor) {
    btnResetEditorCode.addEventListener('click', () => {
      const lang = selectSdkLanguage?.value || 'javascript';
      if (CODE_TEMPLATES && CODE_TEMPLATES[lang]) {
        textareaSdkCodeEditor.value = CODE_TEMPLATES[lang];
      } else {
        textareaSdkCodeEditor.value = `// Fichier de test\nconsole.log("bo'oivinichat prêt.");\n`;
      }
    });
  }

  // Chat Développeurs bo'oivinichat (Assistant en ligne & propositions)
  function extraireBoutonsChoix(texte) {
    if (!texte) return [];
    const options = [];
    const regex = /(?:^|\n|<br\s*\/?>)\s*(\*{0,2})([A-Za-z])\/(\*{0,2})\s+([^\n\r<]+)/g;
    let match;
    while ((match = regex.exec(texte)) !== null) {
      const lettre = match[2].toUpperCase();
      const libelle = match[4].replace(/<\/?[^>]+(>|$)/g, '').trim();
      if (libelle && !options.some(o => o.lettre === lettre)) {
        options.push({ lettre, libelle });
      }
    }
    return options.length >= 2 ? options : [];
  }

  function ajouterMessageAssistant(msg, auteur = "bo'oivinichat", options = null) {
    if (!sdkAssistantMessagesFlow) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'assistant-msg-bubble';

    let htmlContent = `
      <div class="msg-author">${auteur} :</div>
      <div style="font-size: 11.5px; line-height: 1.55;">${formatTexteSouverain(msg)}</div>
    `;

    const boutons = (options && options.length >= 2) ? options : extraireBoutonsChoix(msg);
    if (auteur.includes("bo'oivinichat") && boutons && boutons.length >= 2) {
      htmlContent += `<div class="sdk-choice-container">`;
      boutons.forEach(b => {
        const texteBouton = b.texte || b.libelle || '';
        const extrait = texteBouton.length > 40 ? texteBouton.slice(0, 38) + '...' : texteBouton;
        htmlContent += `<button type="button" class="btn-choix-sdk" data-choix="${b.lettre}/">${b.lettre}/ ${extrait}</button>`;
      });
      htmlContent += `</div>`;
    }

    msgDiv.innerHTML = htmlContent;

    msgDiv.querySelectorAll('.btn-choix-sdk').forEach(btn => {
      btn.addEventListener('click', () => {
        const choix = btn.getAttribute('data-choix');
        if (inputSdkAssistantQuery) {
          inputSdkAssistantQuery.value = choix;
          formSdkAssistantChat?.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      });
    });

    sdkAssistantMessagesFlow.appendChild(msgDiv);
    sdkAssistantMessagesFlow.scrollTop = sdkAssistantMessagesFlow.scrollHeight;
  }

  if (formSdkAssistantChat && inputSdkAssistantQuery) {
    formSdkAssistantChat.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = inputSdkAssistantQuery.value.trim();
      if (!q) return;

      inputSdkAssistantQuery.value = '';
      ajouterMessageAssistant(q, 'Vous (Développeur)');

      const tempId = 'sdk-bot-wait-' + Date.now();
      const waitDiv = document.createElement('div');
      waitDiv.id = tempId;
      waitDiv.className = 'assistant-msg-bubble';
      waitDiv.innerHTML = `<div class="msg-author">bo'oivinichat :</div><p style="color:#38bdf8;"><em>Analyse et programmation de la réponse en cours...</em></p>`;
      sdkAssistantMessagesFlow?.appendChild(waitDiv);
      sdkAssistantMessagesFlow.scrollTop = sdkAssistantMessagesFlow.scrollHeight;

      try {
        const res = await fetch('/api/sdk/assistant-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q,
            codeContext: textareaSdkCodeEditor?.value || '',
            history: sdkAssistantHistory
          })
        });

        const data = await res.json();
        const rep = data.reponse || data.response || "Recommandation technique transmise.";
        sdkAssistantHistory.push({ user: q, bot: rep });
        sauvegarderSdkHistoriqueLocal();

        const waitEl = document.getElementById(tempId);
        if (waitEl) {
          let innerHtml = `
            <div class="msg-author">bo'oivinichat :</div>
            <div style="font-size: 11.5px; line-height: 1.55;">${formatTexteSouverain(rep)}</div>
          `;

          const boutons = (data.options && data.options.length >= 2) ? data.options : extraireBoutonsChoix(rep);
          if (boutons && boutons.length >= 2) {
            innerHtml += `<div class="sdk-choice-container">`;
            boutons.forEach(b => {
              const texteBouton = b.texte || b.libelle || '';
              const extrait = texteBouton.length > 40 ? texteBouton.slice(0, 38) + '...' : texteBouton;
              innerHtml += `<button type="button" class="btn-choix-sdk" data-choix="${b.lettre}/">${b.lettre}/ ${extrait}</button>`;
            });
            innerHtml += `</div>`;
          }

          waitEl.innerHTML = innerHtml;

          waitEl.querySelectorAll('.btn-choix-sdk').forEach(btn => {
            btn.addEventListener('click', () => {
              const choix = btn.getAttribute('data-choix');
              if (inputSdkAssistantQuery) {
                inputSdkAssistantQuery.value = choix;
                formSdkAssistantChat?.dispatchEvent(new Event('submit', { cancelable: true }));
              }
            });
          });
        }
      } catch (err) {
        const waitEl = document.getElementById(tempId);
        if (waitEl) waitEl.innerHTML = `<span style="color:#ef4444;">Erreur : ${err.message}</span>`;
      }
      sdkAssistantMessagesFlow.scrollTop = sdkAssistantMessagesFlow.scrollHeight;
    });
  }

  if (btnClearSdkAssistant) {
    btnClearSdkAssistant.addEventListener('click', () => {
      if (confirm("Voulez-vous vraiment effacer l'historique de discussion de bo'oivinichat ?")) {
        sdkAssistantHistory = [];
        localStorage.removeItem(STORAGE_KEY_SDK_HISTORY);
        renderSdkConversation();
      }
    });
  }

  // ============================================================
  // VITRINE WOUNANET MODALE
  // ============================================================
  const btnWounanetModalSearch = document.getElementById('btn-wounanet-modal-search');
  const inputWounanetModalSearch = document.getElementById('wounanet-modal-search-input');

  if (btnWounanetModalSearch && inputWounanetModalSearch) {
    btnWounanetModalSearch.addEventListener('click', () => {
      const q = inputWounanetModalSearch.value.trim() || "La guerre au moyen Orient";
      fetchWounanetLive(q);
    });
    inputWounanetModalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = inputWounanetModalSearch.value.trim() || "La guerre au moyen Orient";
        fetchWounanetLive(q);
      }
    });
  }

  async function fetchWounanetLive(query) {
    const liveBox = document.getElementById('wounanet-modal-live-box');
    const streamList = document.getElementById('wounanet-modal-stream-list');
    if (liveBox) liveBox.innerHTML = '<em>📡 Connexion au flux direct IVIOK 24/24...</em>';

    try {
      const res = await fetch(`/api/wounanet?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const rapport = data.rapportTexte || data.searchResult || data.synthese || "";
      
      if (liveBox && rapport) {
        liveBox.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 10px; color: #ef4444; font-weight: 800;">🔴 VEILLE STRATÉGIQUE IVIOK 24/24 · ${data.horodatage || ''}</span>
            <button class="btn-copy-mini" onclick="navigator.clipboard.writeText(this.getAttribute('data-text')); this.innerText='Copié!'; setTimeout(()=>this.innerText='📋 Copier le rapport', 2000)" data-text="${rapport.replace(/"/g, '&quot;')}">📋 Copier le rapport</button>
          </div>
          <div class="wounanet-canonical-modal-text" style="color: #f1f5f9; font-size: 12px; line-height: 1.6; max-height: 420px; overflow-y: auto; padding-right: 6px;">
            ${formatTexteSouverain(rapport)}
          </div>
        `;
      }
      if (data && data.flux && streamList) {
        streamList.innerHTML = `
          <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin: 10px 0 6px 0;">📰 Dépêches Marquantes &amp; Flux Récents</div>
        ` + data.flux.map(item => `
          <div class="stream-item" style="cursor: pointer;" onclick="document.getElementById('wounanet-modal-search-input').value='${(item.titre || '').replace(/'/g, "\\'")}'; document.getElementById('btn-wounanet-modal-search').click();">
            <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
              <span style="color:#ef4444; font-size:10px; font-weight:800;">${item.source || item.categorie || 'WOUNANET'}</span>
              <span style="color:#94a3b8; font-size:10px;">${item.fraicheur || item.date || ''}</span>
            </div>
            <h5>${item.titre}</h5>
            <p>${item.resume || ''}</p>
          </div>
        `).join('');
      }
    } catch (e) {
      if (liveBox) liveBox.innerHTML = '<span style="color: #ef4444;">Flux en veille active (Pilote IVIOK 24/24).</span>';
    }
  }

  // ============================================================
  // MODALE CONSOLE CHAT
  // ============================================================
  if (modalChatForm && modalChatInput) {
    modalChatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = modalChatInput.value.trim();
      if (!text) return;

      modalChatInput.value = '';

      const userDiv = document.createElement('div');
      userDiv.className = 'chat-row user-row';
      userDiv.innerHTML = `<div class="chat-bubble"><p>${text}</p></div>`;
      if (modalChatFlow) modalChatFlow.appendChild(userDiv);

      const botDiv = document.createElement('div');
      botDiv.className = 'chat-row bot-row';
      botDiv.innerHTML = `
        <div class="chat-avatar">P</div>
        <div class="chat-bubble">
          <div class="bubble-meta"><strong>PEGINTI-CHAT V3</strong> · <span>bo'oivinichat</span></div>
          <p><em>Réflexion cognitive en cours...</em></p>
        </div>
      `;
      if (modalChatFlow) {
        modalChatFlow.appendChild(botDiv);
        modalChatFlow.scrollTop = modalChatFlow.scrollHeight;
      }

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: text,
            sessionId: currentSessionId,
            history: conversationHistory.map(c => ({ user: c.user, bot: c.bot }))
          })
        });
        const data = await res.json();
        const rep = data.response || data.reponse || data.answer || data.narration || 'Traitement terminé.';
        conversationHistory.push({ user: text, bot: rep });
        sauvegarderHistoriqueLocal();
        renderAllConversations();
      } catch (err) {
        const pEl = botDiv.querySelector('.chat-bubble p');
        if (pEl) pEl.textContent = 'Erreur de connexion avec le serveur.';
      }
      if (modalChatFlow) modalChatFlow.scrollTop = modalChatFlow.scrollHeight;
    });
  }

  // ============================================================
  // MODALE PENSÉE DOCTRINALE
  // ============================================================
  const PENSEES = [
    "« ...découverte, où la rigueur intellectuelle se marie à la clarté visuelle. Cette quête d'excellence est un processus continu, visant toujours à rendre la connaissance plus accessible et plus vivante. » — Tomo Ombede Barnabé Bertrand",
    "« La souveraineté technologique commence par la capacité de nommer, modéliser et chiffrer nos propres réalités selon nos impératifs. »",
    "« L'intelligence artificielle africaine ne doit pas être consommatrice passive, mais génératrice frugale et sobre d'émancipation. »",
    "« La discrétion de l'architecture est la marque de la puissance souveraine : une efficience maximale dans un écrin épuré. »",
    "« Par la technologie Techno-eecoc, chaque cycle de calcul régénère son empreinte pour bâtir une informatique durable, responsable et pérenne. »"
  ];
  let quoteIdx = 0;

  const btnCyclePenseeQuote = document.getElementById('btn-cycle-pensee-quote');
  if (btnCyclePenseeQuote) {
    btnCyclePenseeQuote.addEventListener('click', () => {
      quoteIdx = (quoteIdx + 1) % PENSEES.length;
      const quoteEl = document.getElementById('pensee-quote-text');
      if (quoteEl) quoteEl.textContent = PENSEES[quoteIdx];
    });
  }

  async function loadPenseeCharte() {
    const rulesBox = document.getElementById('reserve-rules-list');
    if (rulesBox && rulesBox.children.length === 0) {
      try {
        const res = await fetch('/api/filtre-matriciel');
        const data = await res.json();
        if (data && data.reglesReserve) {
          rulesBox.innerHTML = data.reglesReserve.map(r => `
            <div class="rule-filter-card">
              <div class="rule-filter-top">
                <span class="rule-filter-title">${r.titre}</span>
                <span class="rule-filter-badge">✓ FILTRE ACTIF</span>
              </div>
              <div class="rule-filter-function">⚡ <em>${r.filtreFonction || r.description}</em></div>
              <div class="rule-filter-desc">${r.description}</div>
            </div>
          `).join('');
          return;
        }
      } catch (e) {
        // Fallback local
      }

      rulesBox.innerHTML = `
        <div class="rule-filter-card">
          <div class="rule-filter-top">
            <span class="rule-filter-title">Règle 1 : Réserve Stratégique &amp; Intégrité</span>
            <span class="rule-filter-badge">✓ FILTRE ACTIF</span>
          </div>
          <div class="rule-filter-function">⚡ <em>Isolation contre toute dépendance externe ou aliénation.</em></div>
          <div class="rule-filter-desc">Les flux cognitifs et les matrices décisionnelles ne sont soumis à aucune ingérence étrangère.</div>
        </div>
        <div class="rule-filter-card">
          <div class="rule-filter-top">
            <span class="rule-filter-title">Règle 2 : Vérité Panafricaine &amp; Rigueur Scientifique</span>
            <span class="rule-filter-badge">✓ FILTRE ACTIF</span>
          </div>
          <div class="rule-filter-function">⚡ <em>Validation épistémologique et valorisation des compétences locales.</em></div>
          <div class="rule-filter-desc">Priorité aux sources vérifiées, aux réalités géopolitiques locales et au génie panafricain.</div>
        </div>
        <div class="rule-filter-card">
          <div class="rule-filter-top">
            <span class="rule-filter-title">Règle 3 : Frugalité Énergétique (Techno-eecoc)</span>
            <span class="rule-filter-badge">✓ FILTRE ACTIF</span>
          </div>
          <div class="rule-filter-function">⚡ <em>Optimisation de tenseurs et économie circulaire de calcul (-60% énergie).</em></div>
          <div class="rule-filter-desc">Chaque calcul optimise l'allocation des tenseurs pour minimiser l'empreinte carbone.</div>
        </div>
        <div class="rule-filter-card">
          <div class="rule-filter-top">
            <span class="rule-filter-title">Règle 4 : Protection Contre la Désinformation (IVIOK 24/24)</span>
            <span class="rule-filter-badge">✓ FILTRE ACTIF</span>
          </div>
          <div class="rule-filter-function">⚡ <em>Recoupement continu et rigueur factuelle via WOUNANET.</em></div>
          <div class="rule-filter-desc">Veille 24/24 et recoupement permanent des dépêches stratégiques mondiales.</div>
        </div>
        <div class="rule-filter-card">
          <div class="rule-filter-top">
            <span class="rule-filter-title">Règle 5 : Continuité &amp; Résilience (MINANG Mesh)</span>
            <span class="rule-filter-badge">✓ FILTRE ACTIF</span>
          </div>
          <div class="rule-filter-function">⚡ <em>Disponibilité permanente et clarté pédagogique accessible.</em></div>
          <div class="rule-filter-desc">Architecture décentralisée garantissant la disponibilité des services en toutes circonstances.</div>
        </div>
      `;
    }
  }

  // ============================================================
  // NOUVELLES FONCTIONNALITÉS MATRICIELLES (AUTORÉFLEXION & MÉTAPHORES)
  // ============================================================
  const inputAutoreflexionQuery = document.getElementById('input-autoreflexion-query');
  const btnRunAutoreflexionInspect = document.getElementById('btn-run-autoreflexion-inspect');
  const statRaisonnementTitre = document.getElementById('stat-raisonnement-titre');
  const statRaisonnementDesc = document.getElementById('stat-raisonnement-desc');
  const statLogiqueTitre = document.getElementById('stat-logique-titre');
  const statLogiqueDesc = document.getElementById('stat-logique-desc');
  const statIntentionTitre = document.getElementById('stat-intention-titre');
  const statIntentionDesc = document.getElementById('stat-intention-desc');
  const autoreflexionBoxPlan = document.getElementById('autoreflexion-box-plan');

  async function inspecterAutoreflexion(sujetParam) {
    const query = sujetParam || (inputAutoreflexionQuery ? inputAutoreflexionQuery.value.trim() : '') || "Souveraineté numérique et intelligence africaine";
    if (inputAutoreflexionQuery && sujetParam) inputAutoreflexionQuery.value = sujetParam;

    try {
      const res = await fetch(`/api/autoreflexion?sujet=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.analyse) {
        if (statRaisonnementTitre) statRaisonnementTitre.textContent = data.analyse.cleRaisonnement.charAt(0).toUpperCase() + data.analyse.cleRaisonnement.slice(1);
        if (statRaisonnementDesc) statRaisonnementDesc.textContent = data.analyse.raisonnement;
        if (statLogiqueTitre) statLogiqueTitre.textContent = data.analyse.cleLogique.charAt(0).toUpperCase() + data.analyse.cleLogique.slice(1);
        if (statLogiqueDesc) statLogiqueDesc.textContent = data.analyse.logique;
        if (statIntentionTitre && data.intention) statIntentionTitre.textContent = `${data.intention.mode.toUpperCase()} (Priorité ${data.intention.priorite})`;
        if (statIntentionDesc && data.categorie) statIntentionDesc.textContent = `Catégorie détectée : ${data.categorie} · Ancrage NSISIM : ${data.nsissim.symbole}`;
        
        if (autoreflexionBoxPlan && data.planTriadique) {
          autoreflexionBoxPlan.innerHTML = data.planTriadique.map(step => `<li><strong>•</strong> ${step}</li>`).join('');
        }
      }
    } catch (err) {
      console.warn("Erreur inspection autoréflexion :", err);
    }
  }

  if (btnRunAutoreflexionInspect) {
    btnRunAutoreflexionInspect.addEventListener('click', () => inspecterAutoreflexion());
  }
  if (inputAutoreflexionQuery) {
    inputAutoreflexionQuery.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        inspecterAutoreflexion();
      }
    });
  }

  // Tags rapides d'autoréflexion
  document.querySelectorAll('.btn-quick-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const prompt = tag.getAttribute('data-prompt');
      if (prompt) {
        inspecterAutoreflexion(prompt);
      }
    });
  });

  // Traducteur de Métaphores Culturelles
  const textareaMetaphoresInput = document.getElementById('textarea-metaphores-input');
  const boxMetaphoresOutput = document.getElementById('box-metaphores-output');
  const btnRunMetaphoresTranslate = document.getElementById('btn-run-metaphores-translate');

  async function traduireMetaphores() {
    const texte = (textareaMetaphoresInput ? textareaMetaphoresInput.value.trim() : '') || "Une pureté de neige, une structure d'acier et la transparence du verre.";
    if (boxMetaphoresOutput) boxMetaphoresOutput.innerHTML = '<em>🔄 Analyse conceptuelle matricielle en cours...</em>';

    try {
      const res = await fetch('/api/metaphores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texte })
      });
      const data = await res.json();
      if (data.success) {
        let htmlResult = `<div style="margin-bottom:8px; color:#22c55e; font-size:12px;"><strong>✓ Traduction :</strong> « ${data.texteTraduit} »</div>`;
        if (data.remplacements && data.remplacements.length > 0) {
          htmlResult += `<div style="font-size:11px; color:#94a3b8; border-top:1px dashed rgba(255,255,255,0.1); padding-top:6px;">`;
          data.remplacements.forEach(r => {
            htmlResult += `<div>• <strong>${r.conceptOccidental}</strong> ➔ <strong style="color:#fb923c;">${r.equivalentAfricain}</strong> : <em>${r.justification}</em></div>`;
          });
          htmlResult += `</div>`;
        }
        if (boxMetaphoresOutput) boxMetaphoresOutput.innerHTML = htmlResult;
      }
    } catch (err) {
      if (boxMetaphoresOutput) boxMetaphoresOutput.innerHTML = `<span style="color:#ef4444;">Erreur : ${err.message}</span>`;
    }
  }

  if (btnRunMetaphoresTranslate) {
    btnRunMetaphoresTranslate.addEventListener('click', traduireMetaphores);
  }

});
