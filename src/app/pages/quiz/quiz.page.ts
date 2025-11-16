import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonProgressBar,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForward } from 'ionicons/icons';
import { CurrentTestState, Question, QuestionOption, UserProfile } from '../../core/models';
import { QuizService, ScoringService, StorageService } from '../../core/services';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonProgressBar,
    IonSpinner
  ]
})
export class QuizPage implements OnInit {
  questions: Question[] = [];
  currentQuestion?: Question | null;
  currentIndex = 0;
  total = 0;
  selectedOptionId?: string;
  progress = 0;
  loading = true;
  userProfile?: UserProfile | null;
  minQuestions = 10;
  resumedFromDraft = false;

  constructor(
    private quizService: QuizService,
    private scoringService: ScoringService,
    private storageService: StorageService,
    private router: Router
  ) {
    addIcons({ arrowForward });
  }

  async ngOnInit() {
    this.userProfile = await this.storageService.getUserProfile();
    if (!this.userProfile) {
      this.router.navigate(['/profile-setup']);
      return;
    }

    await this.ensureQuestionBank();

    const resumed = await this.tryResumeQuiz();
    if (!resumed) {
      this.startNewQuiz();
    }

    this.loading = false;
  }

  loadCurrentQuestion(index: number = 0): void {
    this.currentIndex = index;
    this.currentQuestion = this.questions[this.currentIndex];
    this.progress = this.total ? (this.currentIndex + 1) / this.total : 0;
    this.selectedOptionId = undefined;
  }

  chooseOption(option: QuestionOption): void {
    this.selectedOptionId = option.id;
  }

  submitAnswer(): void {
    if (!this.currentQuestion || !this.selectedOptionId) {
      return;
    }

    const option = this.currentQuestion.options.find(o => o.id === this.selectedOptionId);
    if (!option) {
      return;
    }

    this.quizService.submitAnswer(this.currentQuestion.id, option.id, option.codeLangage);

    if (!this.quizService.nextQuestion()) {
      this.finishQuiz();
    } else {
      this.loadCurrentQuestion(this.currentIndex + 1);
      this.persistState();
    }
  }

  goPrevious(): void {
    if (this.quizService.previousQuestion()) {
      const newIndex = Math.max(this.currentIndex - 1, 0);
      this.loadCurrentQuestion(newIndex);
      this.persistState();
    }
  }

  get canGoBack(): boolean {
    return this.currentIndex > 0;
  }

  get canSubmit(): boolean {
    return !!this.selectedOptionId;
  }

  get questionCounter(): string {
    return `${this.currentIndex + 1} / ${this.total}`;
  }

  async finishQuiz(): Promise<void> {
    if (!this.userProfile) {
      return;
    }
    const answers = this.quizService.getCurrentAnswers();
    const result = this.scoringService.createTestResult(answers, this.userProfile);
    await this.storageService.saveTestResult(result);
    await this.storageService.clearCurrentTest();
    this.resumedFromDraft = false;
    this.router.navigate(['/results'], { state: { resultId: result.id } });
  }

  private async ensureQuestionBank(): Promise<void> {
    if (!this.quizService.hasQuestions()) {
      await this.quizService.loadQuestions();
    }
  }

  private startNewQuiz(): void {
    if (!this.userProfile) {
      return;
    }
    this.questions = this.quizService.initQuiz(this.userProfile);
    if (!this.questions.length) {
      console.error('Aucune question disponible');
      return;
    }
    this.total = this.quizService.getTotalQuestions();
    this.loadCurrentQuestion();
    this.resumedFromDraft = false;
    this.persistState();
  }

  private async tryResumeQuiz(): Promise<boolean> {
    if (!this.userProfile) {
      return false;
    }
    const savedState = await this.storageService.getCurrentTest();
    if (!savedState || !this.isStateCompatible(savedState)) {
      return false;
    }

    this.questions = this.quizService.restoreQuiz(savedState);
    this.total = this.quizService.getTotalQuestions();
    const targetIndex = Math.min(savedState.currentIndex, Math.max(this.questions.length - 1, 0));
    this.loadCurrentQuestion(targetIndex);
    this.resumedFromDraft = true;
    return true;
  }

  private isStateCompatible(state: CurrentTestState): boolean {
    if (!this.userProfile) {
      return false;
    }
    if (!state.questionIds || !state.questionIds.length) {
      return false;
    }
    if (!state.userProfile) {
      return true;
    }
    return state.userProfile.relationshipType === this.userProfile.relationshipType;
  }

  private async persistState(): Promise<void> {
    if (!this.userProfile || !this.questions.length) {
      return;
    }
    const state: CurrentTestState = {
      questionIds: this.questions.map(q => q.id),
      answers: this.quizService.getCurrentAnswers(),
      currentIndex: this.currentIndex,
      userProfile: this.userProfile,
      updatedAt: new Date().toISOString()
    };
    await this.storageService.saveCurrentTest(state);
  }

}
