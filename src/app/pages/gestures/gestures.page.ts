import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonChip,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filterOutline, heart, heartOutline } from 'ionicons/icons';
import {
  Gesture,
  GestureCategory,
  LoveLanguageCode,
  LOVE_LANGUAGES_DATA,
  RELATIONSHIP_TYPE_LABELS,
  RelationshipType
} from '../../core/models';
import { GestureService } from '../../core/services';
import { GestureCardComponent } from '../../shared/components/gesture-card/gesture-card.component';

@Component({
  selector: 'app-gestures',
  templateUrl: './gestures.page.html',
  styleUrls: ['./gestures.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonChip,
    IonSegment,
    IonSegmentButton,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonToggle,
    GestureCardComponent
  ]
})
export class GesturesPage implements OnInit {
  gestures: Gesture[] = [];
  filteredGestures: Gesture[] = [];
  selectedLanguage?: LoveLanguageCode;
  selectedRelationship?: RelationshipType;
  selectedCategory?: GestureCategory;
  search = '';
  favoritesOnly = false;

  languages = LOVE_LANGUAGES_DATA;
  relationshipLabels = RELATIONSHIP_TYPE_LABELS;
  relationshipEntries = Object.entries(RELATIONSHIP_TYPE_LABELS);
  categories: { label: string; value: GestureCategory }[] = [
    { label: 'Cadeaux', value: GestureCategory.CADEAU },
    { label: 'Moments', value: GestureCategory.MOMENT },
    { label: 'Services', value: GestureCategory.SERVICE },
    { label: 'Messages', value: GestureCategory.MESSAGE },
    { label: 'Physique', value: GestureCategory.PHYSIQUE },
    { label: 'Autre', value: GestureCategory.AUTRE }
  ];

  constructor(private gestureService: GestureService) {
    addIcons({ filterOutline, heart, heartOutline });
  }

  async ngOnInit() {
    if (!this.gestureService.getAllGestures().length) {
      await this.gestureService.loadGestures();
    }
    this.gestures = this.gestureService.getAllGestures();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredGestures = this.gestureService.filterGestures({
      codeLangage: this.selectedLanguage,
      relationshipType: this.selectedRelationship,
      categorie: this.selectedCategory,
      searchText: this.search,
      favoritesOnly: this.favoritesOnly
    });
  }

  async toggleFavorite(gestureId: string): Promise<void> {
    await this.gestureService.toggleFavorite(gestureId);
    this.applyFilters();
  }

  onSearchChange(value: string | null | undefined): void {
    this.search = value || '';
    this.applyFilters();
  }

  selectLanguage(code?: LoveLanguageCode): void {
    this.selectedLanguage = code;
    this.applyFilters();
  }

  selectCategory(category?: GestureCategory): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  selectRelationship(type?: RelationshipType | null): void {
    this.selectedRelationship = (type as RelationshipType) || undefined;
    this.applyFilters();
  }
}
