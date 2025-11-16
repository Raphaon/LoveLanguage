import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { 
  Gesture, 
  GestureData, 
  GestureFilter,
  LoveLanguageCode,
  RelationshipType,
  GestureCategory
} from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GestureService {
  private gestures: Gesture[] = [];
  private favoriteGestureIds: string[] = [];
  private loadingPromise?: Promise<void>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.loadFavorites();
  }

  async loadGestures(): Promise<void> {
    if (this.gestures.length) {
      return;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        const data = await firstValueFrom(
          this.http.get<GestureData>('assets/data/gestures.json')
        );
        if (data?.gestures) {
          this.gestures = data.gestures;
          await this.updateFavoriteStatus();
        }
      } catch (error) {
        console.error('Erreur lors du chargement des gestes:', error);
        throw error;
      } finally {
        this.loadingPromise = undefined;
      }
    })();

    return this.loadingPromise;
  }

  private async loadFavorites(): Promise<void> {
    this.favoriteGestureIds = await this.storageService.getFavoriteGestures();
  }

  private async updateFavoriteStatus(): Promise<void> {
    this.gestures.forEach(gesture => {
      gesture.isFavorite = this.favoriteGestureIds.includes(gesture.id);
    });
  }

  getAllGestures(): Gesture[] {
    return this.gestures;
  }

  filterGestures(filter: GestureFilter): Gesture[] {
    let filtered = [...this.gestures];

    if (filter.codeLangage) {
      filtered = filtered.filter(g => g.codeLangage === filter.codeLangage);
    }

    if (filter.relationshipType) {
      filtered = filtered.filter(g => 
        g.relationshipTypes.includes(filter.relationshipType!)
      );
    }

    if (filter.categorie) {
      filtered = filtered.filter(g => g.categorie === filter.categorie);
    }

    if (filter.searchText && filter.searchText.trim() !== '') {
      const search = filter.searchText.toLowerCase();
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(search) ||
        g.description.toLowerCase().includes(search)
      );
    }

    if (filter.favoritesOnly) {
      filtered = filtered.filter(g => g.isFavorite);
    }

    return filtered;
  }

  getGesturesForLanguage(
    languageCode: LoveLanguageCode, 
    relationshipType?: RelationshipType,
    limit?: number
  ): Gesture[] {
    const filter: GestureFilter = {
      codeLangage: languageCode,
      relationshipType: relationshipType
    };

    let gestures = this.filterGestures(filter);

    gestures = this.shuffleArray(gestures);

    if (limit && limit > 0) {
      gestures = gestures.slice(0, limit);
    }

    return gestures;
  }

  getGestureById(id: string): Gesture | undefined {
    return this.gestures.find(g => g.id === id);
  }

  async toggleFavorite(gestureId: string): Promise<boolean> {
    const gesture = this.getGestureById(gestureId);
    if (!gesture) {
      return false;
    }

    if (gesture.isFavorite) {
      await this.storageService.removeFavoriteGesture(gestureId);
      gesture.isFavorite = false;
      this.favoriteGestureIds = this.favoriteGestureIds.filter(id => id !== gestureId);
    } else {
      await this.storageService.addFavoriteGesture(gestureId);
      gesture.isFavorite = true;
      this.favoriteGestureIds = [...this.favoriteGestureIds, gestureId];
    }

    return gesture.isFavorite;
  }

  getFavoriteGestures(): Gesture[] {
    return this.gestures.filter(g => g.isFavorite);
  }

  getRandomSuggestions(count: number = 5): Gesture[] {
    const shuffled = this.shuffleArray([...this.gestures]);
    return shuffled.slice(0, count);
  }

  getGestureCountByLanguage(languageCode: LoveLanguageCode): number {
    return this.gestures.filter(g => g.codeLangage === languageCode).length;
  }

  getGestureCountByCategory(category: GestureCategory): number {
    return this.gestures.filter(g => g.categorie === category).length;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getStatistics() {
    return {
      total: this.gestures.length,
      byLanguage: {
        MQ: this.getGestureCountByLanguage(LoveLanguageCode.MQ),
        SR: this.getGestureCountByLanguage(LoveLanguageCode.SR),
        PQ: this.getGestureCountByLanguage(LoveLanguageCode.PQ),
        CD: this.getGestureCountByLanguage(LoveLanguageCode.CD),
        TP: this.getGestureCountByLanguage(LoveLanguageCode.TP)
      },
      byCategory: {
        cadeau: this.getGestureCountByCategory(GestureCategory.CADEAU),
        moment: this.getGestureCountByCategory(GestureCategory.MOMENT),
        service: this.getGestureCountByCategory(GestureCategory.SERVICE),
        message: this.getGestureCountByCategory(GestureCategory.MESSAGE),
        physique: this.getGestureCountByCategory(GestureCategory.PHYSIQUE),
        autre: this.getGestureCountByCategory(GestureCategory.AUTRE)
      },
      favorites: this.favoriteGestureIds.length
    };
  }
}