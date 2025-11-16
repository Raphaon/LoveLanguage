import { Injectable } from '@angular/core';
import {
  Gesture,
  LoveLanguageCode,
  Question,
  QuestionOption,
  RELATIONSHIP_TYPE_LABELS,
  RelationshipType,
  UserProfile
} from '../models';
import { GestureService } from './gesture.service';

@Injectable({
  providedIn: 'root'
})
export class ProceduralQuestionService {
  private readonly templates = [
    'Quel geste nourrirait le plus {{relation}} cette semaine ?',
    'Lequel de ces rituels ferait le plus de bien à {{prenom}} ?',
    'Quelle attention te semble la plus adaptée pour relancer {{relation}} ?',
    'Quelle idée testerais-tu aujourd\'hui pour créer un déclic ?'
  ];

  private readonly optionLabels: QuestionOption['label'][] = ['A', 'B', 'C', 'D', 'E'];

  private readonly languageOrder: LoveLanguageCode[] = [
    LoveLanguageCode.MQ,
    LoveLanguageCode.SR,
    LoveLanguageCode.PQ,
    LoveLanguageCode.CD,
    LoveLanguageCode.TP
  ];

  constructor(private gestureService: GestureService) {}

  async generateQuestions(userProfile: UserProfile, desiredCount: number): Promise<Question[]> {
    if (!desiredCount || desiredCount <= 0) {
      return [];
    }

    await this.ensureGesturesLoaded();

    const allGestures = this.gestureService.getAllGestures();
    if (!allGestures.length) {
      return [];
    }

    const relationshipGestures = this.filterGesturesByRelationship(allGestures, userProfile.relationshipType);
    const relationshipPool = this.groupByLanguage(relationshipGestures);
    const fallbackPool = this.groupByLanguage(allGestures);

    const mergedPool = this.languageOrder.reduce<Record<LoveLanguageCode, Gesture[]>>((acc, code) => {
      const targeted = relationshipPool[code];
      const fallback = fallbackPool[code].filter(gesture => !targeted.find(t => t.id === gesture.id));
      acc[code] = this.shuffle([...targeted, ...fallback]);
      return acc;
    }, {
      [LoveLanguageCode.MQ]: [],
      [LoveLanguageCode.SR]: [],
      [LoveLanguageCode.PQ]: [],
      [LoveLanguageCode.CD]: [],
      [LoveLanguageCode.TP]: []
    });

    const maxQuestions = Math.min(
      desiredCount,
      ...this.languageOrder.map(code => mergedPool[code].length)
    );

    if (!maxQuestions || !Number.isFinite(maxQuestions)) {
      return [];
    }

    const templates = this.shuffle([...this.templates]);
    const questions: Question[] = [];

    for (let i = 0; i < maxQuestions; i++) {
      const options = this.languageOrder.map((code, index) => {
        const gesture = mergedPool[code].shift();
        if (!gesture) {
          return undefined;
        }
        return {
          id: `proc_${code}_${gesture.id}_${i}`,
          label: this.optionLabels[index],
          texte: gesture.title,
          codeLangage: gesture.codeLangage
        } as QuestionOption;
      }).filter((option): option is QuestionOption => !!option);

      if (options.length !== this.languageOrder.length) {
        break;
      }

      const template = templates[i % templates.length];
      questions.push({
        id: `proc_${Date.now()}_${i}`,
        texte: this.formatTemplate(template, userProfile),
        ordre: 1000 + i,
        actif: true,
        relationshipTypes: userProfile.relationshipType ? [userProfile.relationshipType] : undefined,
        options,
        source: 'procedural'
      });
    }

    return questions;
  }

  private async ensureGesturesLoaded(): Promise<void> {
    if (!this.gestureService.getAllGestures().length) {
      await this.gestureService.loadGestures();
    }
  }

  private filterGesturesByRelationship(gestures: Gesture[], relationship?: RelationshipType): Gesture[] {
    if (!relationship) {
      return gestures;
    }
    return gestures.filter(gesture =>
      !gesture.relationshipTypes?.length || gesture.relationshipTypes.includes(relationship)
    );
  }

  private groupByLanguage(gestures: Gesture[]): Record<LoveLanguageCode, Gesture[]> {
    const grouped: Record<LoveLanguageCode, Gesture[]> = {
      [LoveLanguageCode.MQ]: [],
      [LoveLanguageCode.SR]: [],
      [LoveLanguageCode.PQ]: [],
      [LoveLanguageCode.CD]: [],
      [LoveLanguageCode.TP]: []
    };

    gestures.forEach(gesture => {
      grouped[gesture.codeLangage].push(gesture);
    });

    return grouped;
  }

  private formatTemplate(template: string, profile: UserProfile): string {
    const relationLabel = RELATIONSHIP_TYPE_LABELS[profile.relationshipType]?.toLowerCase() || 'ta relation';
    const name = profile.prenom?.trim() || 'toi';
    return template
      .replace(/\{\{relation\}\}/g, relationLabel)
      .replace(/\{\{prenom\}\}/g, name);
  }

  private shuffle<T>(items: T[]): T[] {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
