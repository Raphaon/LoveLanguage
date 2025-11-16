/**
 * Codes des 5 langages d'amour
 */
export enum LoveLanguageCode {
  MQ = 'MQ', // Moments de qualité
  SR = 'SR', // Services rendus
  PQ = 'PQ', // Paroles valorisantes
  CD = 'CD', // Cadeaux
  TP = 'TP'  // Toucher physique
}

/**
 * Interface pour un langage d'amour
 */
export interface LoveLanguage {
  code: LoveLanguageCode;
  label: string;
  icon: string; // Nom de l'icône Ionic
  descriptionCourte: string;
  descriptionDetaillee: string;
  color: string; // Code couleur hex
  emoji?: string; // Emoji optionnel pour UI
}

/**
 * Données complètes des langages d'amour
 */
export const LOVE_LANGUAGES_DATA: LoveLanguage[] = [
  {
    code: LoveLanguageCode.MQ,
    label: 'Moments de qualité',
    icon: 'time-outline',
    emoji: '⏰',
    descriptionCourte: 'Vous vous sentez aimé(e) quand on vous accorde du temps et de l\'attention.',
    descriptionDetaillee: 'Pour vous, rien ne vaut des moments de qualité passés ensemble, sans distraction. Les conversations profondes, les activités partagées et la présence authentique sont essentielles. Vous appréciez quand quelqu\'un met son téléphone de côté pour être pleinement présent avec vous.',
    color: '#FF6B9D'
  },
  {
    code: LoveLanguageCode.SR,
    label: 'Services rendus',
    icon: 'hand-right-outline',
    emoji: '🤝',
    descriptionCourte: 'Les actions valent mille mots pour vous.',
    descriptionDetaillee: 'Vous vous sentez aimé(e) quand quelqu\'un fait quelque chose pour vous faciliter la vie. Les gestes concrets d\'aide et de soutien sont votre langage d\'amour. Cuisiner, faire les courses, réparer quelque chose - ces actions parlent plus fort que les mots.',
    color: '#4ECDC4'
  },
  {
    code: LoveLanguageCode.PQ,
    label: 'Paroles valorisantes',
    icon: 'chatbubble-outline',
    emoji: '💬',
    descriptionCourte: 'Les mots d\'encouragement et de reconnaissance vous touchent profondément.',
    descriptionDetaillee: 'Pour vous, les mots ont un pouvoir immense. Les compliments sincères, les encouragements, les "je t\'aime", les remerciements et les paroles de reconnaissance vous nourrissent émotionnellement. Les critiques vous affectent également plus profondément.',
    color: '#FFE66D'
  },
  {
    code: LoveLanguageCode.CD,
    label: 'Cadeaux',
    icon: 'gift-outline',
    emoji: '🎁',
    descriptionCourte: 'Un cadeau symbolise l\'amour et l\'attention qu\'on vous porte.',
    descriptionDetaillee: 'Pour vous, recevoir un cadeau est la preuve tangible que quelqu\'un a pensé à vous. Ce n\'est pas le prix qui compte, mais l\'attention et la réflexion derrière le geste. Un cadeau bien choisi montre que l\'on vous connaît et que l\'on prend soin de vous.',
    color: '#A8E6CF'
  },
  {
    code: LoveLanguageCode.TP,
    label: 'Toucher physique',
    icon: 'heart-outline',
    emoji: '🤗',
    descriptionCourte: 'Le contact physique est votre principal moyen de vous sentir connecté(e).',
    descriptionDetaillee: 'Pour vous, les câlins, les baisers, tenir la main, les caresses ou même une main sur l\'épaule sont essentiels. Le toucher physique approprié vous apaise, vous rassure et vous fait sentir aimé(e). L\'absence de contact vous fait vous sentir distant(e) et déconnecté(e).',
    color: '#C7CEEA'
  }
];