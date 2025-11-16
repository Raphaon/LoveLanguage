import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    try {
      const data = await this.http.get<ConversationQuestionData>('assets/data/conversation-questions.json').toPromise();
      if (data?.questions) {
        this.questions = data.questions;
        this.loaded = true;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des questions de conversation', error);
      throw error;
    }
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
    if (this.favorites.includes(questionId)) {
      await this.storageService.removeFavoriteConversationQuestion(questionId);
    } else {
      await this.storageService.addFavoriteConversationQuestion(questionId);
    }
    await this.loadFavorites();
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
