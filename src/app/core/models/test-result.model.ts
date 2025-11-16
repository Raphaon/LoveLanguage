import { LoveLanguageCode } from './love-language.model';
import { UserProfile } from './user-profile.model';
import { QuestionAnswer } from './question.model';

/**
 * Score pour un langage d'amour
 */
export interface LanguageScore {
  code: LoveLanguageCode;
  score: number; // Nombre de réponses
  percentage: number; // Pourcentage du total
}

/**
 * Résultat complet d'un test
 */
export interface TestResult {
  id: string;
  userId?: string; // Pour V2 avec comptes
  date: Date;
  userProfile: UserProfile;
  answers: QuestionAnswer[]; // Historique des réponses
  scores: LanguageScore[];
  langagePrincipal: LoveLanguageCode;
  langageSecondaire?: LoveLanguageCode;
  totalQuestions: number;
}

/**
 * Statistiques calculées à partir des résultats
 */
export interface TestStatistics {
  averageScore: number;
  highestScore: LanguageScore;
  lowestScore: LanguageScore;
  isBalanced: boolean; // True si les scores sont proches
  dominantLanguages: LoveLanguageCode[]; // Si plusieurs langages dominants
}