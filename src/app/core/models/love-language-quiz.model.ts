import { LoveLanguageCode } from './love-language.model';

/**
 * Metadata for a single love language (code, display label and helper text).
 */
export interface LoveLanguageMeta {
  code: LoveLanguageCode;
  label: string;
  description: string;
}

/**
 * Possible answer for a question – the `languageCode` drives scoring.
 */
export interface QuizOption {
  id: string;
  label: string;
  text: string;
  languageCode: LoveLanguageCode;
}

/**
 * Question asked during the quiz (1 question displayed at a time).
 */
export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

/**
 * Snapshot of the raw scores, one entry per love language.
 */
export interface QuizScores {
  MQ: number;
  SR: number;
  PQ: number;
  CD: number;
  TP: number;
}

/**
 * Histogram-ready entry.
 */
export interface HistogramDatum {
  code: LoveLanguageCode;
  label: string;
  score: number;
}

/**
 * Convenience structure for displaying quiz completion information in the UI.
 */
export interface QuizCompletionSnapshot {
  answered: number;
  total: number;
  progress: number; // between 0 and 1
  isComplete: boolean;
}

/**
 * All the data required by the results page (scores, highlighted languages,
 * histogram entries and context).
 */
export interface QuizResultSummary {
  scores: QuizScores;
  mainLanguage: LoveLanguageMeta;
  secondaryLanguage?: LoveLanguageMeta;
  histogramData: HistogramDatum[];
  answeredQuestions: number;
  totalQuestions: number;
}
