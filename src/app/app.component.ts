import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from './core/services/storage.service';
import { QuizService } from './core/services/quiz.service';
import { GestureService } from './core/services/gesture.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private quizService: QuizService,
    private gestureService: GestureService
  ) {}

  async ngOnInit() {
    await this.storageService.init();
    
    try {
      await this.quizService.loadQuestions();
      await this.gestureService.loadGestures();
      console.log('✅ Données chargées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    }
  }
}