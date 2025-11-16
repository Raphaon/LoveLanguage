# Love Lang – Application mobile

Love Lang est une application Ionic/Angular qui aide les utilisateurs à découvrir leur(s) langage(s) de l'amour grâce à un test guidé, à visualiser leurs résultats, et à trouver des gestes ou questions pour nourrir leurs relations. Ce dépôt contient l'implémentation complète du parcours mobile décrit dans le cahier des charges fourni (quiz, histogramme, suggestions, quiz dynamique et module "faire connaissance").

## ✨ Fonctionnalités principales

- **Onboarding & profil** – Écran d'introduction, collecte du profil et préférences pour personnaliser les contenus.
- **Test des langages** – Quiz dynamique basé sur une base de gestes, navigation question par question, sauvegarde locale et calcul automatique des scores.
- **Résultats visuels** – Histogramme maison, mise en avant des langages principal et secondaire, message de synthèse et raccourcis vers les suggestions.
- **Suggestions de gestes & cadeaux** – Filtrage par type de relation, catégories (cadeaux, moments, messages, services, gestes physiques) et favoris.
- **Questions pour faire connaissance** – Tirage aléatoire avec filtres par thème/niveau, favoris, historique antiredites.
- **Stockage local** – Persistence via `@ionic/storage-angular` pour les profils, résultats et favoris.

## 🧱 Architecture & structure

- **Framework** : Ionic + Angular standalone components.
- **UI** : Pages dédiées (`src/app/pages`) et composants partagés (`src/app/shared/components`).
- **Données** : Sources structurées dans `src/assets/data/` (questions, gestes, prompts de conversation).
- **Services cœur** : Gestion du quiz, scoring, stockage et génération des questions (`src/app/core/services`).

## 🛠️ Fiabilité du stockage

- `StorageService` attend désormais la disponibilité d'Ionic Storage avant toute lecture/écriture, ce qui évite les clics "Commencer le test" sans effet lorsque la base locale n'était pas encore initialisée.
- Toutes les données (profil, onboarding, quiz en cours, favoris) sont donc réellement persistées même si l'utilisateur interagit immédiatement après l'ouverture de l'app.

## 🧠 Parcours Quiz Love Language

Le quiz fonctionne désormais intégralement avec des composants standalone et un service dédié.

1. **Service `LoveLanguageQuizService`** (`src/app/core/services/love-language-quiz.service.ts`)
   - Fournit les questions et métadonnées.
   - Conserve les réponses, calcule les scores et construit un résumé complet prêt pour un histogramme.
   - Expose `isQuizComplete()` *et* `getCompletionSnapshot()` pour empêcher l'accès aux résultats tant que toutes les questions ne sont pas validées et pour afficher une progression fiable.
   - Refuse explicitement le calcul du résumé si le quiz est incomplet afin d'éviter tout état incohérent.
2. **Page `/quiz` (`LoveLanguageQuizPage`)**
   - Affiche une question à la fois, compteur et barre de progression linéaire (mise à jour exacte jusqu'à 100%).
   - Déclenche l'enregistrement de la réponse puis enchaîne automatiquement vers la question suivante.
3. **Page `/quiz-result` (`LoveLanguageResultPage`)**
   - Vérifie que le quiz est complété avant de calculer les scores (avec gestion d'erreurs et redirection le cas échéant).
   - Affiche le langage principal, le secondaire, la progression (questions répondues / total) et les données prêtes pour un histogramme.
   - Permet de relancer immédiatement le quiz.

Ce découplage garantit un flux fiable, testable et facilement extensible (ajout de nouvelles questions, persistance avancée, etc.).

## 🚀 Prise en main

### Prérequis
- Node.js 20+
- npm 10+

### Installation
```bash
npm install
```

### Lancer l'application en développement
```bash
npm start
```
Puis ouvrir http://localhost:4200.

### Build de production
```bash
npm run build
```
Le bundle Angular/Ionic est généré dans `www/` (compatible Capacitor pour Android/iOS).

### Tests unitaires
```bash
npm test
```

## 📁 Ressources utiles
- `src/app/pages` – Pages Onboarding, Profil, Quiz, Résultats, Gestes, Conversation, Home.
- `src/app/core/models` – Modèles TypeScript (langages, questions, gestes, résultats).
- `src/assets/data` – Jeux de données JSON pour les questionnaires et suggestions.
- `src/app/shared/components` – Histogramme, badges de langage, cartes de geste, etc.

## 🔐 Confidentialité & évolutions
- Les données restent sur l'appareil (aucun backend requis pour la V1).
- Prévu pour évoluer vers une V2/V3 : backend Nest/Firebase, mode couple, notifications intelligentes.

## 💡 Améliorations proposées

- **Persistance des quiz en cours** : stocker l'état courant dans `StorageService` afin que l'utilisateur puisse reprendre même après avoir quitté l'app.
- **Mode révision** : permettre de revoir l'ensemble des questions et réponses choisies après le résultat pour faciliter les discussions de couple.
- **Histogramme interactif** : brancher `ngx-charts` ou `ng-apexcharts` afin de transformer les données `histogramData` en graphique animé.
- **Comparaison de profils** : une fois les deux partenaires testés, afficher une vue combinée (radar, delta par langage) dans la page résultats.

Pour toute contribution, ouvrez une issue ou une pull request en décrivant clairement les changements.
