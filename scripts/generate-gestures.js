const fs = require('fs');
const path = require('path');

// Structure de base
const gesturesData = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString().split('T')[0],
  gestures: []
};

// Types de relations
const ALL_RELATIONS = ['celibataire', 'en_couple', 'fiance', 'marie', 'parent'];
const COUPLE_RELATIONS = ['en_couple', 'fiance', 'marie'];
const FAMILY_RELATIONS = ['parent', 'celibataire'];

// Compteur d'ID
let gestureIdCounter = 1;

// Fonction helper pour créer un geste
function createGesture(title, description, codeLangage, relationshipTypes, categorie) {
  return {
    id: `g_${codeLangage.toLowerCase()}_${gestureIdCounter++}`,
    title,
    description,
    codeLangage,
    relationshipTypes,
    categorie
  };
}

// ==================== MOMENTS DE QUALITÉ (MQ) - 50 gestes ====================
const mqGestures = [
  // Couple
  createGesture(
    "Soirée cinéma sans téléphone",
    "Organisez une soirée film à la maison, téléphones éteints, juste vous deux avec vos snacks préférés.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Promenade et discussion profonde",
    "Prenez le temps de marcher ensemble et de vraiment vous écouter, sans distractions.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Petit-déjeuner au lit ensemble",
    "Préparez un petit-déjeuner et prenez le temps de le savourer ensemble au lit, en discutant.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Rendez-vous surprise",
    "Planifiez une sortie surprise où vous pourrez passer du temps de qualité ensemble.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Cuisiner ensemble",
    "Choisissez une nouvelle recette et cuisinez ensemble, en profitant du moment partagé.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Soirée jeux de société",
    "Organisez une soirée jeux à deux ou en famille, sans écrans.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Regarder le coucher de soleil",
    "Trouvez un endroit agréable pour admirer le coucher de soleil ensemble.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Café en tête-à-tête",
    "Prenez un café ensemble dans un endroit calme, juste pour discuter.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Week-end escapade",
    "Planifiez une escapade d'un week-end pour vous retrouver loin du quotidien.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Écoute active quotidienne",
    "Prenez 20 minutes chaque jour pour vraiment écouter l'autre sans interruption.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Projet créatif ensemble",
    "Lancez-vous dans un projet créatif commun (peinture, bricolage, jardinage).",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Pique-nique romantique",
    "Organisez un pique-nique dans un parc ou un endroit spécial.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Soirée observation des étoiles",
    "Installez-vous confortablement pour observer les étoiles et discuter.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Cours ou atelier ensemble",
    "Inscrivez-vous à un cours qui vous intéresse tous les deux (danse, cuisine, poterie).",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Rituel du matin ensemble",
    "Créez un rituel matinal où vous prenez le temps de vous connecter avant la journée.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Lecture partagée",
    "Lisez le même livre et discutez-en ensemble régulièrement.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Journée aventure",
    "Partez à l'aventure ensemble : randonnée, exploration d'un nouveau quartier, etc.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Soirée dansante à la maison",
    "Mettez de la musique et dansez ensemble dans le salon.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Temps de qualité avec enfants",
    "Consacrez du temps exclusif à chaque enfant, individuellement.",
    "MQ", ['parent'], "moment"
  ),
  createGesture(
    "Bain relaxant ensemble",
    "Prenez un bain ensemble avec des bougies et de la musique douce.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Conversation du soir",
    "Instaurez un moment quotidien pour discuter de votre journée, sans téléphone.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Visite de musée ou exposition",
    "Visitez ensemble un musée ou une exposition qui vous intéresse.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Brunch du dimanche",
    "Créez une tradition de brunch dominical où vous prenez le temps de discuter.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Projet de couple",
    "Travaillez ensemble sur un projet commun (décoration, rénovation, jardin).",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Soirée spa à la maison",
    "Créez une ambiance spa à la maison et prenez soin l'un de l'autre.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Exploration culinaire",
    "Découvrez ensemble un nouveau restaurant ou cuisine ethnique.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Activité sportive ensemble",
    "Pratiquez un sport ou une activité physique ensemble régulièrement.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Méditation ou yoga en duo",
    "Partagez un moment de méditation ou de yoga ensemble.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Planification de rêves",
    "Prenez du temps pour discuter de vos rêves et projets futurs ensemble.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Concert ou spectacle",
    "Assistez ensemble à un concert, spectacle ou événement culturel.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Journée déconnexion totale",
    "Passez une journée entière ensemble sans téléphones ni écrans.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Bénévolat ensemble",
    "Engagez-vous dans une activité de bénévolat commune.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Session photo ensemble",
    "Organisez une séance photo amusante, juste pour le plaisir.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Rituel du coucher",
    "Créez un rituel de coucher paisible où vous vous retrouvez.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Voyage découverte",
    "Planifiez un voyage dans un endroit que vous voulez découvrir ensemble.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Atelier DIY",
    "Créez quelque chose ensemble lors d'un atelier créatif.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Soirée contes et histoires",
    "Partagez vos histoires préférées ou racontez-vous des anecdotes.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Dégustation de vins ou thés",
    "Organisez une dégustation à la maison avec différentes variétés.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Marché ou foire ensemble",
    "Visitez un marché local ou une foire, prenez votre temps pour flâner.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Cours de danse",
    "Apprenez à danser ensemble, que ce soit salsa, tango ou valse.",
    "MQ", COUPLE_RELATIONS, "moment"
  ),
  createGesture(
    "Journée plage ou nature",
    "Passez une journée complète à la plage ou dans la nature, sans agenda précis.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Soirée quiz maison",
    "Créez votre propre quiz sur des sujets qui vous intéressent.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Apprentissage mutuel",
    "Enseignez-vous mutuellement une compétence que vous maîtrisez.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Playlist et discussion",
    "Créez une playlist ensemble et discutez de pourquoi chaque chanson est spéciale.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Journée traditions familiales",
    "Créez et maintenez des traditions familiales régulières.",
    "MQ", ['parent'], "moment"
  ),
  createGesture(
    "Temps de gratitude",
    "Prenez un moment quotidien pour partager ce pour quoi vous êtes reconnaissants.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Exploration urbaine",
    "Explorez un quartier de votre ville que vous ne connaissez pas.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Soirée karaoké",
    "Chantez ensemble, même (surtout!) si vous chantez faux.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Projet de mémoire",
    "Créez ensemble un album photo ou un scrapbook de vos souvenirs.",
    "MQ", ALL_RELATIONS, "moment"
  ),
  createGesture(
    "Rendez-vous régulier",
    "Établissez un rendez-vous hebdomadaire non négociable, juste vous deux.",
    "MQ", COUPLE_RELATIONS, "moment"
  )
];

