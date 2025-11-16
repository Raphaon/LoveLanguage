import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline, heartOutline, heart } from 'ionicons/icons';
import { ConversationQuestion, QuestionDepth, QuestionTheme } from '../../core/models';
import { ConversationService } from '../../core/services/conversation.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonIcon]
})
export class ConversationPage implements OnInit, OnDestroy {
  themes: QuestionTheme[] = [];
  depths: QuestionDepth[] = [];
  selectedTheme?: QuestionTheme;
  selectedDepth?: QuestionDepth;
  currentQuestion?: ConversationQuestion | null;
  favoriteIds: string[] = [];
  pageLoading = true;
  fetchingQuestion = false;
  private fetchTimeout?: ReturnType<typeof setTimeout>;

  readonly themeLabels: Record<QuestionTheme, string> = {
    amour: 'Amour',
    bonus: 'Bonus',
    culture: 'Culture',
    enfance: 'Enfance',
    famille: 'Famille',
    loisirs: 'Loisirs',
    personnalite: 'Personnalité',
    relations: 'Relations',
    reves: 'Rêves',
    spiritualite: 'Spiritualité',
    travail: 'Travail',
    valeurs: 'Valeurs'
  };

  readonly depthLabels: Record<QuestionDepth, string> = {
    leger: 'Léger',
    moyen: 'Moyen',
    profond: 'Profond'
  };

  readonly depthFilters: Array<{ key: string; label: string; value?: QuestionDepth }> = [
    { key: 'all', label: 'Tous' },
    { key: 'leger', label: 'Léger', value: 'leger' },
    { key: 'moyen', label: 'Moyen', value: 'moyen' },
    { key: 'profond', label: 'Profond', value: 'profond' }
  ];

  constructor(private conversationService: ConversationService) {
    addIcons({ refreshOutline, heartOutline, heart });
  }

  async ngOnInit() {
    await this.conversationService.loadQuestions();
    this.themes = this.conversationService.getAvailableThemes();
    this.depths = this.conversationService.getAvailableDepths();
    await this.refreshFavorites();
    this.pickQuestion({ skipDelay: true });
    this.pageLoading = false;
  }

  pickQuestion(options?: { skipDelay?: boolean }): void {
    const assignQuestion = () => {
      this.currentQuestion = this.conversationService.getRandomQuestion({
        theme: this.selectedTheme,
        depth: this.selectedDepth
      });
      this.fetchingQuestion = false;
      this.fetchTimeout = undefined;
    };

    this.fetchingQuestion = true;

    if (options?.skipDelay) {
      assignQuestion();
      return;
    }

    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
    }

    this.fetchTimeout = setTimeout(assignQuestion, 220);
  }

  selectTheme(theme?: QuestionTheme): void {
    this.selectedTheme = theme;
    this.conversationService.clearHistory();
    this.pickQuestion();
  }

  selectDepth(depth?: QuestionDepth): void {
    this.selectedDepth = depth;
    this.conversationService.clearHistory();
    this.pickQuestion();
  }

  randomizeTheme(): void {
    if (!this.themes.length) {
      return;
    }
    const index = Math.floor(Math.random() * this.themes.length);
    this.selectTheme(this.themes[index]);
  }

  resetFilters(): void {
    this.selectedTheme = undefined;
    this.selectedDepth = undefined;
    this.conversationService.clearHistory();
    this.pickQuestion();
  }

  get themeLabel(): string {
    if (!this.selectedTheme) {
      return 'Tous thèmes';
    }
    return this.themeLabels[this.selectedTheme];
  }

  get depthLabel(): string {
    if (!this.selectedDepth) {
      return 'Tous niveaux';
    }
    return this.depthLabels[this.selectedDepth];
  }

  get isFavorite(): boolean {
    if (!this.currentQuestion) {
      return false;
    }
    return this.favoriteIds.includes(this.currentQuestion.id);
  }

  async toggleFavorite(): Promise<void> {
    if (!this.currentQuestion) {
      return;
    }
    await this.conversationService.toggleFavorite(this.currentQuestion.id);
    await this.refreshFavorites();
  }

  private async refreshFavorites(): Promise<void> {
    await this.conversationService.loadFavorites();
    this.favoriteIds = this.conversationService.getFavoriteIds();
  }

  ngOnDestroy(): void {
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
    }
  }
}
