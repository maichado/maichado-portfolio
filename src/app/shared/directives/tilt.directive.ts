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
 * 3D tilt suave em cards. Aplica perspective + rotateX/Y conforme a posição
 * do mouse dentro do elemento. Respeita `prefers-reduced-motion`.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective {
  /** Intensidade máxima de rotação em graus. */
  readonly tiltMax = input<number>(8);
  /** Escala no hover (subtle pop). */
  readonly tiltScale = input<number>(1.02);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private enabled = false;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fine = window.matchMedia('(pointer: fine)').matches;
      this.enabled = !reduced && fine;
      if (this.enabled) {
        this.renderer.setStyle(this.el.nativeElement, 'transform-style', 'preserve-3d');
        this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 320ms var(--ease-out-quint)');
      }
    });
  }

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    if (!this.enabled) return;
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -2 * this.tiltMax();
    const ry = (px - 0.5) * 2 * this.tiltMax();
    const sc = this.tiltScale();
    this.renderer.setStyle(
      node,
      'transform',
      `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${sc})`,
    );
    this.renderer.setStyle(node, '--tilt-mx', `${(px * 100).toFixed(2)}%`);
    this.renderer.setStyle(node, '--tilt-my', `${(py * 100).toFixed(2)}%`);
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (!this.enabled) return;
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      'perspective(900px) rotateX(0) rotateY(0) scale(1)',
    );
  }
}
