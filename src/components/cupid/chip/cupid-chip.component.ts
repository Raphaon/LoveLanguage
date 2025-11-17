import { Component, Input } from '@angular/core';
import { IonChip } from '@ionic/angular/standalone';

@Component({
  selector: 'cupid-chip',
  standalone: true,
  imports: [IonChip],
  templateUrl: './cupid-chip.component.html',
  styleUrls: ['./cupid-chip.component.scss']
})
export class CupidChipComponent {
  @Input() active = false;
  @Input() role: string | null = null;
}
