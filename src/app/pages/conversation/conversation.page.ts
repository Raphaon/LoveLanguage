import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline, heartOutline, heart } from 'ionicons/icons';
import { ConversationQuestion, QuestionDepth, QuestionTheme } from '../../core/models';
import { ConversationService } from '../../core/services/conversation.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonChip,
    IonButton,
    IonIcon,
    IonSpinner
  ]
})
export class ConversationPage implements OnInit {
  themes: QuestionTheme[] = [];
  depths: QuestionDepth[] = [];
  selectedTheme?: QuestionTheme;
  selectedDepth?: QuestionDepth;
  currentQuestion?: ConversationQuestion | null;
  favoriteIds: string[] = [];
  loading = true;

  constructor(private conversationService: ConversationService) {
    addIcons({ refreshOutline, heartOutline, heart });
  }

  async ngOnInit() {
    await this.conversationService.loadQuestions();
    this.themes = this.conversationService.getAvailableThemes();
    this.depths = this.conversationService.getAvailableDepths();
    await this.refreshFavorites();
    this.pickQuestion();
    this.loading = false;
  }

  pickQuestion(): void {
    this.currentQuestion = this.conversationService.getRandomQuestion({
      theme: this.selectedTheme,
      depth: this.selectedDepth
    });
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
}
