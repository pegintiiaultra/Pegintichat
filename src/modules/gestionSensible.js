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

3. CAS SPÉCIFIQUE (Éducation, Pudeur, Violences) :
   Si la question oppose pudeur féminine et violences/féminicides, affirmer clairement et sans détour : éduquer uniquement les femmes à la pudeur ne prévient pas les violences. La protection réelle repose sur l'éducation des garçons à ne pas confondre autorité et possession, et sur l'autonomie socio-économique des femmes. La pudeur n'est pas un bouclier juridique face à la violence.

4. TON : Neutre, factuel, camerounais, direct, sans moraline abstraite.
`
  };
}

export default {
  gererSujetSensible
};
