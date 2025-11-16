import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ConversationQuestion, ConversationQuestionData, QuestionDepth, QuestionTheme } from '../models';
import { StorageService } from './storage.service';

interface ConversationFilter {
  theme?: QuestionTheme;
  depth?: QuestionDepth;
}

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private questions: ConversationQuestion[] = [];
  private history: string[] = [];
  private favorites: string[] = [];
  private loaded = false;
  private loadingPromise?: Promise<void>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.loadFavorites();
  }

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
          this.http.get<ConversationQuestionData>('assets/data/conversation-questions.json')
        );
        if (data?.questions) {
          this.questions = data.questions;
          this.loaded = true;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des questions de conversation', error);
        throw error;
      } finally {
        this.loadingPromise = undefined;
      }
    })();

    return this.loadingPromise;
  }

  hasQuestions(): boolean {
    return this.questions.length > 0;
  }

  getAvailableThemes(): QuestionTheme[] {
    const themes = new Set<QuestionTheme>();
    this.questions.forEach(q => themes.add(q.theme));
    return Array.from(themes);
  }

  getAvailableDepths(): QuestionDepth[] {
    const depths = new Set<QuestionDepth>();
    this.questions.forEach(q => depths.add(q.depth));
    return Array.from(depths);
  }

  getRandomQuestion(filter?: ConversationFilter): ConversationQuestion | null {
    const pool = this.getFilteredQuestions(filter);
    if (pool.length === 0) {
      return null;
    }

    const remaining = pool.filter(q => !this.history.includes(q.id));
    const candidates = remaining.length > 0 ? remaining : pool;

    if (remaining.length === 0) {
      this.history = [];
    }

    const question = candidates[Math.floor(Math.random() * candidates.length)];
    this.history.push(question.id);
    return question;
  }

  clearHistory(): void {
    this.history = [];
  }

  getFilteredQuestions(filter?: ConversationFilter): ConversationQuestion[] {
    if (!filter) {
      return [...this.questions];
    }

    return this.questions.filter(q => {
      const matchTheme = filter.theme ? q.theme === filter.theme : true;
      const matchDepth = filter.depth ? q.depth === filter.depth : true;
      return matchTheme && matchDepth;
    });
  }

  async toggleFavorite(questionId: string): Promise<void> {
    const isFavorite = this.favorites.includes(questionId);
    if (isFavorite) {
      await this.storageService.removeFavoriteConversationQuestion(questionId);
      this.favorites = this.favorites.filter(id => id !== questionId);
    } else {
      await this.storageService.addFavoriteConversationQuestion(questionId);
      this.favorites = [...this.favorites, questionId];
    }
  }

  async loadFavorites(): Promise<void> {
    this.favorites = await this.storageService.getFavoriteConversationQuestions();
  }

  getFavoriteIds(): string[] {
    return this.favorites;
  }

  isFavorite(questionId: string): boolean {
    return this.favorites.includes(questionId);
  }
}
