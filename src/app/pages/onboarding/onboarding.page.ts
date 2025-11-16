import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward, playCircle, checkmarkCircle } from 'ionicons/icons';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonFooter,
    CommonModule
  ]
})
export class OnboardingPage implements OnInit {
  slides = [
    {
      title: 'Découvre ton langage de l’amour',
      description: 'Passe un test guidé et identifie les deux langages qui te parlent le plus.',
      icon: '💞'
    },
    {
      title: 'Reçois des idées personnalisées',
      description: 'Des gestes, messages et cadeaux adaptés à ton langage et à ta relation.',
      icon: '🎁'
    },
    {
      title: 'Boostez vos conversations',
      description: 'Un quiz dynamique et des questions inspirantes pour créer du lien chaque jour.',
      icon: '🗣️'
    }
  ];

  currentSlide = 0;

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    addIcons({ arrowForward, playCircle, checkmarkCircle });
  }

  ngOnInit() {}

  async startJourney(): Promise<void> {
    await this.storageService.setOnboardingCompleted(true);
    this.router.navigate(['/profile-setup']);
  }

  async skip(): Promise<void> {
    await this.storageService.setOnboardingCompleted(true);
    this.router.navigate(['/home']);
  }

  next(): void {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.startJourney();
    }
  }

  previous(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

}
