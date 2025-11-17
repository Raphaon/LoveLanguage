import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform, LoadingController, ToastController } from '@ionic/angular/standalone';

import { StorageService } from './core/services/storage.service';
import { QuizService } from './core/services/quiz.service';
import { GestureService } from './core/services/gesture.service';
import { ConversationService } from './core/services/conversation.service';
import { Router, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ThemeService } from './theme/theme.service';
// Si tu n'utilises pas / n'as pas installé le plugin SplashScreen, commente-le ou supprime-le
// import { SplashScreen } from '@capacitor/splash-screen';


interface InitializationStatus {
  storage: boolean;
  quiz: boolean;
  gestures: boolean;
  conversations: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private initializationStatus: InitializationStatus = {
    storage: false,
    quiz: false,
    gestures: false,
    conversations: false
  };
  private initializationErrors: string[] = [];
  private isInitialized = false;
  private loadingElement?: HTMLIonLoadingElement;

  constructor(
    private platform: Platform,
    private storageService: StorageService,
    private quizService: QuizService,
    private gestureService: GestureService,
    private conversationService: ConversationService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    // Surveiller la navigation pour debug
    this.setupNavigationMonitoring();
    
    // Initialiser les services de données
    await this.initializeServices();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise l'application et les plugins natifs
   */
  private async initializeApp(): Promise<void> {
    try {
      await this.platform.ready();
      
      // Configuration pour les plateformes natives
      if (this.platform.is('hybrid')) {
        await this.configureNativePlatform();
      }

      // Configuration du thème
      await this.themeService.init();
      
      console.log('✅ Application initialisée');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'application:', error);
    }
  }

  /**
   * Configure les plugins natifs pour les plateformes mobiles
   */
private async configureNativePlatform(): Promise<void> {
  try {
    await StatusBar.setStyle({ style: Style.Light });  // 👈 ici, plus 'light' en string
    await StatusBar.setBackgroundColor({ color: '#3880ff' });

    // Si tu n’utilises pas SplashScreen, tu peux commenter ça
    // setTimeout(async () => {
    //   await SplashScreen.hide();
    // }, 2000);
  } catch (error) {
    console.warn('Plugins natifs non disponibles:', error);
  }
}

  /**
   * Initialise tous les services de données
   */
  private async initializeServices(): Promise<void> {
    if (this.isInitialized) {
      console.log('ℹ️ Services déjà initialisés');
      return;
    }

    console.log('🔄 Initialisation des services...');
    
    // Afficher le loader après un délai pour éviter le flash sur les chargements rapides
    const loaderTimeout = setTimeout(() => {
      this.showInitializationLoader();
    }, 300);

    try {
      // Phase 1: Initialiser le stockage (critique)
      await this.initializeStorage();
      
      // Phase 2: Charger les données en parallèle (non-critique)
      await this.loadApplicationData();
      
      this.isInitialized = true;
      
      // Afficher le résumé
      this.logInitializationSummary();
      
      // Si des erreurs non-critiques, les afficher
      if (this.initializationErrors.length > 0) {
        await this.showWarningToast(
          `Application chargée avec ${this.initializationErrors.length} avertissement(s)`
        );
      }
      
    } catch (criticalError) {
      console.error('❌ Erreur critique lors de l\'initialisation:', criticalError);
      await this.handleCriticalError(criticalError);
    } finally {
      clearTimeout(loaderTimeout);
      await this.hideInitializationLoader();
    }
  }

  /**
   * Initialise le service de stockage (critique)
   */
  private async initializeStorage(): Promise<void> {
    try {
      console.log('📦 Initialisation du stockage...');
      await this.storageService.ready();
      this.initializationStatus.storage = true;
      console.log('✅ Stockage prêt');
    } catch (error) {
      throw new Error(`Impossible d'initialiser le stockage: ${error}`);
    }
  }

