import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { loadingInterceptor } from './app/core/interceptors/loading.interceptor';

// Configuration optimisée pour l'application standalone
bootstrapApplication(AppComponent, {
  providers: [
    // Stratégie de réutilisation des routes Ionic
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
    // Configuration Ionic Angular
    provideIonicAngular({
      mode: 'ios', // Utiliser le mode iOS pour une meilleure expérience
      animated: true,
      sanitizerEnabled: true
    }),
    
    // Configuration du router avec préchargement
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Configuration HttpClient avec interceptors et fetch API
    provideHttpClient(
      withFetch(), // Utiliser fetch API pour de meilleures performances
      withInterceptors([
        errorInterceptor,
        loadingInterceptor
      ])
    ),
    
    // Configuration du stockage local
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__loveLanguageDB',
        driverOrder: ['indexeddb', 'sqlite', 'websql'],
        storeName: 'keyvaluepairs'
      })
    )
  ],
}).catch(err => {
  console.error('Error bootstrapping app:', err);
  // Afficher une page d'erreur si l'application ne peut pas démarrer
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
      <h1>Oops! Une erreur s'est produite</h1>
      <p>L'application n'a pas pu démarrer. Veuillez rafraîchir la page.</p>
      <button onclick="location.reload()">Rafraîchir</button>
    </div>
  `;
});
