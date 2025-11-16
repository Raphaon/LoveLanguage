import { Injectable } from '@angular/core';
import {
  LOVE_LANGUAGES_DATA,
  LoveLanguageCode,
  LoveLanguageMeta,
  QuizOption,
  QuizQuestion,
  QuizResultSummary,
  QuizScores
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class LoveLanguageQuizService {
  private readonly questions: QuizQuestion[] = [
    {
      id: 'q1',
      text: "C'est ton anniversaire, qu'est-ce qui te ferait le plus plaisir ?",
      options: [
        { id: 'q1-a', label: 'A', text: 'Une journée entière ensemble à faire une activité que tu aimes', languageCode: LoveLanguageCode.MQ },
        { id: 'q1-b', label: 'B', text: 'Quelqu\'un prépare ou organise tout pour toi', languageCode: LoveLanguageCode.SR },
        { id: 'q1-c', label: 'C', text: 'Recevoir un mot rempli d\'attention', languageCode: LoveLanguageCode.PQ },
        { id: 'q1-d', label: 'D', text: 'Ouvrir un cadeau choisi avec soin', languageCode: LoveLanguageCode.CD },
        { id: 'q1-e', label: 'E', text: 'Un long câlin ou un massage relaxant', languageCode: LoveLanguageCode.TP }
      ]
    },
    {
      id: 'q2',
      text: 'Après une longue journée, qu\'est-ce qui te ferait du bien ?',
      options: [
        { id: 'q2-a', label: 'A', text: 'Discuter calmement autour d\'un repas', languageCode: LoveLanguageCode.MQ },
        { id: 'q2-b', label: 'B', text: 'Que quelqu\'un prenne en charge tes tâches', languageCode: LoveLanguageCode.SR },
        { id: 'q2-c', label: 'C', text: 'Recevoir un message encourageant', languageCode: LoveLanguageCode.PQ },
        { id: 'q2-d', label: 'D', text: 'Trouver une petite surprise qui t\'attend', languageCode: LoveLanguageCode.CD },
        { id: 'q2-e', label: 'E', text: 'Être pris dans les bras', languageCode: LoveLanguageCode.TP }
      ]
    },
    {
      id: 'q3',
      text: "Quand tu veux remercier quelqu'un, tu préfères...",
      options: [
        { id: 'q3-a', label: 'A', text: 'Passer un moment privilégié avec la personne', languageCode: LoveLanguageCode.MQ },
        { id: 'q3-b', label: 'B', text: 'Lui rendre un service en retour', languageCode: LoveLanguageCode.SR },
        { id: 'q3-c', label: 'C', text: 'Lui dire à quel point tu apprécies ce qu\'elle a fait', languageCode: LoveLanguageCode.PQ },
        { id: 'q3-d', label: 'D', text: 'Offrir un petit présent symbolique', languageCode: LoveLanguageCode.CD },
        { id: 'q3-e', label: 'E', text: 'Faire un high-five ou un câlin', languageCode: LoveLanguageCode.TP }
      ]
    },
    {
      id: 'q4',
      text: 'Dans une relation, tu te sens vraiment aimé(e) quand...',
      options: [
        { id: 'q4-a', label: 'A', text: 'On te consacre du temps exclusif', languageCode: LoveLanguageCode.MQ },
        { id: 'q4-b', label: 'B', text: 'On t\'aide concrètement dans le quotidien', languageCode: LoveLanguageCode.SR },
        { id: 'q4-c', label: 'C', text: 'On te dit souvent des mots doux', languageCode: LoveLanguageCode.PQ },
        { id: 'q4-d', label: 'D', text: 'On t\'offre des petites attentions matérielles', languageCode: LoveLanguageCode.CD },
        { id: 'q4-e', label: 'E', text: 'On te touche avec tendresse', languageCode: LoveLanguageCode.TP }
      ]
    },
    {
      id: 'q5',
      text: 'Quel geste te rassure le plus avant un moment important ?',
      options: [
        { id: 'q5-a', label: 'A', text: 'Partager un moment calme ensemble', languageCode: LoveLanguageCode.MQ },
        { id: 'q5-b', label: 'B', text: 'Quelqu\'un t\'aide à tout préparer', languageCode: LoveLanguageCode.SR },
        { id: 'q5-c', label: 'C', text: 'Entendre des mots de soutien', languageCode: LoveLanguageCode.PQ },
        { id: 'q5-d', label: 'D', text: 'Recevoir un porte-bonheur ou une carte', languageCode: LoveLanguageCode.CD },
        { id: 'q5-e', label: 'E', text: 'Obtenir une étreinte rassurante', languageCode: LoveLanguageCode.TP }
      ]
    }
  ];

  private readonly languageMetas: LoveLanguageMeta[] = LOVE_LANGUAGES_DATA.map(language => ({
    code: language.code,
    label: language.label,
    description: language.descriptionCourte
  }));

  private scores: QuizScores = this.createEmptyScores();
  private answers = new Map<string, QuizOption>();
  private lastSummary: QuizResultSummary | null = null;

  getQuestions(): QuizQuestion[] {
    return [...this.questions];
  }

  getQuestionByIndex(index: number): QuizQuestion | null {
    if (index < 0 || index >= this.questions.length) {
      return null;
    }
    return this.questions[index];
  }

  getTotalQuestions(): number {
    return this.questions.length;
  }

  resetQuiz(): void {
    this.scores = this.createEmptyScores();
    this.answers.clear();
    this.lastSummary = null;
  }

  answerQuestion(questionId: string, option: QuizOption): void {
    if (!option) {
      return;
    }

    const previous = this.answers.get(questionId);
    if (previous) {
      this.updateScore(previous.languageCode, -1);
    }

    this.answers.set(questionId, option);
    this.updateScore(option.languageCode, 1);
  }

  getScores(): QuizScores {
    return { ...this.scores };
  }

  hasAnyAnswer(): boolean {
    return this.answers.size > 0;
  }

  getAnsweredQuestionCount(): number {
    return this.answers.size;
  }

  isQuizComplete(): boolean {
    return this.answers.size === this.questions.length;
  }

  computeResultSummary(): QuizResultSummary {
    const histogramData = this.languageMetas.map(meta => ({
      code: meta.code,
      label: meta.label,
      score: this.scores[this.asScoreKey(meta.code)]
    }));

    const sorted = [...histogramData].sort((a, b) => b.score - a.score);
    const mainMeta = this.findMeta(sorted[0]?.code);
    const secondaryMeta = sorted[1] && sorted[1].score > 0 ? this.findMeta(sorted[1].code) : undefined;

    const summary: QuizResultSummary = {
      scores: this.getScores(),
      mainLanguage: mainMeta,
      secondaryLanguage: secondaryMeta,
      histogramData
    };

    this.lastSummary = summary;
    return summary;
  }

  getLastSummary(): QuizResultSummary | null {
    return this.lastSummary;
  }

  private findMeta(code?: LoveLanguageCode): LoveLanguageMeta {
    const fallback = this.languageMetas[0];
    if (!code) {
      return fallback;
    }
    return this.languageMetas.find(meta => meta.code === code) || fallback;
  }

  private asScoreKey(code: LoveLanguageCode): keyof QuizScores {
    return code as keyof QuizScores;
  }

  private updateScore(code: LoveLanguageCode, delta: number): void {
    const key = this.asScoreKey(code);
    this.scores[key] = Math.max(0, (this.scores[key] || 0) + delta);
  }

  private createEmptyScores(): QuizScores {
    return {
      MQ: 0,
      SR: 0,
      PQ: 0,
      CD: 0,
      TP: 0
    };
  }
}
