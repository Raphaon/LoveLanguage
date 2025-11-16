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

  constructor(
    private readonly quizService: LoveLanguageQuizService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (!this.quizService.hasAnyAnswer()) {
      this.router.navigate(['/quiz']);
      return;
    }

    this.summary = this.quizService.computeResultSummary();
  }

  get scoreEntries(): { label: string; value: number }[] {
    if (!this.summary) {
      return [];
    }

    return Object.entries(this.summary.scores).map(([label, value]) => ({ label, value }));
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
}
