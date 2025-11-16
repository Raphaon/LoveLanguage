import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import {
  Question,
  QuestionAnswer,
  QuestionData,
  UserProfile,
  CurrentTestState
} from '../models';
import { ProceduralQuestionService } from './procedural-question.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: Question[] = [];
  private proceduralQuestions: Question[] = [];
  private currentQuestionIndex$ = new BehaviorSubject<number>(0);
  private answers$ = new BehaviorSubject<QuestionAnswer[]>([]);
  private filteredQuestions: Question[] = [];
  private loaded = false;
  private loadingPromise?: Promise<void>;

  private readonly MIN_QUESTIONS = 10;
  private readonly MAX_QUESTIONS = 20;
  private readonly PREFERRED_QUESTIONS = 15;

  constructor(
    private http: HttpClient,
    private proceduralQuestionService: ProceduralQuestionService
  ) { }

  async loadQuestions(): Promise<void> {
    if (this.loaded && this.questions.length) {
      return;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        const data = await firstValueFrom(
          this.http.get<QuestionData>('assets/data/questions.json')
        );
        if (data?.questions) {
          this.questions = data.questions
            .filter(q => q.actif)
            .map(question => ({ ...question, source: 'static' as const }));
          this.loaded = true;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
        throw error;
      } finally {
        this.loadingPromise = undefined;
      }
    })();

    return this.loadingPromise;
  }

  async initQuiz(userProfile: UserProfile): Promise<Question[]> {
    if (!this.loaded || !this.questions.length) {
      await this.loadQuestions();
    }

    const eligibleQuestions = this.questions.filter(q => {
      if (!q.relationshipTypes || q.relationshipTypes.length === 0) {
        return true;
      }
      return q.relationshipTypes.includes(userProfile.relationshipType);
    });

    const curatedQuestions = this.selectQuestions(eligibleQuestions);
    const missingQuestions = Math.max(this.PREFERRED_QUESTIONS - curatedQuestions.length, 0);
    this.proceduralQuestions = missingQuestions > 0
      ? await this.proceduralQuestionService.generateQuestions(userProfile, missingQuestions)
      : [];

    this.filteredQuestions = [...curatedQuestions, ...this.proceduralQuestions]
      .slice(0, this.MAX_QUESTIONS)
      .sort((a, b) => a.ordre - b.ordre);

    this.currentQuestionIndex$.next(0);
    this.answers$.next([]);

    return this.filteredQuestions;
  }

  hasQuestions(): boolean {
    return this.questions.length > 0;
  }

  private selectQuestions(availableQuestions: Question[]): Question[] {
    const sorted = [...availableQuestions].sort((a, b) => a.ordre - b.ordre);

    if (sorted.length <= this.PREFERRED_QUESTIONS) {
      return sorted.slice(0, Math.max(this.MIN_QUESTIONS, sorted.length));
    }

    return this.balanceQuestions(sorted, this.PREFERRED_QUESTIONS);
  }

  private balanceQuestions(questions: Question[], targetCount: number): Question[] {
    const selected: Question[] = [];
    const remaining = [...questions];

    while (selected.length < targetCount && remaining.length > 0) {
      const question = remaining.shift();
      if (question) {
        selected.push(question);
      }
    }

    return selected.sort((a, b) => a.ordre - b.ordre);
  }

  restoreQuiz(state: CurrentTestState): Question[] {
    const orderedQuestions = state.questionIds
      .map(id => this.findQuestionById(id))
      .filter((q): q is Question => !!q);

    this.filteredQuestions = orderedQuestions;
    const normalizedAnswers = (state.answers || []).map(answer => ({
      ...answer,
      timestamp: answer.timestamp ? new Date(answer.timestamp) : new Date()
    }));

    this.answers$.next(normalizedAnswers);
    const safeIndex = Math.min(state.currentIndex, Math.max(this.filteredQuestions.length - 1, 0));
    this.currentQuestionIndex$.next(safeIndex);

    return this.filteredQuestions;
  }

  getCurrentQuestion(): Question | null {
    const index = this.currentQuestionIndex$.value;
    return this.filteredQuestions[index] || null;
  }

  getCurrentQuestionIndex(): Observable<number> {
    return this.currentQuestionIndex$.asObservable();
  }

  getAnswers(): Observable<QuestionAnswer[]> {
    return this.answers$.asObservable();
  }

  submitAnswer(questionId: string, optionId: string, codeLangage: any): void {
    const answer: QuestionAnswer = {
      questionId,
      selectedOptionId: optionId,
      codeLangage,
      timestamp: new Date()
    };

    const currentAnswers = this.answers$.value;
    this.answers$.next([...currentAnswers, answer]);
  }

  nextQuestion(): boolean {
    const currentIndex = this.currentQuestionIndex$.value;
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.filteredQuestions.length) {
      this.currentQuestionIndex$.next(nextIndex);
      return true;
    }
    return false;
  }

  previousQuestion(): boolean {
    const currentIndex = this.currentQuestionIndex$.value;
    if (currentIndex > 0) {
      this.currentQuestionIndex$.next(currentIndex - 1);
      
      const currentAnswers = this.answers$.value;
      this.answers$.next(currentAnswers.slice(0, -1));
      
      return true;
    }
    return false;
  }

  getProgress(): number {
    const current = this.currentQuestionIndex$.value + 1;
    const total = this.filteredQuestions.length;
    return Math.round((current / total) * 100);
  }

  isQuizComplete(): boolean {
    return this.currentQuestionIndex$.value >= this.filteredQuestions.length - 1 &&
           this.answers$.value.length >= this.MIN_QUESTIONS;
  }

  getTotalQuestions(): number {
    return this.filteredQuestions.length;
  }

  getAnsweredQuestionsCount(): number {
    return this.answers$.value.length;
  }

  resetQuiz(): void {
    this.currentQuestionIndex$.next(0);
    this.answers$.next([]);
    this.filteredQuestions = [];
    this.proceduralQuestions = [];
    this.loaded = this.questions.length > 0;
  }

  getCurrentAnswers(): QuestionAnswer[] {
    return this.answers$.value;
  }

  private findQuestionById(id: string): Question | undefined {
    return this.questions.find(q => q.id === id) ||
      this.proceduralQuestions.find(q => q.id === id);
  }
}