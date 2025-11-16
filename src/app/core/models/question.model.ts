import { LoveLanguageCode } from './love-language.model';
import { RelationshipType } from './user-profile.model';

/**
 * Option de réponse pour une question
 */
export interface QuestionOption {
  id: string;
  label: string; // A, B, C, D, E
  texte: string;
  codeLangage: LoveLanguageCode;
}

/**
 * Question du quiz
 */
export interface Question {
  id: string;
  texte: string;
  ordre: number;
  actif: boolean;
  // Conditions d'affichage selon le profil (undefined = pour tous)
  relationshipTypes?: RelationshipType[];
  options: QuestionOption[];
}

/**
 * Réponse d'un utilisateur à une question
 */
export interface QuestionAnswer {
  questionId: string;
  selectedOptionId: string;
  codeLangage: LoveLanguageCode;
  timestamp: Date;
}

/**
 * Conteneur pour toutes les questions
 */
export interface QuestionData {
  questions: Question[];
  version: string; // Pour gérer les mises à jour futures
  lastUpdated: string; // ISO date string
}