// ==================== SERVICES RENDUS (SR) - 50 gestes ====================
const srGestures = [
  createGesture(
    "Préparer le café du matin",
    "Préparez le café ou le petit-déjeuner de votre partenaire avant qu'il/elle ne se réveille.",
    "SR", COUPLE_RELATIONS, "service"
  ),
  createGesture(
    "Faire la vaisselle sans qu'on le demande",
    "Prenez l'initiative de faire la vaisselle spontanément.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Laver la voiture",
    "Lavez la voiture de votre partenaire en surprise.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Courses hebdomadaires",
    "Faites les courses pour toute la semaine sans qu'on vous le demande.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Préparer le repas du soir",
    "Cuisinez le dîner pour soulager votre partenaire après une longue journée.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Tondre la pelouse",
    "Occupez-vous de l'entretien du jardin ou de la pelouse.",
    "SR", ['marie', 'en_couple', 'parent'], "service"
  ),
  createGesture(
    "Ranger la maison",
    "Faites un grand ménage ou rangement sans qu'on vous le demande.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Remplir le réservoir d'essence",
    "Prenez la voiture et faites le plein d'essence.",
    "SR", COUPLE_RELATIONS, "service"
  ),
  createGesture(
    "Lessive et repassage",
    "Occupez-vous de toute la lessive et du repassage.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Réparer quelque chose",
    "Réparez ce robinet qui fuit ou cette porte qui grince depuis des semaines.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Préparer le sac pour le lendemain",
    "Préparez les affaires nécessaires pour le lendemain (sac, vêtements, lunch).",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Déneiger ou dégivrer la voiture",
    "En hiver, déneigez et dégivrez la voiture avant le départ.",
    "SR", COUPLE_RELATIONS, "service"
  ),
  createGesture(
    "Sortir les poubelles",
    "Prenez en charge cette tâche régulièrement sans rappel.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Faire les lits",
    "Faites tous les lits de la maison le matin.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Emmener les enfants à l'école",
    "Occupez-vous du trajet école pour donner une pause à votre partenaire.",
    "SR", ['parent', 'marie'], "service"
  ),
  createGesture(
    "Nettoyer la salle de bain",
    "Nettoyez en profondeur la salle de bain.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Préparer les repas de la semaine",
    "Faites du meal prep pour toute la semaine.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Passer l'aspirateur",
    "Passez l'aspirateur dans toute la maison.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Arroser les plantes",
    "Prenez en charge l'entretien de toutes les plantes.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Organiser un placard",
    "Triez et organisez un placard ou une pièce en désordre.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Laver les vitres",
    "Nettoyez toutes les vitres de la maison.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Faire les courses en ligne",
    "Commandez et faites livrer les courses pour gagner du temps.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Préparer le bain",
    "Préparez un bain relaxant avec tout ce qu'il faut (température parfaite, produits, serviettes).",
    "SR", COUPLE_RELATIONS, "service"
  ),
  createGesture(
    "Gérer les factures",
    "Prenez en charge le paiement des factures du mois.",
    "SR", COUPLE_RELATIONS, "service"
  ),
  createGesture(
    "Nettoyer le frigo",
    "Videz, nettoyez et réorganisez le réfrigérateur.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Cuisiner le plat préféré",
    "Préparez le plat préféré de votre partenaire sans occasion spéciale.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Coucher les enfants",
    "Prenez en charge toute la routine du coucher des enfants.",
    "SR", ['parent', 'marie'], "service"
  ),
  createGesture(
    "Faire une commission importante",
    "Accomplissez une course ou démarche administrative ennuyeuse à leur place.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Préparer les vêtements",
    "Sortez et préparez une tenue pour le lendemain.",
    "SR", COUPLE_RELATIONS, "service"
  ),
  createGesture(
    "Débarrasser la table",
    "Débarrassez et nettoyez après chaque repas.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Organiser le garage",
    "Triez et organisez le garage ou la cave.",
    "SR", ['marie', 'en_couple', 'parent'], "service"
  ),
  createGesture(
    "Préparer le petit-déjeuner au lit",
    "Préparez et servez le petit-déjeuner au lit le week-end.",
    "SR", COUPLE_RELATIONS, "service"
  ),
  createGesture(
    "Nettoyer après un projet",
    "Rangez et nettoyez tout après un projet ou activité.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Faire les retouches",
    "Faites les petites réparations et retouches dans la maison.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Préparer les bagages",
    "Aidez à préparer les valises pour un voyage.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Nettoyer le four",
    "Nettoyez le four en profondeur.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Gérer le courrier",
    "Triez, classez et gérez tout le courrier et les documents.",
    "SR", COUPLE_RELATIONS, "service"
  ),
  createGesture(
    "Laver les draps",
    "Changez et lavez tous les draps de la maison.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Préparer les lunch boxes",
    "Préparez les repas du midi pour toute la famille.",
    "SR", ['parent', 'marie'], "service"
  ),
  createGesture(
    "Faire le tri des vêtements",
    "Triez les vêtements à donner ou à jeter.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Nettoyer les chaussures",
    "Nettoyez et cirez toutes les chaussures.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Organiser les rendez-vous",
    "Prenez en charge l'organisation des rendez-vous médicaux ou autres.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Faire le plein de produits",
    "Vérifiez et renouvelez les produits de base (papier toilette, détergent, etc.).",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Promener le chien",
    "Occupez-vous de promener le chien régulièrement.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Préparer le thermos",
    "Préparez un thermos de café ou thé pour le trajet.",
    "SR", COUPLE_RELATIONS, "service"
  ),
  createGesture(
    "Faire les photocopies",
    "Occupez-vous des tâches administratives ennuyeuses.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Charger les appareils",
    "Assurez-vous que tous les appareils sont chargés pour le lendemain.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Nettoyer la voiture intérieur",
    "Nettoyez l'intérieur de la voiture en profondeur.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Gérer le recyclage",
    "Occupez-vous du tri et de la sortie du recyclage.",
    "SR", ALL_RELATIONS, "service"
  ),
  createGesture(
    "Organiser les photos",
    "Triez et organisez les photos numériques ou physiques.",
    "SR", ALL_RELATIONS, "service"
  )
];

