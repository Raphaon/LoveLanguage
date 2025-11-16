import { Injectable } from '@angular/core';
import { 
  LoveLanguageCode, 
  LanguageScore, 
  TestResult, 
  QuestionAnswer,
  TestStatistics,
  UserProfile
} from '../models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {

  constructor() { }

  calculateScores(answers: QuestionAnswer[]): LanguageScore[] {
    const scoreCounts: Record<LoveLanguageCode, number> = {
      [LoveLanguageCode.MQ]: 0,
      [LoveLanguageCode.SR]: 0,
      [LoveLanguageCode.PQ]: 0,
      [LoveLanguageCode.CD]: 0,
      [LoveLanguageCode.TP]: 0
    };

    answers.forEach(answer => {
      scoreCounts[answer.codeLangage]++;
    });

    const totalAnswers = answers.length;

    const scores: LanguageScore[] = Object.entries(scoreCounts).map(([code, score]) => ({
      code: code as LoveLanguageCode,
      score: score,
      percentage: totalAnswers > 0 ? Math.round((score / totalAnswers) * 100) : 0
    }));

    return scores.sort((a, b) => b.score - a.score);
  }

  getPrimaryLanguage(scores: LanguageScore[]): LoveLanguageCode {
    if (scores.length === 0) {
      throw new Error('Aucun score disponible');
    }
    return scores[0].code;
  }

  getSecondaryLanguage(scores: LanguageScore[]): LoveLanguageCode | undefined {
    if (scores.length < 2) {
      return undefined;
    }
    
    if (scores[0].score === scores[1].score) {
      return scores.length > 2 ? scores[2].code : undefined;
    }
    
    return scores[1].code;
  }

  getDominantLanguages(scores: LanguageScore[]): LoveLanguageCode[] {
    if (scores.length === 0) {
      return [];
    }

    const maxScore = scores[0].score;
    return scores
      .filter(s => s.score === maxScore)
      .map(s => s.code);
  }

  createTestResult(
    answers: QuestionAnswer[],
    userProfile: UserProfile
  ): TestResult {
    const scores = this.calculateScores(answers);
    const primaryLanguage = this.getPrimaryLanguage(scores);
    const secondaryLanguage = this.getSecondaryLanguage(scores);

    const result: TestResult = {
      id: uuidv4(),
      date: new Date(),
      userProfile: userProfile,
      answers: answers,
      scores: scores,
      langagePrincipal: primaryLanguage,
      langageSecondaire: secondaryLanguage,
      totalQuestions: answers.length
    };

    return result;
  }

  calculateStatistics(result: TestResult): TestStatistics {
    const scores = result.scores;
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const averageScore = totalScore / scores.length;

    const highestScore = scores[0];
    const lowestScore = scores[scores.length - 1];

    const scoreDifference = highestScore.percentage - lowestScore.percentage;
    const isBalanced = scoreDifference <= 20;

    const dominantLanguages = this.getDominantLanguages(scores);

    return {
      averageScore,
      highestScore,
      lowestScore,
      isBalanced,
      dominantLanguages
    };
  }

  isTestComplete(answers: QuestionAnswer[], minQuestions: number = 10): boolean {
    return answers.length >= minQuestions;
  }

  getResultMessage(result: TestResult): string {
    const stats = this.calculateStatistics(result);

    if (stats.dominantLanguages.length > 1) {
      return `Vous avez plusieurs langages d'amour dominants ! Cela signifie que vous appréciez différentes formes d'attention de manière équilibrée.`;
    }

    if (stats.isBalanced) {
      return `Vos scores sont équilibrés. Vous appréciez diverses formes d'attention, avec une préférence pour ${result.langagePrincipal}.`;
    }

    return `Votre langage d'amour principal est clairement ${result.langagePrincipal}. C'est ainsi que vous vous sentez le plus aimé(e).`;
  }

  compareResults(result1: TestResult, result2: TestResult): {
    commonLanguages: LoveLanguageCode[];
    differences: { language: LoveLanguageCode; diff: number }[];
    compatibility: number;
  } {
    const commonLanguages: LoveLanguageCode[] = [];
    const differences: { language: LoveLanguageCode; diff: number }[] = [];

    result1.scores.forEach(score1 => {
      const score2 = result2.scores.find(s => s.code === score1.code);
      if (score2) {
        const diff = Math.abs(score1.percentage - score2.percentage);
        differences.push({ language: score1.code, diff });
        
        if (diff <= 15) {
          commonLanguages.push(score1.code);
        }
      }
    });

    const avgDiff = differences.reduce((sum, d) => sum + d.diff, 0) / differences.length;
    const compatibility = Math.max(0, Math.min(100, 100 - avgDiff));

    return {
      commonLanguages,
      differences: differences.sort((a, b) => b.diff - a.diff),
      compatibility: Math.round(compatibility)
    };
  }
}