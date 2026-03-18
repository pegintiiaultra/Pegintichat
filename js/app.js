async function loadComponent(id, file) {
  const res = await fetch(`components/${file}`);
  document.getElementById(id).innerHTML = await res.text();
}

// Charger les composants
loadComponent("header", "header.html");
loadComponent("public", "public.html");
loadComponent("premium", "premium.html");
loadComponent("footer", "footer.html");

// Exemple d'appel API
async function fetchPublic() {
  const res = await fetch('http://localhost:3000/');
  document.getElementById('publicResult').textContent = await res.text();
}

async function fetchPremium() {
  const msg = document.getElementById('premiumMessage').value;
  const res = await fetch(`http://localhost:3000/booivini/chat?message=${encodeURIComponent(msg)}`, {
    headers: { 'Authorization': 'TomTech' }
  });
  document.getElementById('premiumResult').textContent = await res.text();
}
