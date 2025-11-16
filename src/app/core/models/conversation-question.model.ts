export type QuestionTheme =
  | 'enfance'
  | 'valeurs'
  | 'relations'
  | 'amour'
  | 'reves'
  | 'spiritualite'
  | 'personnalite'
  | 'loisirs'
  | 'travail'
  | 'famille'
  | 'culture'
  | 'bonus';

export type QuestionDepth = 'leger' | 'moyen' | 'profond';

export interface ConversationQuestion {
  id: string;
  texte: string;
  theme: QuestionTheme;
  depth: QuestionDepth;
  tags?: string[];
}

export interface ConversationQuestionData {
  version: string;
  lastUpdated: string;
  questions: ConversationQuestion[];
}
