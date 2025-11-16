# Love Lang – Application mobile

Love Lang est une application Ionic/Angular qui aide les utilisateurs à découvrir leur(s) langage(s) de l'amour grâce à un test guidé, à visualiser leurs résultats, et à trouver des gestes ou questions pour nourrir leurs relations. Ce dépôt contient l'implémentation complète du parcours mobile décrit dans le cahier des charges fourni (quiz, histogramme, suggestions, quiz dynamique et module "faire connaissance").

## ✨ Fonctionnalités principales

- **Onboarding & profil** – Écran d'introduction, collecte du profil et préférences pour personnaliser les contenus.
- **Test des langages** – Quiz dynamique basé sur une base de gestes, navigation question par question, sauvegarde locale et calcul automatique des scores.
- **Résultats visuels** – Histogramme maison, mise en avant des langages principal et secondaire, message de synthèse et raccourcis vers les suggestions.
- **Suggestions de gestes & cadeaux** – Filtrage par type de relation, catégories (cadeaux, moments, messages, services, gestes physiques) et favoris.
- **Questions pour faire connaissance** – Tirage aléatoire avec filtres par thème/niveau, favoris, historique antiredites.
- **Stockage local** – Persistence via `@ionic/storage-angular` pour les profils, résultats et favoris.

## 🚀 Cap sur la V2

- **Moteur de quiz génératif** – Les questions complémentaires sont construites dynamiquement à partir de la base de gestes.
- **Préparation du mode connecté** – Les services restent sérialisés/local-first pour brancher facilement Nest/Firebase ensuite.

## 🧱 Architecture & structure

- **Framework** : Ionic + Angular standalone components.
- **UI** : Pages dédiées (`src/app/pages`) et composants partagés (`src/app/shared/components`).
- **Données** : Sources structurées dans `src/assets/data/` (questions, gestes, prompts de conversation).
- **Services cœur** : Gestion du quiz, scoring, stockage et génération des questions (`src/app/core/services`).

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

Pour toute contribution, ouvrez une issue ou une pull request en décrivant clairement les changements.
