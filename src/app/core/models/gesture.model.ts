import { LoveLanguageCode } from './love-language.model';
import { RelationshipType } from './user-profile.model';

/**
 * Catégories de gestes
 */
export enum GestureCategory {
  CADEAU = 'cadeau',
  MOMENT = 'moment',
  SERVICE = 'service',
  MESSAGE = 'message',
  PHYSIQUE = 'physique',
  AUTRE = 'autre'
}

/**
 * Labels pour les catégories
 */
export const GESTURE_CATEGORY_LABELS: Record<GestureCategory, string> = {
  [GestureCategory.CADEAU]: 'Cadeau',
  [GestureCategory.MOMENT]: 'Moment à partager',
  [GestureCategory.SERVICE]: 'Service rendu',
  [GestureCategory.MESSAGE]: 'Message / Parole',
  [GestureCategory.PHYSIQUE]: 'Geste physique',
  [GestureCategory.AUTRE]: 'Autre'
};

/**
 * Icônes pour les catégories
 */
export const GESTURE_CATEGORY_ICONS: Record<GestureCategory, string> = {
  [GestureCategory.CADEAU]: 'gift-outline',
  [GestureCategory.MOMENT]: 'time-outline',
  [GestureCategory.SERVICE]: 'hand-right-outline',
  [GestureCategory.MESSAGE]: 'chatbubble-outline',
  [GestureCategory.PHYSIQUE]: 'heart-outline',
  [GestureCategory.AUTRE]: 'sparkles-outline'
};

/**
 * Interface pour un geste / idée cadeau
 */
export interface Gesture {
  id: string;
  title: string;
  description: string;
  codeLangage: LoveLanguageCode;
  relationshipTypes: RelationshipType[];
  categorie: GestureCategory;
  difficulte?: 'facile' | 'moyen' | 'difficile'; // Optionnel pour V2
  cout?: 'gratuit' | 'peu_cher' | 'moyen' | 'cher'; // Optionnel pour V2
  isFavorite?: boolean; // Géré côté client
}

/**
 * Conteneur pour tous les gestes
 */
export interface GestureData {
  gestures: Gesture[];
  version: string;
  lastUpdated: string;
}

/**
 * Filtres pour rechercher des gestes
 */
export interface GestureFilter {
  codeLangage?: LoveLanguageCode;
  relationshipType?: RelationshipType;
  categorie?: GestureCategory;
  searchText?: string;
  favoritesOnly?: boolean;
}