import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';



import { FormsModule } from '@angular/forms';
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
  IonToolbar,
  IonBadge,
  IonFab,
  IonFabButton,
  IonButtons,
  IonFabList,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  refreshOutline,
  heartOutline,
  heart,
  searchOutline,
  filterOutline,
  shareOutline,
  copyOutline,
  diceOutline,
} from 'ionicons/icons';

import { ConversationQuestion, QuestionDepth, QuestionTheme } from '../../core/models';
import { ConversationService } from '../../core/services/conversation.service';
import { Subject } from 'rxjs';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonSpinner,
    IonBadge,
    IonFab,
    IonFabButton,
    IonButtons,
    IonFabList,
    NgIf,
    NgFor,
    NgClass
  ],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ConversationPage implements OnInit, OnDestroy {
  // État du composant
  themes: QuestionTheme[] = [];
  depths: QuestionDepth[] = [];
  selectedTheme?: QuestionTheme;
  selectedDepth?: QuestionDepth;
  currentQuestion?: ConversationQuestion | null;
  favoriteIds: string[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  showFilters = true;
  questionHistory: ConversationQuestion[] = [];
  statistics: any = null;

  // Subject pour gérer la désinscription
  private destroy$ = new Subject<void>();

  constructor(
    private conversationService: ConversationService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    // Ajouter les icônes nécessaires
    addIcons({
      refreshOutline,
      heartOutline,
      heart,
      searchOutline,
      filterOutline,
      shareOutline,
      copyOutline,
      diceOutline
    });
  }

  async ngOnInit() {
    await this.initializeComponent();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise le composant et charge les données
   */
  async initializeComponent(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;

      // Charger les questions
      const questions = await this.conversationService.loadQuestions();

      if (!questions || questions.length === 0) {
        throw new Error('Aucune question disponible');
      }

      // Initialiser les filtres
      this.themes = this.conversationService.getAvailableThemes();
      this.depths = this.conversationService.getAvailableDepths();

      // Charger les favoris
      await this.refreshFavorites();

      // Charger les statistiques
      this.statistics = this.conversationService.getStatistics();

      // Sélectionner une première question
      this.pickQuestion();

      this.loading = false;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      this.error = this.getErrorMessage(error);
      this.loading = false;

      // Afficher un toast d'erreur
      await this.showErrorToast('Impossible de charger les questions. Veuillez réessayer.');
    }
  }

  /**
   * Extrait un message d'erreur lisible
   */
  private getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Une erreur inconnue s\'est produite';
  }

  /**
   * Sélectionne une nouvelle question aléatoire
   */
  pickQuestion(): void {
    try {
      const newQuestion = this.conversationService.getRandomQuestion({
        theme: this.selectedTheme,
        depth: this.selectedDepth
      });

      if (newQuestion) {
        // Ajouter à l'historique local
        if (this.currentQuestion) {
          this.questionHistory.unshift(this.currentQuestion);
          // Limiter l'historique à 10 questions
          if (this.questionHistory.length > 10) {
            this.questionHistory.pop();
          }
        }

        this.currentQuestion = newQuestion;
      } else {
        this.currentQuestion = null;
        this.showWarningToast('Aucune question disponible avec ces filtres');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'une question:', error);
      this.showErrorToast('Impossible de charger une nouvelle question');
    }
  }

  /**
   * Sélectionne un thème et rafraîchit la question
   */
  selectTheme(theme?: QuestionTheme): void {
    this.selectedTheme = theme;
    this.conversationService.clearHistory();
    this.pickQuestion();

    // Afficher le nombre de questions disponibles
    const count = this.getFilteredQuestionCount();
    this.showInfoToast(`${count} questions disponibles`);
  }

  /**
   * Sélectionne une profondeur et rafraîchit la question
   */
  selectDepth(depth?: QuestionDepth): void {
    this.selectedDepth = depth;
    this.conversationService.clearHistory();
    this.pickQuestion();

    // Afficher le nombre de questions disponibles
    const count = this.getFilteredQuestionCount();
    this.showInfoToast(`${count} questions disponibles`);
  }

  /**
   * Retourne le nombre de questions disponibles avec les filtres actuels
   */
  getFilteredQuestionCount(): number {
    return this.conversationService.getFilteredQuestions({
      theme: this.selectedTheme,
      depth: this.selectedDepth
    }).length;
  }

  /**
   * Vérifie si la question actuelle est favorite
   */
  get isFavorite(): boolean {
    if (!this.currentQuestion) {
      return false;
    }
    return this.favoriteIds.includes(this.currentQuestion.id);
  }

  /**
   * Bascule le statut favori de la question actuelle
   */
  async toggleFavorite(): Promise<void> {
    if (!this.currentQuestion) {
      return;
    }

    try {
      await this.conversationService.toggleFavorite(this.currentQuestion.id);
      await this.refreshFavorites();

      const message = this.isFavorite ?
        'Question ajoutée aux favoris' :
        'Question retirée des favoris';
      await this.showSuccessToast(message);
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
      await this.showErrorToast('Impossible de modifier les favoris');
    }
  }

  /**
   * Rafraîchit la liste des favoris
   */
  private async refreshFavorites(): Promise<void> {
    try {
      await this.conversationService.loadFavorites();
      this.favoriteIds = this.conversationService.getFavoriteIds();
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  }

  /**
   * Partage la question actuelle
   */
  async shareQuestion(): Promise<void> {
    if (!this.currentQuestion) {
      return;
    }

    const text = `Question de conversation:\n\n"${this.currentQuestion.texte}"\n\n${this.getQuestionMetadata()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Question de conversation',
          text: text
        });
      } catch (error) {
        console.log('Partage annulé ou non supporté');
      }
    } else {
      // Fallback: copier dans le presse-papier
      await this.copyToClipboard(text);
    }
  }

  /**
   * Copie le texte dans le presse-papier
   */
  private async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      await this.showSuccessToast('Question copiée dans le presse-papier');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      await this.showErrorToast('Impossible de copier la question');
    }
  }

  /**
   * Retourne les métadonnées de la question actuelle
   */
  private getQuestionMetadata(): string {
    if (!this.currentQuestion) {
      return '';
    }

    const theme = this.currentQuestion.theme ?
      `Thème: ${this.currentQuestion.theme}` : '';
    const depth = this.currentQuestion.depth ?
      `Niveau: ${this.currentQuestion.depth}` : '';

    return [theme, depth].filter(Boolean).join(' • ');
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.selectedTheme = undefined;
    this.selectedDepth = undefined;
    this.conversationService.clearHistory();
    this.pickQuestion();

    this.showInfoToast('Filtres réinitialisés');
  }

  /**
   * Affiche les questions favorites
   */
  async showFavorites(): Promise<void> {
    const favorites = this.conversationService.getFavoriteQuestions();

    if (favorites.length === 0) {
      await this.showInfoToast('Aucune question favorite');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Questions favorites',
      message: favorites.map(q => `• ${q.texte}`).join('\n\n'),
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * Retourne à la question précédente
   */
  previousQuestion(): void {
    if (this.questionHistory.length > 0) {
      const previousQuestion = this.questionHistory.shift();
      if (previousQuestion) {
        this.currentQuestion = previousQuestion;
      }
    } else {
      this.showInfoToast('Aucune question précédente');
    }
  }

  /**
   * Affiche un toast de succès
   */
  private async showSuccessToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  /**
   * Affiche un toast d'erreur
   */
  private async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      icon: 'close-circle-outline',
      buttons: [
        {
          text: 'Réessayer',
          handler: () => {
            this.initializeComponent();
          }
        }
      ]
    });
    await toast.present();
  }

  /**
   * Affiche un toast d'information
   */
  private async showInfoToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'medium',
      icon: 'information-circle-outline'
    });
    await toast.present();
  }

  /**
   * Affiche un toast d'avertissement
   */
  private async showWarningToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color: 'warning',
      icon: 'alert-circle-outline'
    });
    await toast.present();
  }

  /**
   * Retourne le label formaté pour un thème
   */
  getThemeLabel(theme: QuestionTheme): string {
    const labels: Record<string, string> = {
      enfance: 'Enfance',
      reves: 'Rêves',
      valeurs: 'Valeurs',
      relations: 'Relations',
      emotions: 'Émotions',
      souvenirs: 'Souvenirs',
      futur: 'Futur',
      creativite: 'Créativité',
      defis: 'Défis',
      gratitude: 'Gratitude'
    };
    return labels[theme] || theme;
  }

  /**
   * Retourne le label formaté pour une profondeur
   */
  getDepthLabel(depth: QuestionDepth): string {
    const labels: Record<QuestionDepth, string> = {
      leger: 'Léger',
      moyen: 'Moyen',
      profond: 'Profond'
    };
    return labels[depth] || depth;
  }
}
