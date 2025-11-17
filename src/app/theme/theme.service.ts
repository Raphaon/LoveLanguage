import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../core/services/storage.service';

export type CupidTheme = 'cupid-dark' | 'cupid-light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'cupid_theme_preference';
  private readonly prefersDark = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : ({ matches: false, addEventListener: () => {} } as MediaQueryList);
  private readonly theme$ = new BehaviorSubject<CupidTheme>('cupid-dark');

  constructor(private storage: StorageService) {
    this.prefersDark.addEventListener('change', (event) => {
      if (!this.hasExplicitPreference()) {
        this.applyTheme(event.matches ? 'cupid-dark' : 'cupid-light', false);
      }
    });
  }

  async init(): Promise<void> {
    const stored = await this.storage.get(this.storageKey) as CupidTheme | null;
    const initial = stored ?? (this.prefersDark.matches ? 'cupid-dark' : 'cupid-light');
    this.applyTheme(initial, !!stored);
  }

  get themeChanges() {
    return this.theme$.asObservable();
  }

  async toggle(): Promise<CupidTheme> {
    const next = this.theme$.value === 'cupid-dark' ? 'cupid-light' : 'cupid-dark';
    await this.setTheme(next);
    return next;
  }

  async setTheme(theme: CupidTheme): Promise<void> {
    this.applyTheme(theme, true);
    await this.storage.set(this.storageKey, theme);
  }

  private hasExplicitPreference(): boolean {
    return document.body.dataset.caTheme !== undefined;
  }

  private applyTheme(theme: CupidTheme, withDataset = true): void {
    document.body.classList.toggle('ca-light', theme === 'cupid-light');
    document.body.classList.toggle('ca-dark', theme === 'cupid-dark');
    if (withDataset) {
      document.body.dataset.caTheme = theme;
    }
    document.documentElement.style.setProperty('color-scheme', theme === 'cupid-dark' ? 'dark' : 'light');
    this.theme$.next(theme);
  }
}
