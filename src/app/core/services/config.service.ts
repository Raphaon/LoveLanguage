import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppConfig {
  darkMode: boolean;
  language: string;
  notifications: boolean;
  soundEffects: boolean;
  animations: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  showTutorials: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly CONFIG_KEY = 'app_config';

  private readonly DEFAULT_CONFIG: AppConfig = {
    darkMode: environment.features?.darkMode ?? false,
    language: 'fr',
    notifications: true,
    soundEffects: true,
    animations: environment.ui?.animationsEnabled ?? true,
    fontSize: 'medium',
    autoSave: true,
    showTutorials: true
  };

  private readonly env = environment;

  private configSubject = new BehaviorSubject<AppConfig>(this.DEFAULT_CONFIG);

  constructor() {
    this.loadConfig();
  }

  /**
   * Observable de la configuration
   */
  get config$(): Observable<AppConfig> {
    return this.configSubject.asObservable();
  }

  /**
   * Configuration actuelle
   */
  get currentConfig(): AppConfig {
    return this.configSubject.value;
  }

  /**
   * Met à jour la configuration et applique les changements
   */
  updateConfig(partialConfig: Partial<AppConfig>): void {
    const newConfig: AppConfig = {
      ...this.configSubject.value,
      ...partialConfig
    };

    this.configSubject.next(newConfig);
    this.saveConfig();
    this.applyConfig(newConfig);
  }

  /**
   * Réinitialise la configuration
   */
  resetConfig(): void {
    this.configSubject.next(this.DEFAULT_CONFIG);
    this.saveConfig();
    this.applyConfig(this.DEFAULT_CONFIG);
  }

  /**
   * Charge la configuration depuis le localStorage
   */
  private loadConfig(): void {
    try {
      const stored = localStorage.getItem(this.CONFIG_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppConfig>;
        const merged: AppConfig = { ...this.DEFAULT_CONFIG, ...parsed };
        this.configSubject.next(merged);
        this.applyConfig(merged);
      } else {
        this.detectSystemPreferences();
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      this.configSubject.next(this.DEFAULT_CONFIG);
      this.applyConfig(this.DEFAULT_CONFIG);
    }
  }

  /**
   * Détecte les préférences système (dark mode) au premier lancement
   */
  private detectSystemPreferences(): void {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const detected: Partial<AppConfig> = {
      darkMode: prefersDark
    };

    const merged: AppConfig = { ...this.DEFAULT_CONFIG, ...detected };

    this.configSubject.next(merged);
    this.saveConfig();
    this.applyConfig(merged);
  }

  /**
   * Sauvegarde dans le localStorage
   */
  private saveConfig(): void {
    try {
      localStorage.setItem(
        this.CONFIG_KEY,
        JSON.stringify(this.configSubject.value)
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration:', error);
    }
  }

  /**
   * Applique la configuration au DOM (thème, langue, taille de police, animations)
   */
  private applyConfig(config: AppConfig): void {
    // Thème sombre / clair
    document.body.classList.toggle('dark', config.darkMode);

    // Taille de police
    document.documentElement.style.setProperty(
      '--app-font-size',
      this.mapFontSize(config.fontSize)
    );

    // Animations
    document.body.classList.toggle('no-animations', !config.animations);

    // Langue HTML
    document.documentElement.lang = config.language || 'fr';
  }

  /**
   * Convertit le choix de fontSize en valeur CSS
   */
  private mapFontSize(size: AppConfig['fontSize']): string {
    switch (size) {
      case 'small':
        return '14px';
      case 'large':
        return '18px';
      case 'medium':
      default:
        return '16px';
    }
  }

  /**
   * Nom de l'environnement courant
   */
  getEnvironmentName(): string {
    return this.env.production ? 'production' : 'development';
  }

  /**
   * Niveau de log configuré dans environment.logging.level
   */
  getLogLevel(): string {
    return this.env.logging?.level ?? 'info';
  }

  /**
   * Indique si le mode hors-ligne est activé dans l'environnement
   */
  isOfflineModeEnabled(): boolean {
    return this.env.features?.offlineMode ?? false;
  }

  /**
   * Exporte la configuration utilisateur pour sauvegarde/partage
   */
  exportConfig(): string {
    return JSON.stringify(
      {
        userConfig: this.configSubject.value,
        exportedAt: new Date().toISOString(),
        app: this.env.app ?? null
      },
      null,
      2
    );
  }

  /**
   * Importe une configuration utilisateur exportée
   */
  importConfig(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (parsed && parsed.userConfig) {
        const merged: AppConfig = {
          ...this.DEFAULT_CONFIG,
          ...parsed.userConfig
        };
        this.configSubject.next(merged);
        this.saveConfig();
        this.applyConfig(merged);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de l'import de la configuration:", error);
      return false;
    }
  }
}
