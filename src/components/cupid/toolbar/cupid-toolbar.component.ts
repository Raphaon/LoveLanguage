import { Component, Input } from '@angular/core';
import { IonButtons, IonButton, IonBackButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cupid-toolbar',
  standalone: true,
  imports: [CommonModule, IonToolbar, IonTitle, IonButtons, IonButton, IonBackButton],
  templateUrl: './cupid-toolbar.component.html',
  styleUrls: ['./cupid-toolbar.component.scss']
})
export class CupidToolbarComponent {
  @Input() title = '';
  @Input() showBack = false;
}
