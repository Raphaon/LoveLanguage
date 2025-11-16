import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LoveLanguageQuizService } from '../../core/services/love-language-quiz.service';
import { LoveLanguageCode, QuizResultSummary } from '../../core/models';

@Component({
  selector: 'app-love-language-result',
  templateUrl: './love-language-result.page.html',
  styleUrls: ['./love-language-result.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButton]
})
export class LoveLanguageResultPage implements OnInit {
  summary?: QuizResultSummary;
  scoreEntries: { code: LoveLanguageCode; label: string; value: number }[] = [];

  constructor(
    private readonly quizService: LoveLanguageQuizService,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.quizService.isQuizComplete()) {
      this.router.navigate(['/quiz']);
      return;
    }

    try {
      this.summary = this.quizService.computeResultSummary();
      this.scoreEntries = this.summary ? this.buildScoreEntries(this.summary) : [];
    } catch (error) {
      console.error('Impossible de générer les résultats du quiz.', error);
      this.quizService.resetQuiz();
      this.router.navigate(['/quiz']);
    }
  }

  getScoreFor(code: LoveLanguageCode): number {
    if (!this.summary) {
      return 0;
    }
    const key = code as keyof typeof this.summary.scores;
    return this.summary.scores[key];
  }

  restart(): void {
    this.quizService.resetQuiz();
    this.router.navigate(['/quiz']);
  }

  private buildScoreEntries(summary: QuizResultSummary): { code: LoveLanguageCode; label: string; value: number }[] {
    return (Object.keys(summary.scores) as LoveLanguageCode[]).map(code => ({
      code,
      label: this.quizService.getLanguageMeta(code).label,
      value: summary.scores[code]
    }));
  }
}
