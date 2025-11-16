import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage)
  },
  {
    path: 'profile-setup',
    loadComponent: () => import('./pages/profile-setup/profile-setup.page').then(m => m.ProfileSetupPage)
  },
  {
    path: 'quiz',
    loadComponent: () => import('./pages/love-language-quiz/love-language-quiz.page').then(m => m.LoveLanguageQuizPage)
  },
  {
    path: 'quiz-result',
    loadComponent: () => import('./pages/love-language-result/love-language-result.page').then(m => m.LoveLanguageResultPage)
  },
  {
    path: 'results',
    redirectTo: 'quiz-result',
    pathMatch: 'full'
  },
  {
    path: 'gestures',
    loadComponent: () => import('./pages/gestures/gestures.page').then(m => m.GesturesPage)
  },
  {
    path: 'questions',
    loadComponent: () => import('./pages/conversation/conversation.page').then(m => m.ConversationPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
