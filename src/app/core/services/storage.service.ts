import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { CurrentTestState, UserProfile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly storageReady: Promise<Storage>;
  private readonly KEYS = {
    USER_PROFILE: 'user_profile',
    TEST_RESULTS: 'test_results',
    CURRENT_TEST: 'current_test',
    FAVORITE_GESTURES: 'favorite_gestures',
    FAVORITE_CONVERSATION_QUESTIONS: 'favorite_conversation_questions',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    APP_SETTINGS: 'app_settings'
  };

  // Fallback en mémoire / localStorage si Ionic Storage échoue
  private memoryStore = new Map<string, any>();

  constructor(private storage: Storage) {
    this.storageReady = this.init();
  }

  /**
   * Appelé par AppComponent au démarrage.
   * Ne doit plus jamais rejeter avec "No available storage method found".
   */
  async ready(): Promise<Storage> {
    return await this.storageReady;
  }

  /**
   * Initialise le Storage Ionic, et si ça échoue,
   * bascule sur un stockage fallback (localStorage ou mémoire).
   */
  public async init(): Promise<Storage> {
    if (this._storage) {
      return this._storage;
    }

    try {
      // Tentative d'initialisation de @ionic/storage-angular
      this._storage = await this.storage.create();
      console.log('✅ StorageService: Ionic Storage initialisé');
      return this._storage;
    } catch (error) {
      console.warn(
        '⚠️ StorageService: échec de l’initialisation d’Ionic Storage, fallback sur stockage local/mémoire.',
        error
      );

      // Création d’un "fake" Storage compatible, basé sur localStorage / mémoire
      const fallback: any = {
        set: async (key: string, value: any) => {
          try {
            if (this.hasLocalStorage()) {
              localStorage.setItem(key, JSON.stringify(value));
            } else {
              this.memoryStore.set(key, value);
            }
          } catch {
            this.memoryStore.set(key, value);
          }
        },
        get: async (key: string) => {
          try {
            if (this.hasLocalStorage()) {
              const raw = localStorage.getItem(key);
              if (raw === null) return null;
              try {
                return JSON.parse(raw);
              } catch {
                return raw;
              }
            } else {
              return this.memoryStore.get(key) ?? null;
            }
          } catch {
            return this.memoryStore.get(key) ?? null;
          }
        },
        remove: async (key: string) => {
          try {
            if (this.hasLocalStorage()) {
              localStorage.removeItem(key);
            }
            this.memoryStore.delete(key);
          } catch {
            this.memoryStore.delete(key);
          }
        },
        clear: async () => {
          try {
            if (this.hasLocalStorage()) {
              localStorage.clear();
            }
          } catch {
            // ignore
          }
          this.memoryStore.clear();
        },
        keys: async () => {
          const keys = new Set<string>();
          if (this.hasLocalStorage()) {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key) keys.add(key);
            }
          }
          this.memoryStore.forEach((_value, key) => keys.add(key));
          return Array.from(keys);
        }
      };

      this._storage = fallback as Storage;
      console.log('✅ StorageService: fallback storage initialisé');
      return this._storage;
    }
  }

  /**
   * Vérifie si localStorage est disponible
   */
  private hasLocalStorage(): boolean {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false;
      }
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private async getStore(): Promise<Storage> {
    if (this._storage) {
      return this._storage;
    }
    return this.storageReady;
  }

  async set(key: string, value: any): Promise<void> {
    const store = await this.getStore();
    await store.set(key, value);
  }

  async get(key: string): Promise<any> {
    const store = await this.getStore();
    return await store.get(key);
  }

  async remove(key: string): Promise<void> {
    const store = await this.getStore();
    await store.remove(key);
  }

  async clear(): Promise<void> {
    const store = await this.getStore();
    await store.clear();
  }

  async keys(): Promise<string[]> {
    const store = await this.getStore();
    return await store.keys();
  }

  // -----------------------------
  // Méthodes métier existantes
  // -----------------------------

  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.set(this.KEYS.USER_PROFILE, profile);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    return await this.get(this.KEYS.USER_PROFILE);
  }

  async hasUserProfile(): Promise<boolean> {
    const profile = await this.getUserProfile();
    return !!profile;
  }

  async saveTestResult(result: any): Promise<void> {
    const results = await this.getTestResults() || [];
    results.push(result);
    await this.set(this.KEYS.TEST_RESULTS, results);
  }

  async getTestResults(): Promise<any[]> {
    return await this.get(this.KEYS.TEST_RESULTS) || [];
  }

  async getLastTestResult(): Promise<any> {
    const results = await this.getTestResults();
    return results.length > 0 ? results[results.length - 1] : null;
  }

  async saveCurrentTest(testData: CurrentTestState): Promise<void> {
    await this.set(this.KEYS.CURRENT_TEST, testData);
  }

  async getCurrentTest(): Promise<CurrentTestState | null> {
    return await this.get(this.KEYS.CURRENT_TEST);
  }

  async clearCurrentTest(): Promise<void> {
    await this.remove(this.KEYS.CURRENT_TEST);
  }

  async saveFavoriteGestures(gestureIds: string[]): Promise<void> {
    await this.set(this.KEYS.FAVORITE_GESTURES, gestureIds);
  }

  async getFavoriteGestures(): Promise<string[]> {
    return await this.get(this.KEYS.FAVORITE_GESTURES) || [];
  }

  async addFavoriteGesture(gestureId: string): Promise<void> {
    const favorites = await this.getFavoriteGestures();
    if (!favorites.includes(gestureId)) {
      favorites.push(gestureId);
      await this.saveFavoriteGestures(favorites);
    }
  }

  async removeFavoriteGesture(gestureId: string): Promise<void> {
    const favorites = await this.getFavoriteGestures();
    const index = favorites.indexOf(gestureId);
    if (index > -1) {
      favorites.splice(index, 1);
      await this.saveFavoriteGestures(favorites);
    }
  }

  async setOnboardingCompleted(completed: boolean = true): Promise<void> {
    await this.set(this.KEYS.ONBOARDING_COMPLETED, completed);
  }

  async isOnboardingCompleted(): Promise<boolean> {
    return await this.get(this.KEYS.ONBOARDING_COMPLETED) || false;
  }

  async getFavoriteConversationQuestions(): Promise<string[]> {
    return await this.get(this.KEYS.FAVORITE_CONVERSATION_QUESTIONS) || [];
  }

  async saveFavoriteConversationQuestions(questionIds: string[]): Promise<void> {
    await this.set(this.KEYS.FAVORITE_CONVERSATION_QUESTIONS, questionIds);
  }

  async addFavoriteConversationQuestion(questionId: string): Promise<void> {
    const favorites = await this.getFavoriteConversationQuestions();
    if (!favorites.includes(questionId)) {
      favorites.push(questionId);
      await this.saveFavoriteConversationQuestions(favorites);
    }
  }

  async removeFavoriteConversationQuestion(questionId: string): Promise<void> {
    const favorites = await this.getFavoriteConversationQuestions();
    const index = favorites.indexOf(questionId);
    if (index > -1) {
      favorites.splice(index, 1);
      await this.saveFavoriteConversationQuestions(favorites);
    }
  }

  async resetApp(): Promise<void> {
    await this.clear();
  }
}
