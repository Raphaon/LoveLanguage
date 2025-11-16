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
import { arrowForward, statsChartOutline, giftOutline } from 'ionicons/icons';
import { LoveLanguage, LoveLanguageCode, LOVE_LANGUAGES_DATA, TestResult, TestStatistics } from '../../core/models';
import { ScoringService, StorageService } from '../../core/services';
import { ChartComponent } from '../../shared/components/chart/chart.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    ChartComponent
  ]
})
export class ResultsPage implements OnInit {
  result?: TestResult | null;
  primaryLanguage?: LoveLanguage;
  secondaryLanguage?: LoveLanguage;
  loading = true;
  resultMessage?: string;
  statistics?: TestStatistics;

  constructor(
    private storageService: StorageService,
    private scoringService: ScoringService,
    private router: Router
  ) {
    addIcons({ arrowForward, statsChartOutline, giftOutline });
  }

  async ngOnInit() {
    await this.loadResult();
  }

  async loadResult(): Promise<void> {
    this.result = await this.storageService.getLastTestResult();
    if (this.result) {
      this.primaryLanguage = this.getLanguageDetails(this.result.langagePrincipal);
      if (this.result.langageSecondaire) {
        this.secondaryLanguage = this.getLanguageDetails(this.result.langageSecondaire);
      }
      this.resultMessage = this.scoringService.getResultMessage(this.result as TestResult);
      this.statistics = this.scoringService.calculateStatistics(this.result as TestResult);
    }
    this.loading = false;
  }

  getLanguageDetails(code: LoveLanguageCode): LoveLanguage | undefined {
    return LOVE_LANGUAGES_DATA.find(l => l.code === code);
  }

  goToGestures(): void {
    this.router.navigate(['/gestures']);
  }

  restartQuiz(): void {
    this.router.navigate(['/quiz']);
  }

}
