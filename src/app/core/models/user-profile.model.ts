/**
 * Types de relation pour adapter les questions et suggestions
 */
export enum RelationshipType {
  CELIBATAIRE = 'celibataire',
  EN_COUPLE = 'en_couple',
  FIANCE = 'fiance',
  MARIE = 'marie',
  PARENT = 'parent'
}

/**
 * Labels affichables pour les types de relation
 */
export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
  [RelationshipType.CELIBATAIRE]: 'Célibataire',
  [RelationshipType.EN_COUPLE]: 'En couple',
  [RelationshipType.FIANCE]: 'Fiancé(e)',
  [RelationshipType.MARIE]: 'Marié(e)',
  [RelationshipType.PARENT]: 'Parent'
};

/**
 * Icônes pour chaque type de relation
 */
export const RELATIONSHIP_TYPE_ICONS: Record<RelationshipType, string> = {
  [RelationshipType.CELIBATAIRE]: 'person-outline',
  [RelationshipType.EN_COUPLE]: 'heart-outline',
  [RelationshipType.FIANCE]: 'heart-circle-outline',
  [RelationshipType.MARIE]: 'heart-circle',
  [RelationshipType.PARENT]: 'people-outline'
};

/**
 * Profil utilisateur
 */
export interface UserProfile {
  prenom?: string;
  relationshipType: RelationshipType;
  createdAt: Date;
  updatedAt?: Date;
}