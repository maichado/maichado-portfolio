import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';

/**
 * Cursor global: moldura em cantoneiras (foco / recorte) com lag + pivô quadrado no ponteiro.
 * Reage a `a, button, [role=button], [data-cursor]`.
 */
@Component({
  selector: 'app-cursor',
  standalone: true,
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.scss',
})
export class CursorComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  protected readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');
  protected readonly shell = viewChild.required<ElementRef<HTMLElement>>('shell');

  private rafId = 0;
  private mx = -100;
  private my = -100;
  private dx = -100;
  private dy = -100;
  private rx = -100;
  private ry = -100;
  private enabled = false;

  private readonly onMove = (e: MouseEvent) => {
    this.mx = e.clientX;
    this.my = e.clientY;
  };
  private readonly onDown = () => this.shell().nativeElement.classList.add('is-pressed');
  private readonly onUp = () => this.shell().nativeElement.classList.remove('is-pressed');
  private readonly onOver = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest(
      'a, button, [role="button"], [data-cursor]',
    );
    if (t) this.shell().nativeElement.classList.add('is-hover');
  };
  private readonly onOut = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest(
      'a, button, [role="button"], [data-cursor]',
    );
    if (t) this.shell().nativeElement.classList.remove('is-hover');
  };

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const fine = window.matchMedia('(pointer: fine)').matches;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!fine || reduced) return;

      this.enabled = true;
      this.document.body.classList.add('is-custom-cursor');
      window.addEventListener('mousemove', this.onMove, { passive: true });
      window.addEventListener('mousedown', this.onDown);
      window.addEventListener('mouseup', this.onUp);
      this.document.addEventListener('mouseover', this.onOver, true);
      this.document.addEventListener('mouseout', this.onOut, true);

      const tick = () => {
        this.dx += (this.mx - this.dx) * 0.35;
        this.dy += (this.my - this.dy) * 0.35;
        this.rx += (this.mx - this.rx) * 0.16;
        this.ry += (this.my - this.ry) * 0.16;

        const dotEl = this.dot().nativeElement;
        const shellEl = this.shell().nativeElement;
        dotEl.style.transform = `translate3d(${this.dx}px, ${this.dy}px, 0)`;
        shellEl.style.transform = `translate3d(${this.rx}px, ${this.ry}px, 0)`;
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId) || !this.enabled) return;
    cancelAnimationFrame(this.rafId);
    this.document.body.classList.remove('is-custom-cursor');
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('mousedown', this.onDown);
    window.removeEventListener('mouseup', this.onUp);
    this.document.removeEventListener('mouseover', this.onOver, true);
    this.document.removeEventListener('mouseout', this.onOut, true);
  }
}