// ==================== PAROLES VALORISANTES (PQ) - 50 gestes ====================
const pqGestures = [
  createGesture(
    "Compliment sincère quotidien",
    "Faites un compliment sincère et spécifique chaque jour.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Message d'amour matinal",
    "Envoyez un message tendre dès le réveil.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Lettre d'amour manuscrite",
    "Écrivez une vraie lettre d'amour à la main.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Valoriser en public",
    "Complimentez votre partenaire devant d'autres personnes.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Liste de qualités",
    "Écrivez une liste de toutes les qualités que vous admirez chez l'autre.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Message d'encouragement",
    "Envoyez un message d'encouragement avant un événement important.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Dire 'je t'aime' autrement",
    "Trouvez une nouvelle façon créative de dire 'je t'aime'.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Reconnaissance d'efforts",
    "Reconnaissez verbalement les efforts et le travail de l'autre.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Poème ou vers personnalisé",
    "Écrivez un court poème ou quelques vers pour votre partenaire.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Messages spontanés dans la journée",
    "Envoyez des petits messages affectueux tout au long de la journée.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Affirmer la beauté",
    "Dites à votre partenaire qu'il/elle est beau/belle, régulièrement.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Merci spécifique",
    "Remerciez de manière spécifique pour quelque chose de précis.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Post-it d'amour",
    "Laissez des post-it avec des messages doux un peu partout.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Valoriser les talents",
    "Soulignez un talent ou une compétence particulière de votre partenaire.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Message vocal affectueux",
    "Laissez un message vocal tendre et personnel.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Partager la fierté",
    "Dites explicitement que vous êtes fier(e) de votre partenaire.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Rappeler un souvenir heureux",
    "Partagez le souvenir d'un moment spécial partagé ensemble.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Compliment sur l'apparence",
    "Complimentez une nouvelle coupe, tenue ou look.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Dire pourquoi vous l'aimez",
    "Expliquez précisément pourquoi vous aimez cette personne.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Encouragement pour un projet",
    "Encouragez activement un projet ou un rêve de votre partenaire.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Carte de gratitude",
    "Offrez une carte avec un message de gratitude sincère.",
    "PQ", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Valoriser devant la famille",
    "Parlez positivement de votre partenaire devant la famille.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "SMS surprise au travail",
    "Envoyez un message affectueux pendant les heures de travail.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Compliment sur les qualités intérieures",
    "Soulignez une qualité de cœur ou de caractère.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Journal de gratitude partagé",
    "Tenez un journal où vous notez ce que vous appréciez chez l'autre.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Valoriser en tant que parent",
    "Dites à votre partenaire qu'il/elle est un parent formidable.",
    "PQ", ['parent', 'marie'], "message"
  ),
  createGesture(
    "Email d'amour",
    "Envoyez un email romantique et détaillé.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Affirmer la confiance",
    "Dites que vous avez confiance en l'autre et ses capacités.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Souligner une amélioration",
    "Remarquez et félicitez un progrès ou une amélioration.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Message avant de dormir",
    "Envoyez un message tendre avant de vous endormir.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Appréciation publique sur réseaux",
    "Publiez un message appréciatif sur les réseaux sociaux (si l'autre apprécie).",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Dire 'tu me manques'",
    "Exprimez clairement que l'autre vous manque.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Valoriser le style",
    "Complimentez le sens du style ou du goût de votre partenaire.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Mot doux dans le lunch",
    "Glissez un petit mot affectueux dans le sac ou la boîte à lunch.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Reconnaissance quotidienne",
    "Établissez un rituel quotidien de reconnaissance mutuelle.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Compliment sur l'intelligence",
    "Soulignez l'intelligence ou la perspicacité de votre partenaire.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Message d'appréciation détaillé",
    "Écrivez un long message détaillant tout ce que vous appréciez.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Valoriser l'humour",
    "Dites que vous adorez son sens de l'humour et que ça vous fait du bien.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Rappeler votre première rencontre",
    "Partagez ce qui vous a séduit lors de votre première rencontre.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Encouragement face à un défi",
    "Encouragez activement lors d'un défi ou d'une difficulté.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Message de soutien moral",
    "Envoyez un message de soutien pendant une période difficile.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Compliment devant les enfants",
    "Complimentez votre partenaire devant vos enfants.",
    "PQ", ['parent', 'marie'], "message"
  ),
  createGesture(
    "Dire ce qui vous inspire",
    "Exprimez comment l'autre vous inspire à être meilleur(e).",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Appréciation d'une recette",
    "Complimentez sincèrement un repas ou une préparation.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Message surprise du matin",
    "Réveillez votre partenaire avec un message vocal affectueux.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Dire merci pour la relation",
    "Remerciez simplement d'être dans votre vie.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Valoriser la force de caractère",
    "Soulignez la force, le courage ou la résilience de votre partenaire.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Message romantique inattendu",
    "Envoyez un message très romantique sans occasion particulière.",
    "PQ", COUPLE_RELATIONS, "message"
  ),
  createGesture(
    "Affirmation d'amour inconditionnel",
    "Rappelez que votre amour est inconditionnel et permanent.",
    "PQ", ALL_RELATIONS, "message"
  ),
  createGesture(
    "Compliment sur un talent créatif",
    "Valorisez une création, un projet ou une expression créative.",
    "PQ", ALL_RELATIONS, "message"
  )
];

