import { Component, Input } from '@angular/core';
import { IonButton, IonRippleEffect } from '@ionic/angular/standalone';

type CupidButtonVariant = 'primary' | 'secondary' | 'outline';
type CupidButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'cupid-button',
  standalone: true,
  imports: [IonButton, IonRippleEffect],
  templateUrl: './cupid-button.component.html',
  styleUrls: ['./cupid-button.component.scss']
})
export class CupidButtonComponent {
  @Input() variant: CupidButtonVariant = 'primary';
  @Input() size: CupidButtonSize = 'md';
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input('aria-label') ariaLabel?: string;

  get expand(): 'block' | undefined {
    return this.fullWidth ? 'block' : undefined;
  }

  get ionicSize(): 'small' | 'default' | 'large' {
    switch (this.size) {
      case 'sm':
        return 'small';
      case 'lg':
        return 'large';
      default:
        return 'default';
    }
  }

  get fill(): 'solid' | 'outline' {
    return this.variant === 'outline' ? 'outline' : 'solid';
  }

  get color(): string {
    if (this.variant === 'secondary') {
      return 'secondary';
    }
    return 'primary';
  }
}
