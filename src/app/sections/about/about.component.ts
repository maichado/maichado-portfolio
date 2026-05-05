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
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionAnchorDirective } from '../../shared/directives/section-anchor.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';

interface Milestone {
  period: string;
  company: string;
  role: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SectionAnchorDirective, RevealDirective, TiltDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly scroll = inject(ScrollService);

  protected readonly timeline = viewChild<ElementRef<HTMLElement>>('timeline');
  protected readonly progressPath = viewChild<ElementRef<SVGPathElement>>('progressPath');

  protected readonly milestones: readonly Milestone[] = [
    { period: '2024 — atual', company: 'Capgemini · Bradesco', role: 'Líder Técnico Angular 19 · Microfrontends' },
    { period: '2023 — 2024', company: 'Capgemini · Bombeiros SP', role: 'Flutter crítico offline-first' },
    { period: '2022 — 2023', company: 'Capgemini · Volkswagen', role: 'React Native · VWeu / FsConecta' },
    { period: '2021 — 2022', company: 'Capgemini · Bradesco Seguros · BITZ', role: 'Ionic · Open Finance' },
    { period: '2020 — 2021', company: 'Pulsati', role: 'Telemedicina Rede D\'Or' },
    { period: '2019 — 2020', company: 'Nexello', role: 'Dois apps Flutter publicados' },
    { period: '2018 — 2019', company: 'Webmais', role: 'Início de carreira aos 17' },
  ];

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (this.scroll.prefersReducedMotion()) return;

      const timelineEl = this.timeline()?.nativeElement;
      if (!timelineEl) return;

      const gsap = this.scroll.gsap;

      // Linha que desenha conforme scroll
      gsap.fromTo(
        timelineEl.querySelector('.timeline__rail-fill') as Element,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineEl,
            start: 'top 70%',
            end: 'bottom 75%',
            scrub: 0.6,
          },
        },
      );

      // Stagger dos milestones
      gsap.utils.toArray<HTMLElement>(timelineEl.querySelectorAll('.milestone')).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });
    });
  }
}
