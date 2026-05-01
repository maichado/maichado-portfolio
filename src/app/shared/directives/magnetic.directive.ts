import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';

/**
 * Efeito magnético: o elemento se desloca em direção ao cursor enquanto ele
 * está sobre a hitbox. Ideal para CTAs e ícones sociais.
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  /** Quanto o elemento se desloca (0..1). */
  readonly strength = input<number>(0.35);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private enabled = false;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fine = window.matchMedia('(pointer: fine)').matches;
      this.enabled = !reduced && fine;
      if (this.enabled) {
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 240ms var(--ease-out-quint)');
        this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');
      }
    });
  }

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    if (!this.enabled) return;
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * this.strength();
    const dy = (e.clientY - cy) * this.strength();
    this.renderer.setStyle(node, 'transform', `translate3d(${dx}px, ${dy}px, 0)`);
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (!this.enabled) return;
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(0, 0, 0)');
  }
}