// ==================== CADEAUX (CD) - 50 gestes ====================
const cdGestures = [
  createGesture(
    "Fleurs sans raison",
    "Offrez des fleurs un jour ordinaire, sans occasion spéciale.",
    "CD", COUPLE_RELATIONS, "cadeau"
  ),
  createGesture(
    "Livre préféré avec dédicace",
    "Offrez un livre que vous pensez qu'il/elle aimera avec une dédicace personnelle.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Chocolats favoris",
    "Ramenez les chocolats ou friandises préférées de votre partenaire.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Bijou significatif",
    "Offrez un bijou qui a une signification particulière pour vous deux.",
    "CD", COUPLE_RELATIONS, "cadeau"
  ),
  createGesture(
    "Photo encadrée",
    "Encadrez une belle photo de vous deux et offrez-la.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Objet de collection",
    "Trouvez un objet rare pour compléter une collection.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Parfum préféré",
    "Offrez une nouvelle bouteille du parfum favori.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Surprise en rentrant",
    "Laissez un petit cadeau surprise à la maison pour le retour.",
    "CD", COUPLE_RELATIONS, "cadeau"
  ),
  createGesture(
    "Cadeau fait main",
    "Créez quelque chose de vos mains spécialement pour votre partenaire.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Gadget technologique utile",
    "Offrez un gadget qui facilitera la vie quotidienne.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Bougie parfumée",
    "Offrez une belle bougie parfumée dans un parfum apprécié.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Abonnement à un service",
    "Offrez un abonnement (streaming, magazine, box mensuelle).",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Album photo personnalisé",
    "Créez un album photo avec vos meilleurs souvenirs.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Plante ou fleur vivante",
    "Offrez une belle plante pour la maison ou le bureau.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Vêtement dans son style",
    "Achetez un vêtement qui correspond parfaitement à son style.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Accessoire pratique et élégant",
    "Offrez un bel accessoire utile au quotidien (sac, portefeuille, montre).",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Coffret de soins",
    "Offrez un coffret de produits de beauté ou de soins.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Billet pour un événement",
    "Offrez des billets pour un concert, match ou spectacle.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Objet personnalisé",
    "Faites personnaliser un objet avec initiales, noms ou date spéciale.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Thé ou café spécial",
    "Offrez un thé ou café rare et de qualité.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Carte cadeau réfléchie",
    "Offrez une carte cadeau pour le magasin ou restaurant préféré.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Set de voyage",
    "Offrez un beau set de voyage pratique.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Outil pour un hobby",
    "Achetez quelque chose en lien avec un passe-temps ou passion.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Journée spa offerte",
    "Offrez un bon pour une journée spa ou massage.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Décoration pour la maison",
    "Trouvez un objet déco qui correspond au style de la maison.",
    "CD", COUPLE_RELATIONS, "cadeau"
  ),
  createGesture(
    "Livre de recettes",
    "Offrez un beau livre de recettes dans un style culinaire apprécié.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Écouteurs de qualité",
    "Offrez de bons écouteurs ou un casque audio.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Ensemble de verres élégants",
    "Offrez de beaux verres pour le vin, cocktails ou café.",
    "CD", COUPLE_RELATIONS, "cadeau"
  ),
  createGesture(
    "Puzzle ou jeu personnalisé",
    "Créez un puzzle avec une photo de vous deux ou un jeu spécial.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Coffret dégustation",
    "Offrez un coffret de dégustation (vins, fromages, chocolats).",
    "CD", COUPLE_RELATIONS, "cadeau"
  ),
  createGesture(
    "Accessoire pour voiture",
    "Offrez un accessoire pratique ou esthétique pour la voiture.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Sac à main ou sac de sport",
    "Offrez un beau sac pratique et élégant.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Kit de jardinage",
    "Offrez un ensemble d'outils ou de graines pour le jardinage.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Coffret de thés du monde",
    "Offrez une sélection de thés de différents pays.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Équipement sportif",
    "Achetez de l'équipement pour un sport pratiqué.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Porte-clés spécial",
    "Trouvez ou créez un porte-clés unique et significatif.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Calendrier personnalisé",
    "Créez un calendrier avec des photos de famille ou de couple.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Gourde design",
    "Offrez une belle gourde réutilisable.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Set de bougies décoratives",
    "Offrez un ensemble de bougies élégantes.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Statue ou figurine",
    "Trouvez une statue ou figurine en lien avec ses intérêts.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Accessoires de bureau",
    "Offrez de beaux accessoires pour égayer le bureau.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Couverture douce",
    "Offrez une couverture très douce et confortable.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Expérience cadeau",
    "Offrez un bon pour une expérience (cours de cuisine, vol en montgolfière, etc.).",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Boîte à souvenirs",
    "Offrez une belle boîte pour conserver les souvenirs précieux.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Journal intime élégant",
    "Offrez un beau carnet ou journal.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Diffuseur d'huiles essentielles",
    "Offrez un diffuseur avec des huiles essentielles.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Chaussons confortables",
    "Offrez des chaussons très confortables pour la maison.",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Set de cuisine spécialisé",
    "Offrez des ustensiles pour une cuisine spécifique (sushi, pâtisserie, etc.).",
    "CD", ALL_RELATIONS, "cadeau"
  ),
  createGesture(
    "Tirelire créative",
    "Offrez une tirelire originale pour un projet commun.",
    "CD", COUPLE_RELATIONS, "cadeau"
  ),
  createGesture(
    "Ensemble de serviettes luxueuses",
    "Offrez de belles serviettes douces et élégantes.",
    "CD", COUPLE_RELATIONS, "cadeau"
  )
];

