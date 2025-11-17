import { ToastOptions } from '@ionic/angular';

export const cupidToastPreset = (options: ToastOptions): ToastOptions => ({
  position: 'bottom',
  duration: 2800,
  color: 'dark',
  cssClass: 'cupid-toast',
  mode: 'md',
  ...options
});
