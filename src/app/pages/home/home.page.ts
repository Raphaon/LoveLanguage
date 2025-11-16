import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
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
    IonIcon
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
    this.latestResult = await this.storageService.getLastTestResult();
    if (this.latestResult) {
      this.primaryLanguage = LOVE_LANGUAGES_DATA.find(l => l.code === this.latestResult?.langagePrincipal);
    }
    if (!this.gestureService.getAllGestures().length) {
      await this.gestureService.loadGestures();
    }
    this.featuredGestures = this.gestureService.getRandomSuggestions(3);

    if (!this.conversationService.hasQuestions()) {
      await this.conversationService.loadQuestions();
    }
    this.questionOfTheDay = this.conversationService.getRandomQuestion()?.texte;
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  async startQuiz(): Promise<void> {
    const onboardingDone = await this.storageService.isOnboardingCompleted();
    if (!onboardingDone) {
      this.router.navigate(['/onboarding']);
      return;
    }

    const hasProfile = await this.storageService.hasUserProfile();
    this.router.navigate([hasProfile ? '/quiz' : '/profile-setup']);
  }

}
