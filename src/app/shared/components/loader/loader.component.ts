import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  inject,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';

const SESSION_KEY = 'mm.loader.shown';
const MIN_DURATION_MS = 1500;

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly finished = output<void>();

  protected readonly visible = signal(true);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        this.dismiss();
        return;
      }

      const seen = window.sessionStorage.getItem(SESSION_KEY);
      if (seen === '1') {
        this.dismiss();
        return;
      }

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const delay = reduced ? 200 : MIN_DURATION_MS;
      window.setTimeout(() => this.dismiss(), delay);
    });
  }

  private dismiss(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    }
    this.visible.set(false);
    window.setTimeout(() => this.finished.emit(), 600);
  }
}
