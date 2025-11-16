import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StorageService } from './core/services/storage.service';
import { QuizService } from './core/services/quiz.service';
import { GestureService } from './core/services/gesture.service';
import { ConversationService } from './core/services/conversation.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private quizService: QuizService,
    private gestureService: GestureService,
    private conversationService: ConversationService
  ) {}

  async ngOnInit() {
    await this.storageService.init();

    try {
      await this.quizService.loadQuestions();
      await this.gestureService.loadGestures();
      await this.conversationService.loadQuestions();
      console.log('✅ Données chargées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    }
  }
}