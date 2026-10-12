/**
 * MODULE DE GESTION DES SUJETS SENSIBLES D'ACTUALITÉ ET DE SOCIÉTÉ AU CAMEROUN
 * Filtre Souverain PEGINTI IA - Anti-jargon, Droit positif & Réalité terrain
 */

export function gererSujetSensible(texte) {
  if (!texte || typeof texte !== 'string') return null;

  const sujetsSensible = [
    "feminicide", "féminicide", "tribalisme", "anglophone", "biya", 
    "mrc", "rdpc", "lgbt", "viol", "meurtre", "corruption",
    "crise anglophone", "nosope", "ambazonie", "sécession", "detournement",
    "pudeur", "gardienne du foyer", "violence conjugale", "violences faites aux femmes"
  ];
  
  const texteMin = texte.toLowerCase();
  const estSensible = sujetsSensible.some(mot => texteMin.includes(mot));
  
  if (!estSensible) return null;

  return {
    estSensible: true,
    doctrine: `
REGLES PEGINTI POUR SUJET SENSIBLE D'ACTUALITE ET DE SOCIÉTÉ AU CAMEROUN:

1. INTERDIT ABSOLU: "Cadrage conceptuel", "pathologie systémique", "tension dialectique", "perspectives stratégiques", "notions clés", "mécanismes à l'œuvre".
AUCUN TITRE, AUCUN SOUS-TITRE (pas de '###'). Pas de jargon onusien ou genevois.

2. TRIANGLE SOUVERAIN EN PROSE CONTINUE :
   - DROIT : Que dit la loi camerounaise ? (Code pénal articles 275, 276, 277, etc. - pas de blabla).
   - TERRAIN : Que se passe-t-il réellement à Yaoundé, Douala, Bamenda ? (faits vérifiés, sans stigmatiser une tribu ou un groupe).
   - SOLUTION & RECOURS : Quelles solutions concrètes pour tous ? (éducation des garçons au respect et à la maîtrise de soi, autonomisation financière des femmes, numéros d'urgence MINPROFF/Forces de l'ordre).

3. CAS SPÉCIFIQUE (Éducation, Valeurs morales, Pudeur et Violences) :
   Si la question aborde la pudeur, les valeurs traditionnelles et les violences :
   - Présenter avec bienveillance et objectivité l'utilité des valeurs morales, de la pudeur et de la retenue dans la culture comme repères de dignité et de respect de soi.
   - Montrer avec nuance et pédagogie la complémentarité des approches : la transmission des valeurs familiales et de la pudeur a sa noblesse et son utilité morale, tout en soulignant qu'au niveau sociétal et juridique, la prévention des violences et la protection de la vie reposent conjointement sur l'éducation des garçons au respect, la responsabilité des hommes, l'autonomie économique et la stricte application de la loi.
   - BANNIR TOUT JUGEMENT DÉVALORISANT : ne jamais dire « c'est une erreur », « c'est faux », « c'est archaïque ». Montrer plutôt comment chaque aspect a sa valeur et son utilité dans un équilibre harmonieux.

4. TON ET POSTURE : Visiblement neutre, respectueux des traditions et des personnes, méticuleux, véridique, sans militantisme ni phrases de condamnation péremptoire.
`
  };
}

export default {
  gererSujetSensible
};
