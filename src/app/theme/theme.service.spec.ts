import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { StorageService } from '../core/services/storage.service';

class StorageServiceStub {
  store = new Map<string, any>();
  async get(key: string) { return this.store.get(key) ?? null; }
  async set(key: string, value: any) { this.store.set(key, value); }
}

describe('ThemeService', () => {
  let service: ThemeService;
  let storage: StorageServiceStub;

  beforeEach(() => {
    storage = new StorageServiceStub();
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: StorageService, useValue: storage }]
    });
    service = TestBed.inject(ThemeService);
  });

  it('applies stored preference when initializing', async () => {
    await storage.set('cupid_theme_preference', 'cupid-light');
    await service.init();
    expect(document.body.classList.contains('ca-light')).toBeTrue();
  });

  it('toggles theme and persists choice', async () => {
    await service.init();
    const next = await service.toggle();
    expect(['cupid-dark', 'cupid-light']).toContain(next);
    expect(storage.store.get('cupid_theme_preference')).toBe(next);
  });
});
