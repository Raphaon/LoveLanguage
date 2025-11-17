export const environment = {
  production: true,
  
  // Configuration de l'application
  app: {
    name: 'Love Language',
    version: '2.0.0',
    description: 'Découvrez votre langage de l\'amour',
    author: 'Votre équipe',
    copyright: '© 2025 Love Language App'
  },
  
  // Configuration des APIs
  api: {
    baseUrl: 'https://api.lovelanguage.app',
    timeout: 30000, // 30 secondes
    retryAttempts: 3,
    retryDelay: 1000 // 1 seconde
  },
  
  // Configuration du stockage local
  storage: {
    prefix: 'love_language_',
    version: 1,
    keys: {
      userProfile: 'user_profile',
      testResults: 'test_results',
      favorites: 'favorites',
      settings: 'settings',
      onboarding: 'onboarding_completed',
      lastSync: 'last_sync'
    }
  },
  
  // Configuration du cache
  cache: {
    enabled: true,
    ttl: 3600000, // 1 heure en millisecondes
    maxSize: 50, // Nombre maximum d'entrées en cache
    strategy: 'LRU' // Least Recently Used
  },
  
  // Configuration des fonctionnalités
  features: {
    analytics: true,
    crashReporting: true,
    pushNotifications: false,
    offlineMode: true,
    socialSharing: true,
    darkMode: true,
    multiLanguage: false,
    cloudSync: false
  },
  
  // Configuration du quiz
  quiz: {
    questionsPerSession: 15,
    minimumQuestionsForResult: 10,
    enableTimer: false,
    shuffleQuestions: true,
    allowSkip: false,
    showProgress: true
  },
  
  // Configuration des conversations
  conversation: {
    cacheQuestions: true,
    maxHistorySize: 100,
    enableFavorites: true,
    enableSharing: true,
    defaultDepth: 'moyen',
    animationsEnabled: true
  },
  
  // Configuration des gestes
  gestures: {
    maxFavorites: 50,
    enableSuggestions: true,
    suggestionsPerPage: 10,
    enableFiltering: true,
    enableSearch: true
  },
  
  // Configuration du logging
  logging: {
    level: 'error', // 'debug' | 'info' | 'warn' | 'error' | 'none'
    enableConsole: false,
    enableRemote: true,
    remoteEndpoint: 'https://logs.lovelanguage.app'
  },
  
  // Configuration de la sécurité
  security: {
    enableCSP: true,
    enableSanitization: true,
    maxUploadSize: 5242880, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    sessionTimeout: 86400000 // 24 heures
  },
  
  // Configuration des performances
  performance: {
    enableLazyLoading: true,
    preloadModules: true,
    enablePrefetch: true,
    imageOptimization: true,
    enableCompression: true,
    bundleAnalyzer: false
  },
  
  // Configuration PWA
  pwa: {
    enabled: true,
    autoUpdate: true,
    updateCheckInterval: 3600000, // 1 heure
    offlineStrategy: 'cache-first',
    precacheAssets: [
      '/assets/data/questions.json',
      '/assets/data/gestures.json',
      '/assets/data/conversation-questions.json'
    ]
  },
  
  // Configuration des plateformes
  platform: {
    enableCapacitor: true,
    targetPlatforms: ['ios', 'android', 'web'],
    minimumIOSVersion: '13.0',
    minimumAndroidVersion: '7.0',
    webPushEnabled: false
  },
  
  // URLs externes
  externalUrls: {
    privacyPolicy: 'https://lovelanguage.app/privacy',
    termsOfService: 'https://lovelanguage.app/terms',
    support: 'https://lovelanguage.app/support',
    feedback: 'https://lovelanguage.app/feedback',
    website: 'https://lovelanguage.app'
  },
  
  // Configuration des animations
  animations: {
    enabled: true,
    duration: 300,
    easing: 'ease-in-out',
    pageTransition: 'ios-transition'
  },
  
  // Configuration des médias sociaux
  social: {
    facebook: 'https://facebook.com/lovelanguageapp',
    twitter: 'https://twitter.com/lovelanguageapp',
    instagram: 'https://instagram.com/lovelanguageapp',
    linkedin: 'https://linkedin.com/company/lovelanguageapp'
  },
  
  // Configuration des tests
  testing: {
    enableMocks: false,
    testTimeout: 5000,
    coverage: true
  }
};