// ==================== TOUCHER PHYSIQUE (TP) - 50 gestes ====================
const tpGestures = [
  createGesture(
    "Câlin du matin",
    "Commencez chaque journée par un câlin chaleureux.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Tenir la main spontanément",
    "Prenez la main de votre partenaire lors de promenades ou trajets.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Massage des épaules",
    "Offrez un massage des épaules après une longue journée.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Bisou sur le front",
    "Donnez un bisou tendre sur le front de manière inattendue.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Câlin par derrière",
    "Faites un câlin surprise par derrière pendant une activité.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Caresser les cheveux",
    "Caressez doucement les cheveux de votre partenaire.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Main sur l'épaule",
    "Posez une main réconfortante sur l'épaule.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Se blottir ensemble",
    "Blottissez-vous ensemble sur le canapé pour regarder un film.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Massage des pieds",
    "Offrez un massage relaxant des pieds.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Danser ensemble",
    "Dansez ensemble, enlacés, même sans musique.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Main dans le dos",
    "Placez votre main dans le bas du dos lors de déplacements.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Câlin avant de dormir",
    "Terminez chaque journée par un câlin avant de vous endormir.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Embrasser la main",
    "Embrassez délicatement la main de votre partenaire.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Frotter le dos",
    "Frottez doucement le dos de manière apaisante.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Étreinte prolongée",
    "Offrez une étreinte longue et sincère, sans se presser.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Massage du cuir chevelu",
    "Massez délicatement le cuir chevelu.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Se tenir la main au lit",
    "Tenez-vous la main avant de vous endormir.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Bisou au réveil",
    "Réveillez votre partenaire avec un doux bisou.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Accolade chaleureuse",
    "Donnez une accolade forte et réconfortante.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Appuyer sa tête",
    "Appuyez votre tête contre l'épaule de votre partenaire.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Massage complet",
    "Offrez un massage complet du corps avec huiles.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Caresser le visage",
    "Caressez tendrement le visage de votre partenaire.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Étreinte de retrouvailles",
    "Faites une longue étreinte lors des retrouvailles après une absence.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Marcher bras dessus bras dessous",
    "Marchez bras dessus bras dessous lors de promenades.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Bisou d'au revoir",
    "Ne jamais partir sans un bisou d'au revoir.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Câlin de réconfort",
    "Offrez un câlin réconfortant lors de moments difficiles.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Main sur la cuisse",
    "Posez affectueusement votre main sur la cuisse lors de trajets en voiture.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Se coller en dormant",
    "Dormez collés l'un contre l'autre.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Chatouilles ludiques",
    "Faites des chatouilles douces et ludiques.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Tape dans le dos encourageante",
    "Donnez une tape amicale et encourageante dans le dos.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Bisou surprise",
    "Donnez un bisou surprise à un moment inattendu.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Caresses pendant un film",
    "Caressez doucement le bras ou la main pendant un film.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Massage des mains",
    "Massez délicatement les mains et les doigts.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Se tenir chaud",
    "Blottissez-vous pour vous tenir chaud.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Câlin debout prolongé",
    "Restez enlacés debout pendant plusieurs minutes.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Toucher rassurant",
    "Touchez doucement pour rassurer dans une situation stressante.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Bisous papillon",
    "Faites des bisous papillon avec les cils.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Main dans la main au cinéma",
    "Tenez-vous la main pendant tout le film.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Étirer ensemble",
    "Faites des étirements ensemble avec contact physique.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Câlin groupe familial",
    "Faites un grand câlin de groupe en famille.",
    "TP", ['parent'], "physique"
  ),
  createGesture(
    "Caresser le bras",
    "Caressez doucement le bras lors de conversations.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Massage de la nuque",
    "Massez la nuque pour soulager les tensions.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Se bercer ensemble",
    "Bercez-vous doucement l'un l'autre.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "High five affectueux",
    "Transformez un high five en moment de connexion.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Enlacement en cuisinant",
    "Enlaçez votre partenaire pendant qu'il/elle cuisine.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Bisou sur la joue",
    "Donnez régulièrement des bisous tendres sur la joue.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Contact pendant le sommeil",
    "Maintenez un contact (pied, main) pendant le sommeil.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Caresser pendant une conversation",
    "Maintenez un contact physique doux pendant les discussions.",
    "TP", COUPLE_RELATIONS, "physique"
  ),
  createGesture(
    "Tape affectueuse sur la tête",
    "Donnez une petite tape affectueuse sur la tête.",
    "TP", ALL_RELATIONS, "physique"
  ),
  createGesture(
    "Proximité physique constante",
    "Restez physiquement proche lors de rassemblements sociaux.",
    "TP", COUPLE_RELATIONS, "physique"
  )
];

