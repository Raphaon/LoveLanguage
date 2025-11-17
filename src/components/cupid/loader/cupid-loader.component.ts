import { Component, Input } from '@angular/core';
import { IonSkeletonText, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'cupid-loader',
  standalone: true,
  imports: [IonSkeletonText, IonSpinner],
  templateUrl: './cupid-loader.component.html',
  styleUrls: ['./cupid-loader.component.scss']
})
export class CupidLoaderComponent {
  @Input() lines = 3;
  skeletons(): any[] {
    return Array.from({ length: this.lines });
  }
}
