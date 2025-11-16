import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageScore, LoveLanguageCode, LOVE_LANGUAGES_DATA } from '../../../core/models';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ChartComponent {
  @Input() scores: LanguageScore[] = [];

  getLanguageLabel(code: LoveLanguageCode): string {
    const language = LOVE_LANGUAGES_DATA.find(l => l.code === code);
    return language ? language.label : code;
  }

  getLanguageColor(code: LoveLanguageCode): string {
    const language = LOVE_LANGUAGES_DATA.find(l => l.code === code);
    return language ? language.color : '#cccccc';
  }
}