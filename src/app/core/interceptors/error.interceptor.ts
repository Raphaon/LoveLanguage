import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { catchError, throwError, retry, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Interceptor pour gérer les erreurs HTTP de manière centralisée
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastController = inject(ToastController);
  
  // Configuration de retry avec backoff exponentiel
  const retryConfig = {
    maxRetries: 3,
    delay: 1000,
    backoffMultiplier: 2
  };

  return next(req).pipe(
    // Retry logic avec backoff exponentiel pour les erreurs réseau
    retry({
      count: retryConfig.maxRetries,
      delay: (error, retryCount) => {
        // Ne pas retry pour les erreurs 4xx (erreurs client)
        if (error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // Calculer le délai avec backoff exponentiel
        const delay = retryConfig.delay * Math.pow(retryConfig.backoffMultiplier, retryCount - 1);
        console.log(`Retry attempt ${retryCount} after ${delay}ms for ${req.url}`);
        
        return timer(delay);
      }
    }),
    
    // Gestion des erreurs
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur inconnue s\'est produite';
      
      if (error.error instanceof ErrorEvent) {
        // Erreur côté client ou réseau
        errorMessage = `Erreur: ${error.error.message}`;
        console.error('Client-side error:', error.error.message);
      } else {
        // Erreur retournée par le backend
        switch (error.status) {
          case 0:
            errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
            break;
          case 404:
            errorMessage = 'Ressource non trouvée';
            break;
          case 500:
            errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
            break;
          case 503:
            errorMessage = 'Service temporairement indisponible';
            break;
          default:
            errorMessage = `Erreur ${error.status}: ${error.statusText}`;
        }
        console.error(`Backend returned code ${error.status}, body was:`, error.error);
      }

      // Afficher un toast pour les erreurs importantes
      if (error.status !== 404) { // Ne pas afficher de toast pour les 404
        showErrorToast(toastController, errorMessage);
      }

      // Logger l'erreur pour monitoring (pourrait être envoyé à un service de monitoring)
      logError(error, req);

      return throwError(() => error);
    })
  );
};

/**
 * Affiche un toast d'erreur à l'utilisateur
 */
async function showErrorToast(toastController: ToastController, message: string): Promise<void> {
  const toast = await toastController.create({
    message,
    duration: 3000,
    position: 'bottom',
    color: 'danger',
    buttons: [
      {
        text: 'Fermer',
        role: 'cancel'
      }
    ]
  });
  await toast.present();
}

/**
 * Log l'erreur pour monitoring
 */
function logError(error: HttpErrorResponse, req: any): void {
  const errorLog = {
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    status: error.status,
    statusText: error.statusText,
    message: error.message,
    userAgent: navigator.userAgent
  };
  
  // En production, envoyer à un service de monitoring comme Sentry
  console.error('Error Log:', errorLog);
  
  // Sauvegarder localement pour debug
  try {
    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    errors.push(errorLog);
    // Garder seulement les 50 dernières erreurs
    if (errors.length > 50) {
      errors.shift();
    }
    localStorage.setItem('app_errors', JSON.stringify(errors));
  } catch (e) {
    console.error('Could not save error to localStorage:', e);
  }
}
