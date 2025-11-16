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

  constructor(private storage: Storage) {
    this.storageReady = this.init();
  }

  async ready(): Promise<Storage> {
    return await this.storageReady;
  }

  public async init(): Promise<Storage> {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
    return this._storage;
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