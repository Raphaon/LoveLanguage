import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Question, 
  QuestionAnswer, 
  QuestionData,
  UserProfile,
  RelationshipType
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: Question[] = [];
  private currentQuestionIndex$ = new BehaviorSubject<number>(0);
  private answers$ = new BehaviorSubject<QuestionAnswer[]>([]);
  private filteredQuestions: Question[] = [];

  private readonly MIN_QUESTIONS = 10;
  private readonly MAX_QUESTIONS = 20;
  private readonly PREFERRED_QUESTIONS = 15;

  constructor(private http: HttpClient) { }

  async loadQuestions(): Promise<void> {
    try {
      const data = await this.http.get<QuestionData>('assets/data/questions.json').toPromise();
      if (data && data.questions) {
        this.questions = data.questions.filter(q => q.actif);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
      throw error;
    }
  }

  initQuiz(userProfile: UserProfile): Question[] {
    const eligibleQuestions = this.questions.filter(q => {
      if (!q.relationshipTypes || q.relationshipTypes.length === 0) {
        return true;
      }
      return q.relationshipTypes.includes(userProfile.relationshipType);
    });

    this.filteredQuestions = this.selectQuestions(eligibleQuestions);
    
    this.currentQuestionIndex$.next(0);
    this.answers$.next([]);

    return this.filteredQuestions;
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
  }

  getCurrentAnswers(): QuestionAnswer[] {
    return this.answers$.value;
  }
}