document.addEventListener('DOMContentLoaded', () => {
  const statusBadge = document.getElementById('status-badge');
  const sysStatus = document.getElementById('sys-status');
  const sysIp = document.getElementById('sys-ip');
  const sysTunnel = document.getElementById('sys-tunnel');
  const vitrinePublique = document.getElementById('vitrine-publique');
  const vitrinePremium = document.getElementById('vitrine-premium');
  document.getElementById('btn-switch-premium').onclick = () => {vitrinePublique.classList.add('hidden');vitrinePremium.classList.remove('hidden');};
  document.getElementById('btn-back-public').onclick = () => {vitrinePremium.classList.add('hidden');vitrinePublique.classList.remove('hidden');};
  
  async function checkStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      statusBadge.textContent = data.statut;
      statusBadge.classList.add('online');
      sysStatus.textContent = data.statut;
      sysIp.textContent = data.client_ip;
      sysTunnel.textContent = data.tunnel;
    } catch (err) {statusBadge.textContent = "HORS LIGNE 🔴";}
  }
  
  document.getElementById('form-analyser').onsubmit = async (e) => {
    e.preventDefault();
    const apiKey = document.getElementById('api-key').value;
    const sujet = document.getElementById('sujet').value;
    document.getElementById('result-box').classList.remove('hidden');
    document.getElementById('result-content').textContent = "Analyse en cours...";
    const res = await fetch('/api/analyser', {method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},body:JSON.stringify({sujet})});
    const data = await res.json();
    document.getElementById('result-content').textContent = JSON.stringify(data, null, 2);
  };
  checkStatus();
});
