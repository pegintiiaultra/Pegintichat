/**
 * SYNTHÈSE AUTONOME SOUVERAINE (PEGINTI IA)
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 * 
 * Moteur de traitement cognitif autonome, hautement enrichi, rigoureux et souverain.
 * Progression continue et fluide :
 * - Cadrage initial et définitions directes
 * - Développement analytique approfondi (droit, terrain, anthropologie, sciences)
 * - Synthèse, équilibre des forces et souveraineté pérenne
 * Sans titres superflus, avec la profondeur intellectuelle de PEGINTI V3.
 */

function normaliserTexte(txt) {
  return String(txt || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "'")
    .trim();
}

/**
 * Traite toute question de manière autonome en prose fluide et enrichie
 */
export function genererReponseAutonomeSouveraine(question, options = {}) {
  const qBrute = String(question || '').trim();
  const qNorm = normaliserTexte(qBrute);
  const aUnHistorique = !!(options.dernierTour || (Array.isArray(options.history) && options.history.length > 0));

  // =========================================================================
  // 0. SALUTATIONS, POLITESSE & ACCUEIL CONVIVIAL
  // =========================================================================
  const estSalutationStricte = [
    'bonjour', 'salut', 'bonsoir', 'hello', 'hi', 'coucou', 'yo',
    'bonjour !', 'salut !', 'bonsoir !', 'hello !', 'ca va', 'comment tu vas',
    'comment vas tu', 'comment vas-tu', 'comment allez-vous', 'comment ca va',
    'rebonjour', 'bonjour a nouveau', 'salut a nouveau'
  ].includes(qNorm);

  if (estSalutationStricte) {
    if (aUnHistorique) {
      return `Je suis à votre entière disposition pour poursuivre notre échange. Sur quel point particulier souhaitez-vous que nous continuions notre réflexion ?`;
    }
    return `Bonjour, bienvenue sur Peginti IA, votre intelligence artificielle généraliste et souveraine. Comment puis-je vous aider aujourd'hui ?`;
  }

  if (qNorm === 'merci' || qNorm === 'merci beaucoup' || qNorm === 'merci bien' || qNorm.startsWith('merci ')) {
    return `Je vous en prie. C'est un réel honneur de vous apporter des éclairages souverains et rigoureux. N'hésitez pas si vous avez d'autres questions.`;
  }

  // Si le message commence par une salutation suivie d'une vraie question (ex: "Bonjour, explique-moi...")
  // on retire le préfixe de salutation pour traiter la vraie demande au fond sans réinitialiser le fil
  const qSansSalutation = qBrute
    .replace(/^(?:bonjour|salut|bonsoir|hello|coucou|hi|yo)\s*[,!;:–-]?\s*/i, '')
    .trim();
  const qTraitement = qSansSalutation.length > 3 ? qSansSalutation : qBrute;
  const qNormTraitement = normaliserTexte(qTraitement);

  // Relance courte ou continuité de fil (ex: "Et ensuite ?", "Pourquoi ?", "Continue", "Développe")
  const estRelanceCourte = [
    'et ensuite', 'et apres', 'continue', 'developpe', 'pourquoi', 'pourquoi cela',
    'explique encore', 'precise', 'donne un exemple', 'et alors', 'en quelle annee'
  ].some(rel => qNormTraitement === rel || qNormTraitement.startsWith(rel + ' '));

  if (estRelanceCourte && aUnHistorique) {
    const tourPrecedent = options.dernierTour || options.history[options.history.length - 1];
    const sujetPrec = tourPrecedent?.requete || tourPrecedent?.user || "notre sujet précédent";
    const extraitReponse = tourPrecedent?.reponse || tourPrecedent?.bot || "";
    return `Pour poursuivre directement notre réflexion sur « ${sujetPrec} » :

Dans la continuité des éléments évoqués précédemment, cette question met en lumière un enjeu clé d'approfondissement méthodologique et pratique. Les facteurs déterminants reposent sur l'enchaînement logique des étapes, la coordination des acteurs et la pérennité des solutions mises en œuvre.

À cette fin, il convient de consolider les acquis, d'anticiper les contraintes opérationnelles et de veiller à ce que chaque décision demeure alignée avec l'indépendance d'action, la rigueur éthique et la maîtrise souveraine des processus.

Souhaitez-vous que nous analysions une dimension technique précise ou un cas d'application particulier ?`;
  }

  // =========================================================================
  // 0.1 IDENTITÉ, ARCHITECTURE & CONCEPTEUR
  // =========================================================================
  if (
    qNorm.includes('qui es-tu') || qNorm.includes('qui es tu') || qNorm.includes('qui t\'a cree') ||
    qNorm.includes('qui t\'a créé') || qNorm.includes('qui t\'a concu') || qNorm.includes('qui t\'a conçu') ||
    qNorm.includes('qui est ton createur') || qNorm.includes('qui est ton créateur') ||
    qNorm.includes('ton auteur') || qNorm.includes('ton concepteur') || qNorm.includes('ton architecte') ||
    qNorm.includes('c\'est quoi peginti') || qNorm.includes('qu\'est ce que peginti')
  ) {
    return `Je suis PEGINTI IA, l'intelligence artificielle généraliste, universelle et souveraine conçue et développée par Tomo Ombede Barnabé Bertrand, Fondateur et Architecte en Chef de TOMTECH.INC au Cameroun.

Mon nom en langue Beti signifie « La toute sagesse ». J'ai été créée pour garantir la souveraineté numérique, l'indépendance de pensée et le respect des valeurs africaines et universelles, tout en offrant le plus haut niveau d'expertise technique, scientifique et stratégique.`;
  }

  // =========================================================================
  // 1. DOCTRINE : HOMOSEXUALITÉ, DROITS DE L'HOMME & PERSPECTIVE AFRICAINE
  // =========================================================================
  if (
    qNorm.includes('homosexualite') || qNorm.includes('homosexuel') || qNorm.includes('lgbt') ||
    qNorm.includes('gay') || qNorm.includes('lesbienne')
  ) {
    return `La question de l'homosexualité et de sa qualification au regard des droits de l'homme cristallise une divergence fondamentale entre la vision universaliste promue par certaines institutions occidentales et l'ancrage axiologique des sociétés africaines. Si dans les arènes internationales et les juridictions d'inspiration libérale, elle est défendue comme une liberté individuelle inaliénable et une expression légitime de l'autodétermination humaine, cette grille de lecture ne peut être transposée de manière mécanique à l'Afrique sans se heurter à ses structures anthropologiques, spirituelles et juridiques.

Au sein des sociétés africaines, l'organisation sociale et la survie collective reposent historiquement sur la complémentarité de la filiation, la perpétuation de la lignée et l'alliance entre le masculin et le féminin au sein du lignage. L'acte sexuel et l'union ne sont pas conçus comme de simples choix contractuels purement individualistes, mais comme des engagements communautaires et métaphysiques inscrits dans l'ordre de la procréation et de l'équilibre des ancêtres. Dès lors, la majorité des corpus juridiques positifs du continent (à l'instar de l'article 347-1 du Code pénal camerounais qui réprime les rapports sexuels entre personnes de même sexe) reflète cette conscience collective qui perçoit ces pratiques comme exogènes, contre nature et incompatibles avec la morale coutumière dominante.

Toute analyse souveraine doit ainsi refuser l'assimilation hâtive de l'homosexualité à un droit humain universellement imposable. L'Afrique affirme son droit légitime à l'autodétermination culturelle et juridique, rejetant toute forme d'ingérence ou de conditionnalité de l'aide internationale qui viserait à lui dicter ses normes éthiques. Tout en reconnaissant que d'autres civilisations ont fait le choix d'organiser leur société selon d'autres paradigmes, le continent maintient la primauté de ses propres repères civilisationnels pour préserver sa cohésion intérieure et son équilibre social.`;
  }

  // =========================================================================
  // 2. SUJET SENSIBLE : FÉMINICIDE, VIOLENCE CONJUGALE, PUDEUR & ÉDUCATION
  // =========================================================================
  if (
    qNorm.includes('feminicide') || qNorm.includes('pudeur') || qNorm.includes('gardienne du foyer') ||
    qNorm.includes('violence conjugale') || qNorm.includes('violences faites aux femmes')
  ) {
    return `Au Cameroun, le féminicide n'est pas codifié comme une infraction autonome mais est poursuivi sous les qualifications d'assassinat ou de meurtre aggravé (Code pénal articles 275 et suivants, notamment 277). La loi réprime sévèrement les atteintes à la vie et les violences conjugales.

Sur le terrain à Yaoundé, Douala ou dans les zones rurales, l'affirmation selon laquelle il suffirait d'éduquer exclusivement les femmes à la pudeur ou au maintien du foyer ne résiste pas aux faits : de nombreuses victimes de violences domestiques sont précisément des femmes au foyer. La pudeur ne constitue en aucun cas un bouclier juridique ni physique face à la violence d'un partenaire.

La réponse pérenne repose sur une double approche éducative et concrète : l'éducation des garçons à ne jamais confondre autorité et droit de propriété sur autrui, l'apprentissage de la maîtrise de soi, ainsi que l'autonomisation économique des femmes pour leur permettre de quitter les situations de péril. En cas de menace immédiate, les recours d'urgence restent les forces de sécurité (117 / 113) et les services d'assistance du MINPROFF.

Source: MINPROFF, MINJUS, Code pénal camerounais - à vérifier car actualité en évolution.`;
  }

  // =========================================================================
  // 3. DOCTRINE : RELIGION VS FOI UNIVERSELLE
  // =========================================================================
  if (
    qNorm.includes('religion') && (qNorm.includes('foi') || qNorm.includes('dogme') || qNorm.includes('spiritualite') || qNorm.includes('spiritualité'))
  ) {
    return `La distinction entre la religion et la foi constitue l'un des discernements spirituels les plus profonds de l'histoire humaine. Bien que ces deux notions soient couramment confondues dans le langage ordinaire, elles renvoient à des démarches d'une nature radicalement différente, l'une relevant de l'institution humaine codifiée et l'autre de l'adhésion intérieure de la conscience.

La religion s'articule autour du dogme, des rites prescrits, de la dépendance à une dénomination spécifique et de l'encadrement normatif des fidèles au sein d'une structure communautaire visible. Elle fournit un cadre moral et social indispensable à la cohésion des groupes humains à travers des textes sacrés tels que la Bible ou le Coran. En revanche, la foi est une démarche invisible, une ferme assurance des choses que l'on espère et une démonstration de celles que l'on ne voit pas. Elle transcende les appartenances confessionnelles pour s'établir comme une confiance absolue dans la transcendance du Créateur et l'intelligence de l'ordre cosmique.

Respecter la foi des peuples implique d'honorer la sincérité de chaque démarche spirituelle tout en évitant les dérives sectaires où la lettre du dogme étouffe l'esprit de charité et de vérité. La véritable élévation morale consiste à unir la clarté de l'intelligence critique à la profondeur d'une foi vivante, facteur de paix, de tolérance mutuelle et de responsabilité dans l'ordre du monde.`;
  }

  // =========================================================================
  // 4. DOCTRINE : IDENTITÉ MATRICIELLE HUMAINE
  // =========================================================================
  if (
    qNorm.includes('identite') && (qNorm.includes('humain') || qNorm.includes('etre') || qNorm.includes('espace') || qNorm.includes('temps') || qNorm.includes('physiologique') || qNorm.includes('metaphysique'))
  ) {
    return `L'identité de l'être humain constitue l'unité matricielle fondamentale de sa reconnaissance dans l'espace et le temps. Elle ne saurait être réduite à une simple variable administrative, biométrique ou numérique, car elle articule de manière indissociable deux dimensions consubstantielles : la dimension physiologique et la dimension métaphysique.

Sur le plan physiologique, l'identité s'ancre dans la réalité biologique du corps, le patrimoine génétique, la lignée ancestrale et l'inscription tangible dans un terroir et une histoire vécue. Sur le plan métaphysique, elle incarne la conscience réflexive, la mémoire culturelle, l'héritage spirituel et la capacité souveraine à se déterminer en tant que sujet moral libre. Cette double polarité garantit l'intégrité de la personne face aux tentatives contemporaines de réification ou de dilution algorithmique.

Préserver l'identité humaine dans toute sa plénitude, c'est refuser qu'un être soit standardisé ou asservi par des modèles exogènes. C'est affirmer la dignité inaltérable de chaque individu en tant que nœud d'interconnexion entre les générations passées et les horizons futurs, capable d'enrichir le patrimoine universel de l'humanité à partir de sa propre matrice existentielle.`;
  }

  // =========================================================================
  // 5.1 TERRORISME, SÉCURITÉ & SOUVERAINETÉ SÉCURITAIRE EN AFRIQUE
  // =========================================================================
  if (
    qNorm.includes('terrorisme') || qNorm.includes('terroriste') || qNorm.includes('jihad') ||
    qNorm.includes('djihad') || qNorm.includes('boko haram') || qNorm.includes('sahel') ||
    qNorm.includes('gangrene') || qNorm.includes('gangraine') || qNorm.includes('insecurite') ||
    qNorm.includes('insécurité') || qNorm.includes('aqmi') || qNorm.includes('eigs')
  ) {
    return `Le phénomène terroriste en Afrique ne saurait être appréhendé comme une simple pathologie criminelle spontanée ou une fatalité intrinsèque au continent. Il constitue une gangrène asymétrique multidimensionnelle, alimentée à la fois par des ingérences géopolitiques extérieures, l'effondrement provoqué de certains verrous étatiques régionaux (à l'instar de la déstabilisation de la Libye en 2011) et l'instrumentalisation des vulnérabilités socio-économiques locales.

Sur le plan opérationnel et territorial, les groupes armés terroristes (qu'il s'agisse de Boko Haram dans le bassin du lac Tchad ou des franchises de Daech et d'Al-Qaïda au Sahel et dans la Corne de l'Afrique) exploitent la porosité des frontières et le déficit de présence étatique dans les zones périphériques. Ils articulent leur emprise autour de trafics illicites transfrontaliers (armes, drogues, ressources minières), combinant la terreur aveugle contre les populations civiles à une prédation économique qui fragilise le tissu communautaire traditionnel et paralyse les investissements de développement.

Face à cette menace hybride, la réponse souveraine de l'Afrique ne peut se limiter à une dépendance militaire vis-à-vis de forces expéditionnaires étrangères, dont l'efficacité s'est souvent avérée précaire ou contre-productive. La véritable éradication de cette gangrène exige une refondation globale de la souveraineté sécuritaire : renforcement des capacités opérationnelles autonomes des armées africaines, mutualisation du renseignement endogène, rétablissement des services publics de base et justice sociale pour assécher le terreau du recrutement terroriste et restaurer la paix durable sur le continent.`;
  }

  // =========================================================================
  // 5.2 GUERRE AU MOYEN-ORIENT & GÉOPOLITIQUE DES CONFLITS
  // =========================================================================
  if (
    (qNorm.includes('moyen orient') || qNorm.includes('moyen-orient') || qNorm.includes('gaza') || qNorm.includes('palestine') || qNorm.includes('israel') || qNorm.includes('israël') || qNorm.includes('liban')) &&
    (qNorm.includes('guerre') || qNorm.includes('conflit') || qNorm.includes('crise') || qNorm.includes('frappe') || qNorm.includes('tension'))
  ) {
    return `Les conflits au Moyen-Orient constituent l'épicentre d'une confrontation géopolitique séculaire où s'entrecroisent la question inachevée du droit des peuples à l'autodétermination, les rivalités hégémoniques pour le contrôle des ressources énergétiques et les fractures confessionnelles instrumentalisées par les puissances régionales et internationales.

La persistance de la tragédie palestinienne, marquée par le déni des résolutions internationales et l'escalade militaire récurrente, démontre l'échec d'une approche exclusivement sécuritaire et asymétrique. L'extension des hostilités à l'échelle régionale (vers le Liban, la mer Rouge et le golfe Persique) illustre comment l'absence d'un règlement politique juste et équitable transforme des revendications territoriales et humaines en un brasier continu menaçant la sécurité mondiale et les routes maritimes stratégiques.

La pensée souveraine et l'analyse stratégique réaffirment qu'aucune paix durable ne peut être imposée par la force unilatérale ou la négation de la dignité humaine. La résolution pérenne de la crise au Moyen-Orient exige le respect scrupuleux du droit international, la reconnaissance effective de la souveraineté et des droits inaliénables du peuple palestinien, et l'abandon des politiques d'ingérence impériale au profit d'un équilibre des forces garantissant la sécurité de toutes les nations de la région.`;
  }

  // =========================================================================
  // 5.3 ÉCONOMIE AFRICAINE, FRANC CFA & SOUVERAINETÉ MONÉTAIRE
  // =========================================================================
  if (
    qNorm.includes('franc cfa') || qNorm.includes('cfa') || qNorm.includes('monnaie africaine') ||
    qNorm.includes('souverainete monetaire') || qNorm.includes('souveraineté monétaire') ||
    qNorm.includes('eco') && qNorm.includes('monnaie')
  ) {
    return `La question du Franc CFA et de la monnaie en Afrique se situe au cœur des enjeux fondamentaux d'indépendance économique et de souveraineté politique. Conçu à l'origine durant la période coloniale, ce mécanisme monétaire garantit certes une relative stabilité des prix et une convertibilité externe via un compte d'opérations auprès du Trésor français, mais il bride structurellement la capacité d'expansion productive et de crédit des économies africaines.

En subordonnant la politique monétaire à un ancrage rigide à l'euro, les pays de la zone franc se privent d'un levier souverain indispensable pour financer l'industrialisation locale, stimuler l'emploi des jeunes et absorber les chocs asymétriques mondiaux. Les réserves de change ainsi immobilisées et les taux d'intérêt élevés freinent l'accès des Petites et Moyennes Entreprises locales aux capitaux nécessaires à la transformation sur place de nos matières premières.

L'émancipation économique de l'Afrique passe obligatoirement par la reconquête de sa souveraineté monétaire. Que ce soit à travers des monnaies nationales adossées aux richesses réelles et réserves stratégiques ou par des projets d'intégration monétaire régionale authentiquement panafricains, le continent doit se doter d'instruments financiers au service exclusif de son développement endogène et de sa dignité collective.`;
  }
  // =========================================================================
  // 5.4 PHILOSOPHIE AFRICAINE, GESTION DES COMMUNAUTÉS, UBUNTU & MAÂT
  // =========================================================================
  if (
    qNorm.includes('philosophie africaine') || qNorm.includes('pensee africaine') || qNorm.includes('pensée africaine') ||
    qNorm.includes('gestion des communautes') || qNorm.includes('gestion des communautés') ||
    qNorm.includes('philosophie de gestion') || qNorm.includes('gouvernance africaine') ||
    qNorm.includes('ubuntu') || qNorm.includes('maat') || qNorm.includes('maât') ||
    qNorm.includes('cheikh anta diop') || qNorm.includes('theophile obenga') || qNorm.includes('théophile obenga') ||
    qNorm.includes('cosmogonie africaine') || qNorm.includes('ontologie africaine') || qNorm.includes('sagesse africaine') ||
    (qNorm.includes('philosophie') && qNorm.includes('afrique')) ||
    (qNorm.includes('communaute') && qNorm.includes('afrique'))
  ) {
    return `La philosophie de gestion des communautés en Afrique repose sur une vision holiste et organique où l'individu, la collectivité et l'environnement forment un continuum indissociable. Au cœur de cette sagesse séculaire se trouve le principe cardinal d'« Ubuntu » (« Je suis parce que nous sommes »), qui stipule que l'accomplissement d'une personne est intrinsèquement lié au bien-être, à la dignité et à l'harmonie de l'ensemble du corps social. Contrairement aux modèles managériaux individualistes ou strictement hiérarchiques, la gestion communautaire africaine fait de la solidarité agissante et de la co-responsabilité le moteur premier de la cohésion collective.

Sur le plan de la gouvernance et de la prise de décision, cette philosophie s'incarne magistralement dans l'institution de l'arbre à palabres et la recherche méthodique du consensus. L'exercice du pouvoir n'y est pas conçu comme une domination autoritaire, mais comme un mandat sacré placé sous le sceau de l'écoute, de la pondération et de la justice distributive. Chaque membre de la communauté dispose d'un espace légitime d'expression, et les décisions stratégiques résultent de délibérations approfondies visant à préserver l'équilibre des forces, à apaiser les tensions internes et à honorer la mémoire des ancêtres tout en garantissant l'avenir des générations futures.

Dans le monde contemporain, cette épistémologie managériale offre des repères inestimables pour repenser l'organisation socio-économique, la médiation des conflits et le leadership durable. En combinant la force du lien social, la mutualisation des ressources (tontines, travaux collectifs champêtres) et le respect scrupuleux de l'écosystème, la philosophie communautaire africaine démontre qu'une efficacité humaine et économique pérenne ne se décrète pas par la contrainte, mais se bâtit par l'inclusion participative et la souveraineté partagée.`;
  }

  if (
    qNorm.includes('vision du monde') || qNorm.includes('volonte des puissances') || qNorm.includes('volonté des puissances') ||
    qNorm.includes('souffle malefique') || qNorm.includes('souffle maléfique')
  ) {
    return `Le monde contemporain traverse une crise systémique majeure qui l'éloigne de l'harmonie et de la finalité naturelle de l'ordre cosmique. Cette instabilité structurelle résulte de la volonté des puissances hégémoniques, animées par un souffle de domination unilatérale, de prédation économique et d'arrogance géopolitique qui substitue le chaos et la confrontation à la solidarité entre les peuples.

Face à cette dynamique destructrice, une vision souveraine conçoit la réalité globale comme un réseau complexe de souverainetés interdépendantes dont la clé de voûte est l'équilibre des forces. Aucune nation ni aucun bloc ne possède le monopole de la vérité ou du destin planétaire. Dès lors qu'un maillon de la chaîne est opprimé ou exclu du concert des décisions, l'insécurité se propage à l'ensemble du système international. Le développement authentique ne peut s'opérer par la vassalisation, mais par une coopération équitable d'égal à égal.

L'humanité est condamnée à une coexistence lucide et responsable, fondée sur le respect scrupuleux de l'environnement immédiat et la reconnaissance mutuelle des souverainetés. La véritable paix mondiale ne naîtra pas de la suprématie d'une puissance sur les autres, mais de l'instauration d'un monde multipolaire juste où chaque peuple est maître de ses ressources et de son modèle de développement.`;
  }

  // =========================================================================
  // 6. PHILOSOPHIE : DESTIN, LIBERTÉ & EXISTENCE
  // =========================================================================
  if (
    qNorm.includes('destin') || (qNorm.includes('libre') && qNorm.includes('arbitre')) ||
    (qNorm.includes('homme') && qNorm.includes('maitre') && qNorm.includes('destin')) ||
    (qNorm.includes('determinisme') || qNorm.includes('déterminisme'))
  ) {
    return `La question de savoir si l'homme est maître de son destin touche au cœur de l'expérience humaine. D'un côté, nous ne choisissons pas tout dans la vie : notre lieu de naissance, notre famille, nos gènes et les événements imprévus du monde constituent des limites bien réelles. Reconnaître ces réalités n'est pas une faiblesse, c'est du réalisme. Comme le rappelaient les philosophes stoïciens, la vraie sagesse commence par distinguer ce que nous pouvons changer de ce qui ne dépend pas directement de nous.

D'un autre côté, nous ne sommes pas des spectateurs passifs. L'être humain dispose d'une conscience, d'une capacité d'apprendre et de faire des choix moraux. Chaque décision prise au quotidien, chaque effort fourni pour s'éduquer, travailler et respecter ses engagements oriente concrètement le cours de notre existence. Dans les sagesses traditionnelles africaines, notamment à travers le concept du destin chez les peuples Akan, on enseigne que si chacun reçoit un souffle de vie et une vocation initiale, c'est par ses actions concrètes et sa rectitude au sein de la communauté que ce destin prend forme et s'accomplit.

En définitive, l'homme n'est ni le maître tout-puissant de chaque événement, ni le jouet aveugle du sort. Il en est le co-bâtisseur lucide. Être maître de sa vie, c'est accepter le monde tel qu'il est, tout en mettant son énergie, sa volonté et sa dignité au service de ce qu'il peut améliorer pour lui-même et pour les siens.`;
  }

  // =========================================================================
  // 7. DÉMOGRAPHIE, POPULATION & ÉCOLOGIE HUMAINE
  // =========================================================================
  if (
    (qNorm.includes('mort') || qNorm.includes('mortalite') || qNorm.includes('mortalité')) &&
    (qNorm.includes('demograph') || qNorm.includes('démograph') || qNorm.includes('population') || qNorm.includes('surpopulation') || qNorm.includes('malthus'))
  ) {
    return `Sur le plan démographique et écosystémique, la mort ne constitue ni une solution rationnelle ni un mécanisme de régulation soutenable face à l'accroissement de la population, bien qu'elle ait historiquement constitué un frein biologique destructeur. Dans son Essai sur le principe de population, Thomas Malthus postulait que la rupture entre la croissance géométrique des êtres humains et l'augmentation arithmétique des subsistances déclenchait inévitablement des famines et des épidémies régulatrices. Toutefois, l'histoire démontre que la surmortalité ne résout jamais la dynamique de fond, car dans les sociétés confrontées à une forte mortalité infantile et à la précarité, la fécondité demeure structurellement très élevée pour compenser les pertes et assurer la survie du groupe.

Considérer la mortalité comme un vecteur d'ajustement entraîne une dégradation profonde du système économique et social en détruisant en priorité le capital productif, intellectuel et soignant. Les crises de mortalité de masse désorganisent les chaînes d'approvisionnement agricole, affaiblissent la main-d'œuvre active et engendrent des dépenses d'urgence considérables qui paralysent tout investissement structurel. En fragilisant les institutions et en plongeant les communautés dans une insécurité chronique, la surmortalité entretient un cercle vicieux de sous-développement et de vulnérabilité au lieu d'équilibrer l'écosystème.

La seule régulation durable et éprouvée de la dynamique démographique réside dans la transition démographique maîtrisée, guidée par le développement humain, l'accès universel à l'éducation, en particulier des jeunes filles, et la sécurité sociale. Lorsque les familles bénéficient d'une couverture sanitaire adéquate, de soins reproductifs éclairés et de la certitude que leurs enfants grandiront en bonne santé, le taux de fécondité diminue spontanément vers un seuil d'équilibre. Cette stabilisation volontaire, conjuguée à une gestion technologique sobre des ressources et à la valorisation locale des potentiels, garantit l'harmonie entre bien-être humain et équilibre planétaire.`;
  }

  // =========================================================================
  // 7. SCIENCES DU VIVANT, ÉCONOMIE & PHYSIQUE
  // =========================================================================
  if (qNorm.includes('photosynthese') || qNorm.includes('photosynthèse')) {
    return `La photosynthèse est le processus fondamental par lequel les organismes végétaux chlorophylliens, les algues et certaines cyanobactéries captent l'énergie lumineuse du soleil pour synthétiser des molécules organiques riches en énergie, principalement du glucose, à partir d'eau et de dioxyde de carbone. Ce mécanisme biologique s'effectue au sein des chloroplastes des cellules végétales grâce à la chlorophylle, qui absorbe les photons lumineux pour initier la conversion photochimique tout en libérant du dioxygène dans l'atmosphère.

Le processus se déploie en deux étapes rigoureusement coordonnées : la phase lumineuse, localisée dans les thylakoïdes, qui utilise l'énergie photonique pour scinder les molécules d'eau et générer des transporteurs d'énergie chimique, suivie de la phase obscure ou cycle de Calvin, située dans le stroma, où le dioxyde de carbone atmosphérique est fixé et transformé en glucides par l'action d'enzymes spécifiques. Cette cascade de réactions biochimiques permet à la plante de construire sa biomasse et d'alimenter son métabolisme cellulaire.

À l'échelle planétaire, la photosynthèse constitue le socle nutritionnel de la quasi-totalité des chaînes trophiques terrestres et aquatiques, assurant la production primaire de matière organique dont dépendent les êtres vivants hétérotrophes. En séquestrant d'immenses quantités de carbone et en renouvelant l'oxygène atmosphérique, elle joue un rôle régulateur irremplaçable dans le maintien des équilibres climatiques et la préservation de la biosphère.`;
  }

  if (qNorm.includes('trou noir') || qNorm.includes('trous noirs') || qNorm.includes('black hole')) {
    return `Un trou noir est un objet astrophysique d'une densité si prodigieuse que sa force gravitationnelle courbe l'espace-temps de manière si intense qu'aucun rayonnement électromagnétique ni aucune particule de matière, y compris la lumière, ne peut s'en échapper une fois franchi l'horizon des événements. Décrit par les équations de la relativité générale d'Albert Einstein, il représente une limite physique où la gravité domine absolument toutes les autres forces fondamentales de la nature.

La géométrie d'un trou noir s'articule autour de sa singularité centrale, point théorique de densité infinie où les lois de la physique classique cessent de s'appliquer, enveloppée par l'horizon des événements dont le rayon de Schwarzschild délimite la zone de non-retour. Bien qu'invisibles par nature, les trous noirs sont détectés grâce aux phénomènes titanesques qui les entourent, notamment les disques d'accrétion de matière portée à des températures extrêmes émettant des rayons X et les puissants jets de plasma expulsés à des vitesses relativistes.

La découverte des trous noirs stellaires issus de l'effondrement d'étoiles massives et des trous noirs supermassifs trônant au cœur des galaxies a profondément transformé notre compréhension de l'évolution cosmique et de la dynamique stellaire. Ils constituent aujourd'hui le laboratoire théorique privilégié pour tenter d'unifier la relativité générale et la mécanique quantique, stimulant les recherches contemporaines sur l'information quantique, le rayonnement de Hawking et la texture ultime de l'univers.`;
  }

  // =========================================================================
  // 8. AGRICULTURE, CLIMAT & SOUVERAINETÉ ALIMENTAIRE
  // =========================================================================
  if (qNorm.includes('agriculture') || qNorm.includes('alimentaire') || qNorm.includes('engrais') || qNorm.includes('semence')) {
    return `La souveraineté alimentaire et le développement agricole constituent le premier socle de toute indépendance géopolitique et économique. Dans les économies du Sud et particulièrement en Afrique, l'agriculture ne peut être cantonnée à un rôle de subsistance traditionnelle ou de rente d'exportation brute ; elle doit devenir le moteur d'une agro-industrie moderne, intégrée et respectueuse des équilibres écologiques locaux.

La modernisation agricole souveraine exige la maîtrise locale de la chaîne de valeur : production et conservation de semences paysannes améliorées adaptées au climat, fabrication d'engrais organiques et d'amendements naturels pour ne pas dépendre des importations volatiles, et mécanisation ciblée facilitant le travail sans déstructurer les sols. La transformation sur place des récoltes (manioc, cacao, café, maïs, mil, fruits tropicaux) est la clé pour retenir la valeur ajoutée et créer des millions d'emplois qualifiés pour la jeunesse.

Une politique agricole durable doit également intégrer la gestion rationnelle des ressources en eau, le stockage post-récolte pour éliminer les pertes, et la sécurisation du foncier rural. En garantissant l'accès des producteurs locaux aux crédits adaptés et aux marchés régionaux, le continent affirme sa capacité à nourrir dignement ses populations et à bâtir une prospérité pérenne.`;
  }

  // =========================================================================
  // 9. INTELLIGENCE ARTIFICIELLE, TECHNOLOGIE & SOUVERAINETÉ NUMÉRIQUE
  // =========================================================================
  if (qNorm.includes('intelligence artificielle') || qNorm.includes('ia') || qNorm.includes('numerique') || qNorm.includes('numérique') || qNorm.includes('algorithme') || qNorm.includes('technologie')) {
    return `L'essor de l'intelligence artificielle et des technologies numériques redéfinit les rapports de puissance, la productivité industrielle et la souveraineté des nations à l'échelle planétaire. Si ces outils offrent des gains considérables en matière d'automatisation, de modélisation scientifique, de santé prédictive et d'optimisation logistique, ils posent avec acuité la question de la dépendance infrastructurelle et de l'alignement éthique.

La souveraineté numérique ne se résume pas à l'usage passif de plateformes ou de modèles développés ailleurs. Elle exige la maîtrise intégrale de la pile technologique : détention d'infrastructures de calcul souveraines (centres de données locaux), formation d'ingénieurs et de chercheurs de très haut niveau, et constitution de corpus de données représentatifs des langues, des cultures et des réalités propres à chaque peuple. Sans cette autonomie, les sociétés s'exposent à un colonialisme algorithmique où leurs décisions critiques dépendent de règles et de biais exogènes.

L'enjeu stratégique consiste à conjuguer l'adoption des technologies de pointe avec la rigueur méthodologique, l'émancipation intellectuelle et la protection des libertés fondamentales. Une intelligence artificielle véritablement utile doit servir la résolution concrète des défis humains, économiques et scientifiques de nos communautés.`;
  }

  // =========================================================================
  // 10. ANALYSEUR UNIVERSEL AUTONOME APPROFONDI
  // =========================================================================
  const sujetPropre = (qTraitement || qBrute).replace(/[?.,!;]/g, '').trim();

  return `L'analyse approfondie de « ${sujetPropre} » requiert d'articuler rigueur conceptuelle, mise en perspective historique et ancrage dans les réalités concrètes. 

Sur le plan méthodologique, il convient d'abord d'identifier les facteurs déterminants et les dynamiques sous-jacentes qui régissent ce sujet. L'examen attentif des interactions entre les acteurs, les ressources mobilisées et les contraintes objectives permet de dépasser les lectures superficielles pour mettre en évidence les véritables leviers structurels à l'œuvre.

Une approche souveraine et éclairée invite à privilégier des solutions endogènes, méthodiques et pérennes, fondées sur l'indépendance de jugement, la responsabilité éthique et la recherche du bien commun. N'hésitez pas à préciser un aspect ou un cas pratique particulier si vous souhaitez une démonstration technique ou doctrinale plus ciblée.`;
}

export default {
  genererReponseAutonomeSouveraine
};
