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

  // Ouverture des modales par boutons d'action
  if (btnOpenPremiumModal) btnOpenPremiumModal.addEventListener('click', () => openModal(modalPremium));
  if (btnHomeExplorePremium) btnHomeExplorePremium.addEventListener('click', () => openModal(modalPremium));
  if (btnOpenWounanetVitrine) btnOpenWounanetVitrine.addEventListener('click', () => {
    openModal(modalWounanet);
    fetchWounanetLive(inputWounanetModalSearch?.value || "La guerre au moyen Orient");
  });
  if (btnOpenChatModal) btnOpenChatModal.addEventListener('click', () => openModal(modalConsole));

  // Clics sur le Dock Flottant Discret
  if (dockBtnPensee) dockBtnPensee.addEventListener('click', () => {
    openModal(modalPensee);
    loadPenseeCharte();
  });
  if (dockBtnWounanet) dockBtnWounanet.addEventListener('click', () => {
    openModal(modalWounanet);
    fetchWounanetLive(inputWounanetModalSearch?.value || "La guerre au moyen Orient");
  });
  if (dockBtnChat) dockBtnChat.addEventListener('click', () => openModal(modalConsole));
  if (dockBtnMomo) dockBtnMomo.addEventListener('click', () => {
    openModal(modalPremium);
    if (tabBtnBoutique) tabBtnBoutique.click();
    if (checkoutTunnelBox) checkoutTunnelBox.scrollIntoView({ behavior: 'smooth' });
  });
  if (dockBtnAutoreflexion) dockBtnAutoreflexion.addEventListener('click', () => {
    openModal(modalAutoreflexion);
    inspecterAutoreflexion();
  });
  if (dockBtnMetaphores) dockBtnMetaphores.addEventListener('click', () => {
    openModal(modalMetaphores);
    traduireMetaphores();
  });

  // Refresh
  if (btnNavRefresh) {
    btnNavRefresh.addEventListener('click', () => {
      window.location.reload();
    });
  }

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
    if (conversationHistory.length === 0) {
      chatHomeResultBox.innerHTML = `
        <div class="chat-welcome-notice" style="color: #cbd5e1; font-size: 12px; line-height: 1.6;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
            <span style="font-size:14px;">🧠</span>
            <strong style="color:#38bdf8;">PEGINTI IA :</strong>
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

  // Rendu initial dès le chargement de la page (restaure le fil)
  renderHomeConversation();

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
        renderHomeConversation();
      } catch (err) {
        const loadingEl = document.getElementById(tempId);
        if (loadingEl) loadingEl.innerHTML = `<span style="color: #f87171;">Erreur de communication avec le moteur souverain.</span>`;
      }
    });
  }

  if (btnHomeResetChat) {
    btnHomeResetChat.addEventListener('click', () => {
      if (confirm("Voulez-vous vraiment réinitialiser tout l'historique de cette discussion ?")) {
        conversationHistory = [];
        localStorage.removeItem(STORAGE_KEY_HISTORY);
        currentSessionId = 'ses-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem(STORAGE_KEY_SESSION, currentSessionId);
        renderHomeConversation();
      }
    });
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
  // STUDIO SDK PEGINTI PRO (IMPORT GITHUB/GITLAB, API, AUTO-CORRECTION & BO'OIVINI)
  // ============================================================
  const inputSdkRepoUrl = document.getElementById('input-sdk-repo-url');
  const btnSdkImportRepo = document.getElementById('btn-sdk-import-repo');
  const inputSdkFileUpload = document.getElementById('input-sdk-file-upload');
  const labelUploadedFileName = document.getElementById('label-uploaded-file-name');
  const inputSdkApiKey = document.getElementById('input-sdk-api-key');
  const btnSdkActivateApi = document.getElementById('btn-sdk-activate-api');
  const sdkConsoleStatusText = document.getElementById('sdk-console-status-text');

  const selectSdkLanguage = document.getElementById('select-sdk-language');
  const selectSdkTaskType = document.getElementById('select-sdk-task-type');
  const textareaSdkCodeEditor = document.getElementById('textarea-sdk-code-editor');
  const inputSdkCustomInstruction = document.getElementById('input-sdk-custom-instruction');
  const btnSdkRunAutofix = document.getElementById('btn-sdk-run-autofix');
  const sdkCorrectedCodeDisplay = document.getElementById('sdk-corrected-code-display');
  const btnApplyCorrectedCode = document.getElementById('btn-apply-corrected-code');
  const btnSdkCopyCode = document.getElementById('btn-sdk-copy-code');

  const formSdkAssistantChat = document.getElementById('form-sdk-assistant-chat');
  const inputSdkAssistantQuery = document.getElementById('input-sdk-assistant-query');
  const sdkAssistantMessagesFlow = document.getElementById('sdk-assistant-messages-flow');
  const btnClearSdkAssistant = document.getElementById('btn-clear-sdk-assistant');

  let activeSdkApiKey = '';
  let lastCorrectedCode = '';
  let sdkAssistantHistory = [];

  // Importation de dépôt GitHub / GitLab
  if (btnSdkImportRepo && inputSdkRepoUrl) {
    btnSdkImportRepo.addEventListener('click', async () => {
      const url = inputSdkRepoUrl.value.trim();
      if (!url) {
        alert("Veuillez saisir l'URL d'un dépôt GitHub ou GitLab.");
        return;
      }

      btnSdkImportRepo.disabled = true;
      btnSdkImportRepo.textContent = "⏳ Importation...";

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
          if (textareaSdkCodeEditor) {
            textareaSdkCodeEditor.value = data.projet.codeExemple || `// Projet ${data.projet.nom} importé avec succès.\n\nconsole.log("Connecté à PEGINTI IA Pro");`;
          }
          ajouterMessageAssistant(`J'ai importé le projet **${data.projet.nom}** (${url}). Vous pouvez maintenant modifier le code dans l'éditeur et lancer la correction automatique.`);
        } else {
          alert("Erreur lors de l'importation : " + (data.error || "Échec"));
        }
      } catch (err) {
        alert("Erreur : " + err.message);
      } finally {
        btnSdkImportRepo.disabled = false;
        btnSdkImportRepo.textContent = "⬇️ Importer Dépôt";
      }
    });
  }

  // Importation de fichier source local
  if (inputSdkFileUpload && labelUploadedFileName) {
    inputSdkFileUpload.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        labelUploadedFileName.textContent = `Fichier : ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = evt.target?.result;
          if (typeof content === 'string' && textareaSdkCodeEditor) {
            textareaSdkCodeEditor.value = content;
            ajouterMessageAssistant(`Le fichier source **${file.name}** a été chargé dans l'éditeur de code.`);
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // Activation de la Console API
  if (btnSdkActivateApi && inputSdkApiKey) {
    btnSdkActivateApi.addEventListener('click', () => {
      const key = inputSdkApiKey.value.trim();
      activeSdkApiKey = key;
      if (sdkConsoleStatusText) {
        if (key) {
          sdkConsoleStatusText.textContent = `Console PEGINTI IA V3.5 : Clé API Personnalisée Activée (***${key.slice(-4)})`;
          sdkConsoleStatusText.style.color = '#10b981';
        } else {
          sdkConsoleStatusText.textContent = `Console PEGINTI IA V3.5 : Connectée au Serveur Local Souverain`;
          sdkConsoleStatusText.style.color = '#38bdf8';
        }
      }
      ajouterMessageAssistant(`Configuration API mise à jour. La console PEGINTI IA est prête à traiter vos requêtes.`);
    });
  }

  // Changement de modèle selon langage
  if (selectSdkLanguage && textareaSdkCodeEditor) {
    selectSdkLanguage.addEventListener('change', (e) => {
      const lang = e.target.value;
      if (CODE_TEMPLATES[lang]) {
        textareaSdkCodeEditor.value = CODE_TEMPLATES[lang];
      }
    });
  }

  // Exécution de la correction et configuration automatique du code source
  if (btnSdkRunAutofix && textareaSdkCodeEditor && sdkCorrectedCodeDisplay) {
    btnSdkRunAutofix.addEventListener('click', async () => {
      const code = textareaSdkCodeEditor.value.trim();
      const lang = selectSdkLanguage?.value || 'javascript';
      const task = selectSdkTaskType?.options[selectSdkTaskType.selectedIndex]?.text || 'Correction automatique';
      const instructions = inputSdkCustomInstruction?.value?.trim() || task;

      if (!code) {
        alert("Veuillez saisir ou coller du code source dans l'éditeur.");
        return;
      }

      btnSdkRunAutofix.disabled = true;
      btnSdkRunAutofix.innerHTML = '<span>⚡ Analyse &amp; Correction souveraine en cours...</span>';
      sdkCorrectedCodeDisplay.innerHTML = '<span style="color:#38bdf8;">🧠 bo\'oivinichat analyse la syntaxe, la sécurité et configure l\'application...</span>';

      try {
        const res = await fetch('/api/sdk/auto-fix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            language: lang,
            instructions,
            apiKey: activeSdkApiKey
          })
        });

        const data = await res.json();
        if (data.success && (data.analyse || data.codeCorrige)) {
          lastCorrectedCode = data.codeCorrige || data.analyse;
          sdkCorrectedCodeDisplay.innerHTML = `
            <div style="color: #10b981; font-weight: 700; font-size: 11px; margin-bottom: 8px;">✓ CODE CONFIGURÉ ET VALIDÉ PAR PEGINTI IA STUDIO PRO :</div>
            <div class="formatted-output" style="font-size:12px; line-height:1.5;">${formatTexteSouverain(lastCorrectedCode)}</div>
          `;
          ajouterMessageAssistant(`J'ai terminé la **${task}** sur votre code ${lang.toUpperCase()}. Vous pouvez copier le résultat ou l'injecter directement dans l'éditeur.`);
        } else {
          sdkCorrectedCodeDisplay.innerHTML = `<span style="color:#ef4444;">Erreur : ${data.error || 'Échec de traitement'}</span>`;
        }
      } catch (err) {
        sdkCorrectedCodeDisplay.innerHTML = `<span style="color:#ef4444;">Erreur de communication : ${err.message}</span>`;
      } finally {
        btnSdkRunAutofix.disabled = false;
        btnSdkRunAutofix.innerHTML = '🚀 CORRIGER &amp; CONFIGURER LE CODE AVEC L\'IA';
      }
    });
  }

  // Remplacer le code dans l'éditeur par le code corrigé
  if (btnApplyCorrectedCode && textareaSdkCodeEditor) {
    btnApplyCorrectedCode.addEventListener('click', () => {
      if (lastCorrectedCode) {
        const codeBlockMatch = lastCorrectedCode.match(/```[a-zA-Z0-9_\-\+]*\n([\s\S]*?)```/);
        const codeToApply = codeBlockMatch ? codeBlockMatch[1].trim() : lastCorrectedCode;
        textareaSdkCodeEditor.value = codeToApply;
        btnApplyCorrectedCode.textContent = '✓ Code Appliqué !';
        setTimeout(() => { btnApplyCorrectedCode.textContent = '⬅ Remplacer dans l\'éditeur'; }, 2000);
      }
    });
  }

  // Copier le code de l'éditeur
  if (btnSdkCopyCode && textareaSdkCodeEditor) {
    btnSdkCopyCode.addEventListener('click', () => {
      navigator.clipboard.writeText(textareaSdkCodeEditor.value);
      btnSdkCopyCode.textContent = '✓ Copié !';
      setTimeout(() => { btnSdkCopyCode.textContent = '📋 Copier le Code'; }, 2000);
    });
  }

  // Assistant technique bo'oivinichat (Chat Développeurs)
  function ajouterMessageAssistant(msg, auteur = 'bo\'oivinichat') {
    if (!sdkAssistantMessagesFlow) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'assistant-msg-bubble';
    msgDiv.innerHTML = `
      <div class="msg-author">${auteur} :</div>
      <div style="font-size: 11.5px; line-height: 1.55;">${formatTexteSouverain(msg)}</div>
    `;
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
      waitDiv.innerHTML = `<div class="msg-author">bo'oivinichat :</div><p style="color:#38bdf8;"><em>Analyse technique en cours...</em></p>`;
      sdkAssistantMessagesFlow?.appendChild(waitDiv);
      sdkAssistantMessagesFlow.scrollTop = sdkAssistantMessagesFlow.scrollHeight;

      try {
        const res = await fetch('/api/sdk/assistant-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q,
            codeContext: textareaSdkCodeEditor?.value || '',
            history: sdkAssistantHistory,
            apiKey: activeSdkApiKey
          })
        });

        const data = await res.json();
        const rep = data.reponse || data.response || "Recommandation technique transmise.";
        sdkAssistantHistory.push({ user: q, bot: rep });

        const waitEl = document.getElementById(tempId);
        if (waitEl) {
          waitEl.innerHTML = `
            <div class="msg-author">bo'oivinichat :</div>
            <div style="font-size: 11.5px; line-height: 1.55;">${formatTexteSouverain(rep)}</div>
          `;
        }
      } catch (err) {
        const waitEl = document.getElementById(tempId);
        if (waitEl) waitEl.innerHTML = `<span style="color:#ef4444;">Erreur : ${err.message}</span>`;
      }
      sdkAssistantMessagesFlow.scrollTop = sdkAssistantMessagesFlow.scrollHeight;
    });
  }

  if (btnClearSdkAssistant && sdkAssistantMessagesFlow) {
    btnClearSdkAssistant.addEventListener('click', () => {
      sdkAssistantHistory = [];
      sdkAssistantMessagesFlow.innerHTML = `
        <div class="assistant-msg-bubble">
          <div class="msg-author">bo'oivinichat :</div>
          <p>Bienvenue dans votre Studio SDK PEGINTI Pro. Je suis votre assistant technique dédié. Posez-moi vos questions sur le code, l'optimisation Techno-eecoc, la configuration des API ou l'architecture de vos projets.</p>
        </div>
      `;
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
  const modalChatForm = document.getElementById('modal-chat-form');
  const modalChatInput = document.getElementById('modal-chat-input');
  const modalChatFlow = document.getElementById('modal-chat-flow-zone');

  if (modalChatForm && modalChatInput) {
    modalChatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = modalChatInput.value.trim();
      if (!text) return;

      const userDiv = document.createElement('div');
      userDiv.className = 'chat-row user-row';
      userDiv.innerHTML = `<div class="chat-bubble"><p>${text}</p></div>`;
      modalChatFlow.appendChild(userDiv);
      modalChatInput.value = '';
      modalChatFlow.scrollTop = modalChatFlow.scrollHeight;

      const botDiv = document.createElement('div');
      botDiv.className = 'chat-row bot-row';
      botDiv.innerHTML = `
        <div class="chat-avatar">P</div>
        <div class="chat-bubble">
          <div class="bubble-meta"><strong>PEGINTI-CHAT V3</strong> · <span>bo'oivinichat</span></div>
          <p><em>Réflexion cognitive en cours...</em></p>
        </div>
      `;
      modalChatFlow.appendChild(botDiv);
      modalChatFlow.scrollTop = modalChatFlow.scrollHeight;

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
        renderHomeConversation();
        const pEl = botDiv.querySelector('.chat-bubble p');
        if (pEl) pEl.innerHTML = formatTexteSouverain(rep);
      } catch (err) {
        const pEl = botDiv.querySelector('.chat-bubble p');
        if (pEl) pEl.textContent = 'Erreur de connexion avec le serveur.';
      }
      modalChatFlow.scrollTop = modalChatFlow.scrollHeight;
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
