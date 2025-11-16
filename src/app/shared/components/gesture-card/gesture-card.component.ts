import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Gesture, GESTURE_CATEGORY_ICONS } from '../../../core/models';

@Component({
  selector: 'app-gesture-card',
  templateUrl: './gesture-card.component.html',
  styleUrls: ['./gesture-card.component.scss'],
})
export class GestureCardComponent {
  @Input() gesture!: Gesture;
  @Input() showLanguageBadge: boolean = true;
  @Output() favoriteToggled = new EventEmitter<string>();
  @Output() gestureClicked = new EventEmitter<Gesture>();

  categoryIcons = GESTURE_CATEGORY_ICONS;

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteToggled.emit(this.gesture.id);
  }

  onCardClick(): void {
    this.gestureClicked.emit(this.gesture);
  }
}