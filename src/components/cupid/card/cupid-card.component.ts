import { Component, Input } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'cupid-card',
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent],
  templateUrl: './cupid-card.component.html',
  styleUrls: ['./cupid-card.component.scss']
})
export class CupidCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';
}
