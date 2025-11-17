import { ModalOptions } from '@ionic/angular';

export const cupidModalPreset = (options: ModalOptions): ModalOptions => ({
  mode: 'md',
  cssClass: 'cupid-modal',
  ...options
});
