import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import { ConversationQuestion, ConversationQuestionData, QuestionDepth, QuestionTheme } from '../models';
import { StorageService } from './storage.service';

interface ConversationFilter {
  theme?: QuestionTheme;
  depth?: QuestionDepth;
}

interface ConversationState {
  questions: ConversationQuestion[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
  history: string[];
  favorites: string[];
}

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);
  
  // État centralisé avec BehaviorSubject pour la réactivité
  private state$ = new BehaviorSubject<ConversationState>({
    questions: [],
    loaded: false,
    loading: false,
    error: null,
    history: [],
    favorites: []
  });
  
  // Observable partagé pour éviter les chargements multiples
  private questionsCache$?: Observable<ConversationQuestion[]>;
  
  // Getters pour accès facile à l'état
  get state(): ConversationState {
    return this.state$.value;
  }
  
  get questions(): ConversationQuestion[] {
    return this.state.questions;
  }
  
  get isLoaded(): boolean {
    return this.state.loaded;
  }
  
  get isLoading(): boolean {
    return this.state.loading;
  }
  
  get error(): string | null {
    return this.state.error;
  }

  constructor() {
    // Charger les favoris au démarrage
    this.initializeFavorites();
  }

  /**
   * Initialise les favoris depuis le stockage local
   */
  private async initializeFavorites(): Promise<void> {
    try {
      const favorites = await this.storageService.getFavoriteConversationQuestions();
      this.updateState({ favorites });
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  }

  /**
   * Met à jour l'état de manière immutable
   */
  private updateState(partialState: Partial<ConversationState>): void {
    this.state$.next({ ...this.state, ...partialState });
  }

  /**
   * Charge les questions depuis le fichier JSON
   * Utilise un cache pour éviter les chargements multiples
   */
  async loadQuestions(): Promise<ConversationQuestion[]> {
    // Si déjà chargé, retourner les questions existantes
    if (this.state.loaded && this.state.questions.length > 0) {
      return this.state.questions;
    }
    
    // Si un chargement est en cours, attendre le cache
    if (this.questionsCache$) {
      return firstValueFrom(this.questionsCache$);
    }
    
    // Créer un nouvel observable avec cache
    this.questionsCache$ = this.http.get<ConversationQuestionData>('/assets/data/conversation-questions.json').pipe(
      tap(() => this.updateState({ loading: true, error: null })),
      map(data => {
        if (!data?.questions || !Array.isArray(data.questions)) {
          throw new Error('Format de données invalide');
        }
        return data.questions;
      }),
      tap(questions => {
        this.updateState({
          questions,
          loaded: true,
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        const errorMessage = this.getErrorMessage(error);
        this.updateState({
          loaded: false,
          loading: false,
          error: errorMessage
        });
        console.error('Erreur lors du chargement des questions:', error);
        
        // Retourner un tableau vide en cas d'erreur
        return of([]);
      }),
      shareReplay(1) // Partager le résultat entre tous les souscripteurs
    );
    
    const questions = await firstValueFrom(this.questionsCache$);
    
    // Nettoyer le cache après le chargement
    this.questionsCache$ = undefined;
    
    return questions;
  }

  /**
   * Extrait un message d'erreur lisible
   */
  private getErrorMessage(error: any): string {
    if (error?.status === 404) {
      return 'Les questions de conversation sont introuvables';
    }
    if (error?.status === 0) {
      return 'Impossible de charger les questions. Vérifiez votre connexion';
    }
    if (error?.message) {
      return error.message;
    }
    return 'Une erreur inconnue s\'est produite';
  }

  /**
   * Vérifie si des questions sont disponibles
   */
  hasQuestions(): boolean {
    return this.state.questions.length > 0;
  }

  /**
   * Récupère les thèmes disponibles uniques
   */
  getAvailableThemes(): QuestionTheme[] {
    const themes = new Set<QuestionTheme>();
    this.state.questions.forEach(q => {
      if (q.theme) {
        themes.add(q.theme);
      }
    });
    return Array.from(themes).sort();
  }

  /**
   * Récupère les profondeurs disponibles uniques
   */
  getAvailableDepths(): QuestionDepth[] {
    const depths = new Set<QuestionDepth>();
    this.state.questions.forEach(q => {
      if (q.depth) {
        depths.add(q.depth);
      }
    });
    // Ordonner par niveau de profondeur
    const depthOrder: QuestionDepth[] = ['leger', 'moyen', 'profond'];
    return Array.from(depths).sort((a, b) => 
      depthOrder.indexOf(a) - depthOrder.indexOf(b)
    );
  }

  /**
   * Récupère une question aléatoire selon les filtres
   */
  getRandomQuestion(filter?: ConversationFilter): ConversationQuestion | null {
    const pool = this.getFilteredQuestions(filter);
    
    if (pool.length === 0) {
      console.warn('Aucune question disponible avec les filtres actuels');
      return null;
    }

    // Prioriser les questions non vues
    const unseenQuestions = pool.filter(q => !this.state.history.includes(q.id));
    const candidates = unseenQuestions.length > 0 ? unseenQuestions : pool;

    // Réinitialiser l'historique si toutes les questions ont été vues
    if (unseenQuestions.length === 0) {
      this.clearHistory();
    }

    // Sélectionner une question aléatoire
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const question = candidates[randomIndex];
    
    // Ajouter à l'historique
    this.addToHistory(question.id);
    
    return question;
  }

  /**
   * Ajoute une question à l'historique
   */
  private addToHistory(questionId: string): void {
    const history = [...this.state.history, questionId];
    // Limiter l'historique à 100 questions
    if (history.length > 100) {
      history.shift();
    }
    this.updateState({ history });
  }

  /**
   * Efface l'historique des questions vues
   */
  clearHistory(): void {
    this.updateState({ history: [] });
  }

  /**
   * Filtre les questions selon les critères
   */
  getFilteredQuestions(filter?: ConversationFilter): ConversationQuestion[] {
    if (!filter || (!filter.theme && !filter.depth)) {
      return [...this.state.questions];
    }

    return this.state.questions.filter(q => {
      const matchTheme = !filter.theme || q.theme === filter.theme;
      const matchDepth = !filter.depth || q.depth === filter.depth;
      return matchTheme && matchDepth;
    });
  }

  /**
   * Bascule le statut favori d'une question
   */
  async toggleFavorite(questionId: string): Promise<void> {
    if (!questionId) {
      console.error('ID de question invalide');
      return;
    }
    
    const favorites = [...this.state.favorites];
    const index = favorites.indexOf(questionId);
    
    try {
      if (index > -1) {
        // Retirer des favoris
        await this.storageService.removeFavoriteConversationQuestion(questionId);
        favorites.splice(index, 1);
      } else {
        // Ajouter aux favoris
        await this.storageService.addFavoriteConversationQuestion(questionId);
        favorites.push(questionId);
      }
      
      this.updateState({ favorites });
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
      // Recharger les favoris depuis le stockage en cas d'erreur
      await this.loadFavorites();
    }
  }

  /**
   * Charge les favoris depuis le stockage
   */
  async loadFavorites(): Promise<void> {
    try {
      const favorites = await this.storageService.getFavoriteConversationQuestions();
      this.updateState({ favorites });
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      this.updateState({ favorites: [] });
    }
  }

  /**
   * Récupère la liste des IDs favoris
   */
  getFavoriteIds(): string[] {
    return [...this.state.favorites];
  }

  /**
   * Récupère les questions favorites
   */
  getFavoriteQuestions(): ConversationQuestion[] {
    return this.state.questions.filter(q => 
      this.state.favorites.includes(q.id)
    );
  }

  /**
   * Vérifie si une question est favorite
   */
  isFavorite(questionId: string): boolean {
    return this.state.favorites.includes(questionId);
  }

  /**
   * Récupère une question par son ID
   */
  getQuestionById(id: string): ConversationQuestion | undefined {
    return this.state.questions.find(q => q.id === id);
  }

  /**
   * Recherche des questions par texte
   */
  searchQuestions(searchTerm: string): ConversationQuestion[] {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }
    
    const term = searchTerm.toLowerCase().trim();
    return this.state.questions.filter(q => 
      q.texte.toLowerCase().includes(term)
    );
  }

  /**
   * Récupère des statistiques sur les questions
   */
  getStatistics(): {
    total: number;
    byTheme: Record<string, number>;
    byDepth: Record<string, number>;
    favoriteCount: number;
    viewedCount: number;
  } {
    const stats = {
      total: this.state.questions.length,
      byTheme: {} as Record<string, number>,
      byDepth: {} as Record<string, number>,
      favoriteCount: this.state.favorites.length,
      viewedCount: this.state.history.length
    };
    
    this.state.questions.forEach(q => {
      // Par thème
      if (q.theme) {
        stats.byTheme[q.theme] = (stats.byTheme[q.theme] || 0) + 1;
      }
      // Par profondeur
      if (q.depth) {
        stats.byDepth[q.depth] = (stats.byDepth[q.depth] || 0) + 1;
      }
    });
    
    return stats;
  }




  

  /**
   * Réinitialise complètement le service
   */
  reset(): void {
    this.state$.next({
      questions: [],
      loaded: false,
      loading: false,
      error: null,
      history: [],
      favorites: []
    });
    this.questionsCache$ = undefined;
  }
}
