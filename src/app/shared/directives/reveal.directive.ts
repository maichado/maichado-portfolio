import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';

/**
 * Aplica fade-in + translateY assim que o elemento entra no viewport.
 * Uso: `<div appReveal [delay]="200" [y]="40">...</div>`
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    '[attr.data-reveal]': '""',
  },
})
export class RevealDirective implements OnDestroy {
  readonly delay = input<number>(0);
  readonly y = input<number>(28);
  readonly threshold = input<number>(0.18);
  readonly once = input<boolean>(true);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        this.renderer.addClass(this.el.nativeElement, 'is-revealed');
        return;
      }
      const node = this.el.nativeElement;
      this.renderer.setStyle(node, '--reveal-delay', `${this.delay()}ms`);
      this.renderer.setStyle(node, '--reveal-y', `${this.y()}px`);

      this.zone.runOutsideAngular(() => {
        this.observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                this.renderer.addClass(node, 'is-revealed');
                if (this.once()) {
                  this.observer?.disconnect();
                  return;
                }
              } else if (!this.once()) {
                this.renderer.removeClass(node, 'is-revealed');
              }
            }
          },
          { threshold: this.threshold(), rootMargin: '0px 0px -8% 0px' },
        );
        this.observer.observe(node);
      });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
