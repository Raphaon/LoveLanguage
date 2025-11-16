import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { playCircle, chatbubbleEllipsesOutline } from 'ionicons/icons';
import { Gesture, LoveLanguage, LOVE_LANGUAGES_DATA, TestResult } from '../../core/models';
import { ConversationService, GestureService, StorageService } from '../../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class HomePage implements OnInit {
  latestResult?: TestResult | null;
  primaryLanguage?: LoveLanguage;
  featuredGestures: Gesture[] = [];
  questionOfTheDay?: string;

  constructor(
    private storageService: StorageService,
    private gestureService: GestureService,
    private conversationService: ConversationService,
    private router: Router
  ) {
    addIcons({ playCircle, chatbubbleEllipsesOutline });
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const latestResultPromise = this.storageService.getLastTestResult();
    const featuredGesturesPromise = (async () => {
      if (!this.gestureService.getAllGestures().length) {
        await this.gestureService.loadGestures();
      }
      return this.gestureService.getRandomSuggestions(3);
    })();
    const questionPromise = (async () => {
      if (!this.conversationService.hasQuestions()) {
        await this.conversationService.loadQuestions();
      }
      return this.conversationService.getRandomQuestion()?.texte;
    })();

    const [latestResult, featuredGestures, questionOfTheDay] = await Promise.allSettled([
      latestResultPromise,
      featuredGesturesPromise,
      questionPromise
    ]);

    this.latestResult = latestResult.status === 'fulfilled' ? latestResult.value : null;
    if (this.latestResult) {
      this.primaryLanguage = LOVE_LANGUAGES_DATA.find(l => l.code === this.latestResult?.langagePrincipal);
    }
    this.featuredGestures = featuredGestures.status === 'fulfilled' ? featuredGestures.value ?? [] : [];
    this.questionOfTheDay = questionOfTheDay.status === 'fulfilled' ? questionOfTheDay.value : undefined;
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  async startQuiz(): Promise<void> {
    const hasCompleted = await this.storageService.isOnboardingCompleted();
    if (hasCompleted) {
      this.router.navigate(['/profile-setup']);
    } else {
      this.router.navigate(['/onboarding']);
    }
  }

}