  /**
   * Charge toutes les données de l'application
   */
  private async loadApplicationData(): Promise<void> {
    const loadingTasks = [
      this.loadQuizData(),
      this.loadGestureData(),
      this.loadConversationData()
    ];
    
    // Utiliser allSettled pour continuer même si certaines tâches échouent
    const results = await Promise.allSettled(loadingTasks);
    
    // Analyser les résultats
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const taskName = ['Quiz', 'Gestes', 'Conversations'][index];
        const errorMessage = `Échec du chargement: ${taskName}`;
        console.error(`❌ ${errorMessage}:`, result.reason);
        this.initializationErrors.push(errorMessage);
      }
    });
  }

  /**
   * Charge les données du quiz
   */
  private async loadQuizData(): Promise<void> {
    try {
      console.log('🎯 Chargement des questions du quiz...');
      const startTime = performance.now();
      
      await this.quizService.loadQuestions();
      
      const loadTime = performance.now() - startTime;
      this.initializationStatus.quiz = true;
      console.log(`✅ Questions du quiz chargées (${loadTime.toFixed(0)}ms)`);
    } catch (error) {
      this.initializationStatus.quiz = false;
      throw new Error(`Questions du quiz: ${error}`);
    }
  }

  /**
   * Charge les données des gestes
   */
  private async loadGestureData(): Promise<void> {
    try {
      console.log('💝 Chargement des gestes...');
      const startTime = performance.now();
      
      await this.gestureService.loadGestures();
      
      const loadTime = performance.now() - startTime;
      this.initializationStatus.gestures = true;
      console.log(`✅ Gestes chargés (${loadTime.toFixed(0)}ms)`);
    } catch (error) {
      this.initializationStatus.gestures = false;
      throw new Error(`Gestes: ${error}`);
    }
  }

  /**
   * Charge les données de conversation
   */
  private async loadConversationData(): Promise<void> {
    try {
      console.log('💬 Chargement des questions de conversation...');
      const startTime = performance.now();
      
      const questions = await this.conversationService.loadQuestions();
      
      const loadTime = performance.now() - startTime;
      this.initializationStatus.conversations = questions.length > 0;
      
      if (this.initializationStatus.conversations) {
        console.log(`✅ ${questions.length} questions de conversation chargées (${loadTime.toFixed(0)}ms)`);
      } else {
        throw new Error('Aucune question trouvée');
      }
    } catch (error) {
      this.initializationStatus.conversations = false;
      throw new Error(`Questions de conversation: ${error}`);
    }
  }

  /**
   * Affiche le loader d'initialisation
   */
  private async showInitializationLoader(): Promise<void> {
    try {
      this.loadingElement = await this.loadingController.create({
        message: 'Chargement de l\'application...',
        spinner: 'crescent',
        cssClass: 'app-initialization-loader',
        backdropDismiss: false
      });
      await this.loadingElement.present();
    } catch (error) {
      console.error('Impossible d\'afficher le loader:', error);
    }
  }

  /**
   * Masque le loader d'initialisation
   */
  private async hideInitializationLoader(): Promise<void> {
    try {
      if (this.loadingElement) {
        await this.loadingElement.dismiss();
        this.loadingElement = undefined;
      }
    } catch (error) {
      console.error('Erreur lors de la fermeture du loader:', error);
    }
  }

  /**
   * Gère une erreur critique
   */
  private async handleCriticalError(error: any): Promise<void> {
    const message = this.getErrorMessage(error);
    
    const toast = await this.toastController.create({
      message: `Erreur critique: ${message}`,
      duration: 0, // Pas de fermeture automatique
      position: 'bottom',
      color: 'danger',
      buttons: [
        {
          text: 'Réessayer',
          handler: () => {
            window.location.reload();
          }
        },
        {
          text: 'Continuer',
          role: 'cancel'
        }
      ]
    });
    
    await toast.present();
  }

  /**
   * Affiche un toast d'avertissement
   */
  private async showWarningToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'warning',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    
    await toast.present();
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
   * Affiche un résumé de l'initialisation
   */
  private logInitializationSummary(): void {
    const successCount = Object.values(this.initializationStatus).filter(status => status).length;
    const totalCount = Object.keys(this.initializationStatus).length;
    
    console.group('📊 Résumé de l\'initialisation');
    console.log(`État global: ${successCount}/${totalCount} services chargés`);
    console.table(this.initializationStatus);
    
    if (this.initializationErrors.length > 0) {
      console.warn('⚠️ Avertissements:', this.initializationErrors);
    }
    
    console.groupEnd();
  }

  /**
   * Configure la surveillance de la navigation pour debug
   */
  private setupNavigationMonitoring(): void {
    // Log de début de navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationStart) => {
        console.log(`🔄 Navigation vers: ${event.url}`);
      });
    
    // Log de fin de navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        console.log(`✅ Navigation complétée: ${event.url}`);
        
        // Analytics ou tracking ici si nécessaire
        this.trackPageView(event.url);
      });
    
    // Log des erreurs de navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationError),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationError) => {
        console.error(`❌ Erreur de navigation: ${event.url}`, event.error);
        this.handleNavigationError(event);
      });
  }

  /**
   * Track les vues de page (pour analytics)
   */
  private trackPageView(url: string): void {
    // Implémenter le tracking analytics ici si nécessaire
    // Par exemple: Google Analytics, Mixpanel, etc.
  }

  /**
   * Gère les erreurs de navigation
   */
  private async handleNavigationError(event: NavigationError): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Impossible de naviguer vers cette page',
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    
    await toast.present();
    
    // Rediriger vers la page d'accueil en cas d'erreur
    this.router.navigate(['/home']);
  }

  /**
   * Méthode publique pour forcer le rechargement des données
   */
  async reloadData(): Promise<void> {
    this.isInitialized = false;
    this.initializationErrors = [];
    await this.initializeServices();
  }

  /**
   * Getter pour vérifier si l'app est initialisée
   */
  get isAppInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Getter pour obtenir le statut d'initialisation
   */
  get getInitializationStatus(): InitializationStatus {
    return { ...this.initializationStatus };
  }
}
