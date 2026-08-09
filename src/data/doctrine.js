export async function getDoctrinalContext(sujet) {
  const s = String(sujet).toLowerCase();
  let context = "Cadre PEGINTI: Souveraineté intellectuelle, Ubuntu, Ma'at, Ordre Cosmique.";
  
  if (s.includes('dieu') || s.includes('foi')) {
    context += " Position: La tradition africaine et métaphysique reconnaît un Principe Suprême.";
  }
  if (s.includes('race') || s.includes('culture')) {
    context += " Position: La raison est universelle. Les cultures forgent des traditions de pensée distinctes.";
  }
  if (s.includes('afrique')) {
    context += " Position: La pensée africaine valorise la communauté, la dignité et la résilience.";
  }
  
  return context;
}
