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

      const mobileLike = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;

      if (mobileLike) {
        gsap.set(cards, { opacity: 0, y: 36 });
        ScrollTrigger.batch(cards, {
          once: true,
          start: 'top 93%',
          fastScrollEnd: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.04,
              ease: 'power2.out',
            });
          },
        });
      } else {
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
      }

      window.setTimeout(() => ScrollTrigger.refresh(), 400);
    });
  }

  protected stackTagClass(id: StackTagId): string {
    return `tag tag--${id}`;
  }
}
