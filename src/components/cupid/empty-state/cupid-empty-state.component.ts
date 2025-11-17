import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cupid-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cupid-empty-state.component.html',
  styleUrls: ['./cupid-empty-state.component.scss']
})
export class CupidEmptyStateComponent {
  @Input() title = 'Rien à afficher';
  @Input() description = 'Essaie d’ajuster tes filtres ou reviens plus tard.';
}
