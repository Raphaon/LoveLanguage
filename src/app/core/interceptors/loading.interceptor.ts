import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';
import { finalize } from 'rxjs/operators';

// Map pour tracker les requêtes en cours
const activeRequests = new Map<string, any>();
let loadingElement: HTMLIonLoadingElement | null = null;

/**
 * Interceptor pour afficher un indicateur de chargement pendant les requêtes HTTP
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingController = inject(LoadingController);
  
  // Ignorer les requêtes pour les assets statiques
  if (req.url.includes('/assets/') || req.url.includes('.json')) {
    return next(req);
  }
  
  // Générer un ID unique pour cette requête
  const requestId = `${req.method}-${req.url}-${Date.now()}`;
  
  // Ajouter la requête à la map
  activeRequests.set(requestId, true);
  
  // Afficher le loader si c'est la première requête
  if (activeRequests.size === 1) {
    showLoader(loadingController);
  }
  
  return next(req).pipe(
    finalize(() => {
      // Retirer la requête de la map
      activeRequests.delete(requestId);
      
      // Masquer le loader si toutes les requêtes sont terminées
      if (activeRequests.size === 0) {
        hideLoader();
      }
    })
  );
};

/**
 * Affiche l'indicateur de chargement
 */
async function showLoader(loadingController: LoadingController): Promise<void> {
  try {
    // Créer le loader avec un délai pour éviter le flash sur les requêtes rapides
    loadingElement = await loadingController.create({
      message: 'Chargement...',
      spinner: 'crescent',
      cssClass: 'custom-loading-class',
      duration: 30000, // Timeout de sécurité
      backdropDismiss: false
    });
    
    // Délai de 200ms avant d'afficher le loader (évite le flash)
    setTimeout(async () => {
      if (activeRequests.size > 0 && loadingElement) {
        await loadingElement.present();
      }
    }, 200);
  } catch (error) {
    console.error('Error showing loader:', error);
  }
}

/**
 * Masque l'indicateur de chargement
 */
async function hideLoader(): Promise<void> {
  try {
    // Petit délai pour éviter le scintillement
    setTimeout(async () => {
      if (loadingElement) {
        await loadingElement.dismiss();
        loadingElement = null;
      }
    }, 100);
  } catch (error) {
    console.error('Error hiding loader:', error);
    loadingElement = null;
  }
}
