import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { LoveLanguage, LoveLanguageCode, LOVE_LANGUAGES_DATA } from '../../../core/models';

@Component({
  selector: 'app-language-badge',
  templateUrl: './language-badge.component.html',
  styleUrls: ['./language-badge.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class LanguageBadgeComponent {
  @Input() languageCode!: LoveLanguageCode;
  @Input() showLabel: boolean = true;
  @Input() showIcon: boolean = true;
  @Input() showEmoji: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  get language(): LoveLanguage | undefined {
    return LOVE_LANGUAGES_DATA.find(l => l.code === this.languageCode);
  }

  get badgeClass(): string {
    return `badge-${this.size}`;
  }
}