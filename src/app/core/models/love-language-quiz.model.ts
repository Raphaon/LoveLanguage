import { LoveLanguageCode } from './love-language.model';

export interface LoveLanguageMeta {
  code: LoveLanguageCode;
  label: string;
  description: string;
}

export interface QuizOption {
  id: string;
  label: string;
  text: string;
  languageCode: LoveLanguageCode;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizScores {
  MQ: number;
  SR: number;
  PQ: number;
  CD: number;
  TP: number;
}

export interface QuizResultSummary {
  scores: QuizScores;
  mainLanguage: LoveLanguageMeta;
  secondaryLanguage?: LoveLanguageMeta;
  histogramData: { code: LoveLanguageCode; label: string; score: number }[];
}
