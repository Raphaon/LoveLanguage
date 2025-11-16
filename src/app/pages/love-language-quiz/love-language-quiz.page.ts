import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonProgressBar,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LoveLanguageQuizService } from '../../core/services/love-language-quiz.service';
import { QuizOption, QuizQuestion } from '../../core/models';

@Component({
  selector: 'app-love-language-quiz',
  templateUrl: './love-language-quiz.page.html',
  styleUrls: ['./love-language-quiz.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonProgressBar, IonButton]
})
export class LoveLanguageQuizPage implements OnInit {
  questions: QuizQuestion[] = [];
  currentQuestion: QuizQuestion | null = null;
  currentIndex = 0;
  totalQuestions = 0;
  progressValue = 0;

  constructor(
    private readonly quizService: LoveLanguageQuizService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.startQuiz();
  }

  get hasQuestions(): boolean {
    return this.totalQuestions > 0 && !!this.currentQuestion;
  }

  get questionCounter(): string {
    if (!this.totalQuestions) {
      return '0 / 0';
    }
    return `${this.currentIndex + 1} / ${this.totalQuestions}`;
  }

  onSelectOption(option: QuizOption): void {
    if (!this.currentQuestion) {
      return;
    }

    this.quizService.answerQuestion(this.currentQuestion.id, option);
    const nextIndex = this.currentIndex + 1;

    if (nextIndex < this.totalQuestions) {
      this.loadQuestion(nextIndex);
    } else {
      this.router.navigate(['/quiz-result']);
    }
  }

  restartQuiz(): void {
    this.startQuiz();
  }

  private startQuiz(): void {
    this.quizService.resetQuiz();
    this.questions = this.quizService.getQuestions();
    this.totalQuestions = this.quizService.getTotalQuestions();
    this.loadQuestion(0);
  }

  private loadQuestion(index: number): void {
    if (!this.questions.length || index < 0 || index >= this.questions.length) {
      this.currentQuestion = null;
      this.currentIndex = 0;
      this.progressValue = 0;
      return;
    }

    this.currentIndex = index;
    this.currentQuestion = this.questions[index];
    this.progressValue = this.totalQuestions ? (index + 1) / this.totalQuestions : 0;
  }
}
