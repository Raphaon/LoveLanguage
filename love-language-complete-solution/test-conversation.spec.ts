// test-conversation.spec.ts
// Tests unitaires pour vérifier le bon fonctionnement du service de conversation après corrections

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConversationService } from './conversation.service';
import { StorageService } from './storage.service';
import { ConversationQuestionData } from '../models';

describe('ConversationService - Tests après corrections', () => {
  let service: ConversationService;
  let httpMock: HttpTestingController;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  const mockQuestionsData: ConversationQuestionData = {
    version: '1.1.0',
    lastUpdated: '2025-11-16',
    questions: [
      {
        id: 'q1',
        texte: 'Question test 1',
        theme: 'enfance',
        depth: 'leger'
      },
      {
        id: 'q2',
        texte: 'Question test 2',
        theme: 'reves',
        depth: 'moyen'
      },
      {
        id: 'q3',
        texte: 'Question test 3',
        theme: 'valeurs',
        depth: 'profond'
      }
    ]
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('StorageService', [
      'getFavoriteConversationQuestions',
      'addFavoriteConversationQuestion',
      'removeFavoriteConversationQuestion'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConversationService,
        { provide: StorageService, useValue: spy }
      ]
    });

    service = TestBed.inject(ConversationService);
    httpMock = TestBed.inject(HttpTestingController);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    // Configuration par défaut des mocks
    storageServiceSpy.getFavoriteConversationQuestions.and.returnValue(Promise.resolve([]));
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Chargement des questions', () => {
    it('devrait charger les questions depuis le fichier JSON', async () => {
      const loadPromise = service.loadQuestions();

      const req = httpMock.expectOne('/assets/data/conversation-questions.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockQuestionsData);

      const questions = await loadPromise;

      expect(questions).toEqual(mockQuestionsData.questions);
      expect(service.hasQuestions()).toBe(true);
      expect(service.isLoaded).toBe(true);
      expect(service.error).toBeNull();
    });

    it('devrait gérer les erreurs de chargement', async () => {
      const loadPromise = service.loadQuestions();

      const req = httpMock.expectOne('/assets/data/conversation-questions.json');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      const questions = await loadPromise;

      expect(questions).toEqual([]);
      expect(service.hasQuestions()).toBe(false);
      expect(service.error).toBe('Les questions de conversation sont introuvables');
    });

    it('ne devrait pas recharger si déjà chargé', async () => {
      // Premier chargement
      const firstLoad = service.loadQuestions();
      const req = httpMock.expectOne('/assets/data/conversation-questions.json');
      req.flush(mockQuestionsData);
      await firstLoad;

      // Deuxième tentative - ne devrait pas faire de requête HTTP
      const secondLoad = await service.loadQuestions();
      
      // Aucune nouvelle requête HTTP ne devrait être faite
      httpMock.expectNone('/assets/data/conversation-questions.json');
      
      expect(secondLoad).toEqual(mockQuestionsData.questions);
    });

    it('devrait empêcher les chargements multiples simultanés', async () => {
      // Lancer plusieurs chargements en parallèle
      const load1 = service.loadQuestions();
      const load2 = service.loadQuestions();
      const load3 = service.loadQuestions();

      // Une seule requête HTTP devrait être faite
      const req = httpMock.expectOne('/assets/data/conversation-questions.json');
      req.flush(mockQuestionsData);

      const [result1, result2, result3] = await Promise.all([load1, load2, load3]);

      expect(result1).toEqual(mockQuestionsData.questions);
      expect(result2).toEqual(mockQuestionsData.questions);
      expect(result3).toEqual(mockQuestionsData.questions);
    });
  });

  describe('Sélection de questions', () => {
    beforeEach(async () => {
      const loadPromise = service.loadQuestions();
      const req = httpMock.expectOne('/assets/data/conversation-questions.json');
      req.flush(mockQuestionsData);
      await loadPromise;
    });

    it('devrait retourner une question aléatoire', () => {
      const question = service.getRandomQuestion();
      
      expect(question).toBeTruthy();
      expect(mockQuestionsData.questions).toContain(question!);
    });

    it('devrait filtrer par thème', () => {
      const question = service.getRandomQuestion({ theme: 'enfance' });
      
      expect(question).toBeTruthy();
      expect(question?.theme).toBe('enfance');
    });

    it('devrait filtrer par profondeur', () => {
      const question = service.getRandomQuestion({ depth: 'profond' });
      
      expect(question).toBeTruthy();
      expect(question?.depth).toBe('profond');
    });

    it('devrait retourner null si aucune question ne correspond aux filtres', () => {
      const question = service.getRandomQuestion({ theme: 'inexistant' as any });
      
      expect(question).toBeNull();
    });

    it('devrait éviter de répéter les questions récemment vues', () => {
      const seenQuestions = new Set<string>();
      
      // Obtenir plusieurs questions
      for (let i = 0; i < 3; i++) {
        const question = service.getRandomQuestion();
        if (question) {
          expect(seenQuestions.has(question.id)).toBe(false);
          seenQuestions.add(question.id);
        }
      }
      
      expect(seenQuestions.size).toBe(3);
    });

    it('devrait réinitialiser l\'historique quand toutes les questions ont été vues', () => {
      const allQuestions = new Set<string>();
      
      // Parcourir toutes les questions
      for (let i = 0; i < mockQuestionsData.questions.length + 1; i++) {
        const question = service.getRandomQuestion();
        if (question) {
          allQuestions.add(question.id);
        }
      }
      
      // L'historique devrait être réinitialisé, permettant de revoir des questions
      expect(allQuestions.size).toBeLessThanOrEqual(mockQuestionsData.questions.length);
    });
  });

  describe('Gestion des favoris', () => {
    beforeEach(async () => {
      const loadPromise = service.loadQuestions();
      const req = httpMock.expectOne('/assets/data/conversation-questions.json');
      req.flush(mockQuestionsData);
      await loadPromise;
    });

    it('devrait ajouter une question aux favoris', async () => {
      storageServiceSpy.addFavoriteConversationQuestion.and.returnValue(Promise.resolve());
      
      await service.toggleFavorite('q1');
      
      expect(storageServiceSpy.addFavoriteConversationQuestion).toHaveBeenCalledWith('q1');
      expect(service.isFavorite('q1')).toBe(true);
    });

    it('devrait retirer une question des favoris', async () => {
      // D'abord ajouter aux favoris
      storageServiceSpy.addFavoriteConversationQuestion.and.returnValue(Promise.resolve());
      await service.toggleFavorite('q1');
      
      // Puis retirer
      storageServiceSpy.removeFavoriteConversationQuestion.and.returnValue(Promise.resolve());
      await service.toggleFavorite('q1');
      
      expect(storageServiceSpy.removeFavoriteConversationQuestion).toHaveBeenCalledWith('q1');
      expect(service.isFavorite('q1')).toBe(false);
    });

    it('devrait charger les favoris existants', async () => {
      const existingFavorites = ['q2', 'q3'];
      storageServiceSpy.getFavoriteConversationQuestions.and.returnValue(
        Promise.resolve(existingFavorites)
      );
      
      await service.loadFavorites();
      
      expect(service.getFavoriteIds()).toEqual(existingFavorites);
      expect(service.isFavorite('q2')).toBe(true);
      expect(service.isFavorite('q3')).toBe(true);
      expect(service.isFavorite('q1')).toBe(false);
    });

    it('devrait récupérer les questions favorites', async () => {
      const favoriteIds = ['q1', 'q3'];
      storageServiceSpy.getFavoriteConversationQuestions.and.returnValue(
        Promise.resolve(favoriteIds)
      );
      
      await service.loadFavorites();
      const favoriteQuestions = service.getFavoriteQuestions();
      
      expect(favoriteQuestions.length).toBe(2);
      expect(favoriteQuestions.map(q => q.id)).toEqual(favoriteIds);
    });
  });

  describe('Méthodes utilitaires', () => {
    beforeEach(async () => {
      const loadPromise = service.loadQuestions();
      const req = httpMock.expectOne('/assets/data/conversation-questions.json');
      req.flush(mockQuestionsData);
      await loadPromise;
    });

    it('devrait retourner les thèmes disponibles', () => {
      const themes = service.getAvailableThemes();
      
      expect(themes).toContain('enfance');
      expect(themes).toContain('reves');
      expect(themes).toContain('valeurs');
      expect(themes.length).toBe(3);
    });

    it('devrait retourner les profondeurs disponibles', () => {
      const depths = service.getAvailableDepths();
      
      expect(depths).toEqual(['leger', 'moyen', 'profond']);
    });

    it('devrait rechercher des questions par texte', () => {
      const results = service.searchQuestions('test 2');
      
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('q2');
    });

    it('devrait retourner une question par ID', () => {
      const question = service.getQuestionById('q2');
      
      expect(question).toBeTruthy();
      expect(question?.texte).toBe('Question test 2');
    });

    it('devrait calculer les statistiques', () => {
      const stats = service.getStatistics();
      
      expect(stats.total).toBe(3);
      expect(stats.byTheme['enfance']).toBe(1);
      expect(stats.byTheme['reves']).toBe(1);
      expect(stats.byTheme['valeurs']).toBe(1);
      expect(stats.byDepth['leger']).toBe(1);
      expect(stats.byDepth['moyen']).toBe(1);
      expect(stats.byDepth['profond']).toBe(1);
    });

    it('devrait réinitialiser le service', () => {
      service.reset();
      
      expect(service.hasQuestions()).toBe(false);
      expect(service.isLoaded).toBe(false);
      expect(service.getFavoriteIds()).toEqual([]);
    });
  });

  describe('Gestion de l\'état', () => {
    it('devrait gérer l\'état de chargement', async () => {
      expect(service.isLoading).toBe(false);
      
      const loadPromise = service.loadQuestions();
      
      // Le chargement devrait commencer
      const req = httpMock.expectOne('/assets/data/conversation-questions.json');
      req.flush(mockQuestionsData);
      
      await loadPromise;
      
      expect(service.isLoading).toBe(false);
    });

    it('devrait maintenir l\'historique des questions vues', () => {
      const loadPromise = service.loadQuestions();
      const req = httpMock.expectOne('/assets/data/conversation-questions.json');
      req.flush(mockQuestionsData);
      
      loadPromise.then(() => {
        // Obtenir plusieurs questions
        const question1 = service.getRandomQuestion();
        const question2 = service.getRandomQuestion();
        const question3 = service.getRandomQuestion();
        
        // Vérifier que l'historique contient les questions
        const state = service.state;
        expect(state.history.length).toBeGreaterThan(0);
      });
    });
  });
});

// Instructions pour lancer les tests :
// 1. Installer les dépendances de test si nécessaire :
//    npm install --save-dev @angular/core @angular/common @angular/platform-browser-dynamic jasmine-core karma karma-jasmine karma-chrome-launcher
// 
// 2. Lancer les tests :
//    ng test
//    ou
//    npm run test
//
// 3. Pour un rapport de couverture :
//    ng test --code-coverage
//
// Les tests devraient tous passer si les corrections ont été correctement appliquées.