// Combiner tous les gestes
gesturesData.gestures = [
  ...mqGestures,
  ...srGestures,
  ...pqGestures,
  ...cdGestures,
  ...tpGestures
];

// Créer le fichier JSON
const outputPath = path.join(__dirname, '..', 'src', 'assets', 'data', 'gestures.json');
const outputDir = path.dirname(outputPath);

// Créer le dossier si nécessaire
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Écrire le fichier
fs.writeFileSync(outputPath, JSON.stringify(gesturesData, null, 2), 'utf-8');

console.log('✅ Fichier gestures.json créé avec succès!');
console.log(`📊 Total de gestes: ${gesturesData.gestures.length}`);
console.log(`📍 Emplacement: ${outputPath}`);

// Afficher les statistiques par langage
const stats = {
  MQ: gesturesData.gestures.filter(g => g.codeLangage === 'MQ').length,
  SR: gesturesData.gestures.filter(g => g.codeLangage === 'SR').length,
  PQ: gesturesData.gestures.filter(g => g.codeLangage === 'PQ').length,
  CD: gesturesData.gestures.filter(g => g.codeLangage === 'CD').length,
  TP: gesturesData.gestures.filter(g => g.codeLangage === 'TP').length
};

console.log('\n📈 Statistiques par langage:');
console.log(`   Moments de qualité (MQ): ${stats.MQ} gestes`);
console.log(`   Services rendus (SR): ${stats.SR} gestes`);
console.log(`   Paroles valorisantes (PQ): ${stats.PQ} gestes`);
console.log(`   Cadeaux (CD): ${stats.CD} gestes`);
console.log(`   Toucher physique (TP): ${stats.TP} gestes`);