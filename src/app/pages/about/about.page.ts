import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trendingUpOutline, checkmarkCircle, timeOutline } from 'ionicons/icons';

type FeatureStatus = 'done' | 'in-progress' | 'planned';

interface FeatureOverview {
  title: string;
  description: string;
  area: string;
  status: FeatureStatus;
  version: 'V1' | 'V2' | 'V3';
}

interface EvolutionLevel {
  title: string;
  stage: 'V1' | 'V2' | 'V3';
  status: FeatureStatus;
  summary: string;
  highlights: string[];
  kpis: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonLabel,
    IonChip,
    IonBadge,
    RouterLink
  ]
})
export class AboutPage {
  readonly featureOverview: FeatureOverview[] = [
    {
      title: 'Test des langages',
      description: 'Quiz dynamique, sauvegarde locale et scoring automatique.',
      area: 'Diagnostic',
      status: 'done',
      version: 'V1'
    },
    {
      title: 'Résultats visuels',
      description: 'Histogramme custom et synthèse des langages principal / secondaire.',
      area: 'Visualisation',
      status: 'done',
      version: 'V1'
    },
    {
      title: 'Suggestions de gestes & cadeaux',
      description: 'Filtrage par relation, catégorie et favoris.',
      area: 'Inspiration',
      status: 'done',
      version: 'V1'
    },
    {
      title: 'Questions pour faire connaissance',
      description: 'Banque thématique avec niveaux et tirage aléatoire.',
      area: 'Conversation',
      status: 'done',
      version: 'V1'
    },
    {
      title: 'Quiz génératif depuis les gestes',
      description: 'Construction d’items à partir d’une base de gestes (backlog de variantes).',
      area: 'Produit',
      status: 'done',
      version: 'V2'
    },
    {
      title: 'Mode connecté & synchronisation',
      description: 'Backend Nest/Firebase pour comptes, stats et favoris multi-supports.',
      area: 'Plateforme',
      status: 'planned',
      version: 'V2'
    },
    {
      title: 'Mode Couple et comparatif',
      description: 'Comparaison de profils, notifications et défis communs.',
      area: 'Relation',
      status: 'planned',
      version: 'V3'
    }
  ];

  readonly evolutionLevels: EvolutionLevel[] = [
    {
      title: 'MVP complet – Expérience solo',
      stage: 'V1',
      status: 'done',
      summary: 'Onboarding, quiz, histogramme et suggestions opérationnels sur mobile (100% specs V1).',
      highlights: [
        'Flux test → résultats → idées utilisable offline',
        'Banque de questions et gestes structurée (JSON + services)',
        'Stockage local chiffré via Ionic Storage'
      ],
      kpis: 'Couverture fonctionnelle 100% sur V1'
    },
    {
      title: 'Expérience connectée & contenu évolutif',
      stage: 'V2',
      status: 'in-progress',
      summary: 'Le moteur procédural transforme les gestes en nouvelles questions en attendant la synchro connectée.',
      highlights: [
        'Moteur de quiz génératif branché sur la base de gestes',
        'Architecture prête pour Nest/Firebase',
        'Favoris/paramètres sérialisés pour future synchro'
      ],
      kpis: 'Spécifications couvertes à ~60% (côté front)'
    },
    {
      title: 'Mode couple & intelligence relationnelle',
      stage: 'V3',
      status: 'planned',
      summary: 'Fonctionnalités sociales (comparaison, chat privé, notifications intelligentes).',
      highlights: [
        'Comparaison de profils et compatibilité',
        'Défis hebdo et rappels contextuels',
        'Packs premium et personnalisation poussée'
      ],
      kpis: 'Concept validé – implémentation à venir'
    }
  ];

  readonly currentEvolution = {
    label: 'Niveau actuel',
    stage: 'V2',
    message: 'Le moteur de quiz génératif est en production mobile et prépare la connexion aux services Nest/Firebase.'
  };

  constructor() {
    addIcons({ trendingUpOutline, checkmarkCircle, timeOutline });
  }

  getStatusLabel(status: FeatureStatus): string {
    switch (status) {
      case 'done':
        return 'Livré';
      case 'in-progress':
        return 'En cours';
      default:
        return 'Planifié';
    }
  }

  getStatusColor(status: FeatureStatus): 'success' | 'warning' | 'medium' {
    switch (status) {
      case 'done':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'medium';
    }
  }
}
