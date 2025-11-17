export const environment = {
  production: false,
  
  // Configuration de l'application
  app: {
    name: 'Love Language (Dev)',
    version: '2.0.0-dev',
    description: 'Découvrez votre langage de l\'amour',
    author: 'Votre équipe',
    copyright: '© 2025 Love Language App'
  },
  
  // Configuration des APIs
  api: {
    baseUrl: 'http://localhost:8100',
    timeout: 60000, // 60 secondes en dev
    retryAttempts: 1,
    retryDelay: 500
  },
  
  // Configuration du stockage local
  storage: {
    prefix: 'love_language_dev_',
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
    enabled: false, // Désactivé en dev pour voir les changements
    ttl: 60000, // 1 minute en dev
    maxSize: 10,
    strategy: 'LRU'
  },
  
  // Configuration des fonctionnalités
  features: {
    analytics: false,
    crashReporting: false,
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
    minimumQuestionsForResult: 5, // Plus bas en dev pour tester
    enableTimer: false,
    shuffleQuestions: false, // Désactivé en dev pour prévisibilité
    allowSkip: true, // Activé en dev pour faciliter les tests
    showProgress: true
  },
  
  // Configuration des conversations
  conversation: {
    cacheQuestions: false,
    maxHistorySize: 20,
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
    level: 'debug', // Tout logger en dev
    enableConsole: true,
    enableRemote: false,
    remoteEndpoint: ''
  },
  
  // Configuration de la sécurité
  security: {
    enableCSP: false, // Désactivé en dev pour flexibilité
    enableSanitization: true,
    maxUploadSize: 10485760, // 10MB en dev
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    sessionTimeout: 0 // Pas de timeout en dev
  },
  
  // Configuration des performances
  performance: {
    enableLazyLoading: true,
    preloadModules: false, // Désactivé en dev pour debug
    enablePrefetch: false,
    imageOptimization: false,
    enableCompression: false,
    bundleAnalyzer: true // Activé en dev pour analyse
  },
  
  // Configuration PWA
  pwa: {
    enabled: false, // Désactivé en dev
    autoUpdate: false,
    updateCheckInterval: 0,
    offlineStrategy: 'network-first',
    precacheAssets: []
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
    privacyPolicy: 'http://localhost:8100/privacy',
    termsOfService: 'http://localhost:8100/terms',
    support: 'http://localhost:8100/support',
    feedback: 'http://localhost:8100/feedback',
    website: 'http://localhost:8100'
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
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  },
  
  // Configuration des tests
  testing: {
    enableMocks: true,
    testTimeout: 10000,
    coverage: true
  }
};
