import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { ScrollService } from '../../core/services/scroll.service';
import { PROJECTS, STACK_LABEL, type StackTagId } from '../../core/data/projects';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionAnchorDirective } from '../../shared/directives/section-anchor.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';

/** Profundidades 3D reutilizadas (VW / Bradesco Seguros / BITZ / Rede D'Or / Nexello — logos em PNG). */
const LOGO_3D_LAYER_VARS = [
  { z: '-18px', op: '0.09', br: '0.42', front: false },
  { z: '-14px', op: '0.12', br: '0.48', front: false },
  { z: '-10px', op: '0.16', br: '0.54', front: false },
  { z: '-6px', op: '0.22', br: '0.62', front: false },
  { z: '-2px', op: '0.32', br: '0.72', front: false },
  { z: '3px', op: '0.48', br: '0.85', front: false },
  { z: '8px', op: '1', br: '1', front: true },
] as const;

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SectionAnchorDirective, RevealDirective, TiltDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly scroll = inject(ScrollService);

  protected readonly projects = PROJECTS;
  protected readonly stackLabel = STACK_LABEL;
  protected readonly segurosLogoLayers = LOGO_3D_LAYER_VARS;
  protected readonly bitzLogoLayers = LOGO_3D_LAYER_VARS;
  protected readonly redeDorLogoLayers = LOGO_3D_LAYER_VARS;
  protected readonly nexelloLogoLayers = LOGO_3D_LAYER_VARS;
  protected readonly grid = viewChild<ElementRef<HTMLElement>>('grid');

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (this.scroll.prefersReducedMotion()) return;

      const gridEl = this.grid()?.nativeElement;
      if (!gridEl) return;

      const cards = Array.from(gridEl.querySelectorAll<HTMLElement>('.project-card'));
      const gsap = this.scroll.gsap;
      const ScrollTrigger = this.scroll.scrollTrigger;

      cards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: (idx % 3) * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      // Refresh after fonts/images settle
      window.setTimeout(() => ScrollTrigger.refresh(), 400);
    });
  }

  protected stackTagClass(id: StackTagId): string {
    return `tag tag--${id}`;
  }
}
