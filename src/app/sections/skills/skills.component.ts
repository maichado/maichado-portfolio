import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionAnchorDirective } from '../../shared/directives/section-anchor.directive';

interface SkillChip {
  name: string;
  years: number;
  description: string;
  iconId:
    | 'angular'
    | 'flutter'
    | 'react'
    | 'typescript'
    | 'ionic'
    | 'mfe'
    | 'kotlin'
    | 'githubActions'
    | 'architecture';
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [SectionAnchorDirective, RevealDirective, NgTemplateOutlet],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly marqueesZone = viewChild<ElementRef<HTMLElement>>('marqueeZone');
  private marqueeObserver?: IntersectionObserver;

  /** Em true quando as marquees estão fora da viewport — animação pausada */
  protected readonly marqueePaused = signal(false);

  protected readonly skills: readonly SkillChip[] = [
    { name: 'Angular', years: 5, description: 'Arquitetura e times', iconId: 'angular' },
    { name: 'Flutter', years: 5, description: 'Apps críticos offline', iconId: 'flutter' },
    { name: 'React Native', years: 3, description: 'Mobile corporativo', iconId: 'react' },
    { name: 'React', years: 3, description: 'UI web e ecossistema', iconId: 'react' },
    { name: 'TypeScript', years: 4, description: 'Contratos sólidos', iconId: 'typescript' },
    { name: 'Ionic', years: 3, description: 'Híbrido com sabor nativo', iconId: 'ionic' },
    { name: 'Microfrontends', years: 3, description: 'Governança e autonomia', iconId: 'mfe' },
    { name: 'Kotlin', years: 2, description: 'Android nativo', iconId: 'kotlin' },
    { name: 'CI/CD · GitHub Actions', years: 4, description: 'Pipelines enterprise', iconId: 'githubActions' },
    {
      name: 'Arquitetura de Software',
      years: 3,
      description: 'Microfrontends e sistemas escaláveis',
      iconId: 'architecture',
    },
  ];

  // Duplicado para loop infinito sem corte visível
  protected readonly looped = [...this.skills, ...this.skills];

  // Linha 2 invertida para direção oposta
  protected readonly reversed = [...this.skills].reverse();
  protected readonly loopedReversed = [...this.reversed, ...this.reversed];

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const zone = this.marqueesZone()?.nativeElement;
      if (!zone) return;

      // #region agent log
      const __agentPost = (
        hypothesisId: string,
        location: string,
        message: string,
        data: Record<string, unknown>,
      ) => {
        fetch('http://127.0.0.1:7553/ingest/688feb5b-3217-4be4-b162-4dbd0223a087', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': 'a8737a',
          },
          body: JSON.stringify({
            sessionId: 'a8737a',
            hypothesisId,
            location,
            message,
            data,
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      };
      const __rect = zone.getBoundingClientRect();
      const __rm = window.matchMedia('(prefers-reduced-motion: reduce)');
      __agentPost('H3', 'skills.component.ts:init', 'marqueeZone mount + prefs', {
        reducedMotion: __rm.matches,
        zoneW: __rect.width,
        zoneH: __rect.height,
      });
      // #endregion agent log

      this.marqueeObserver = new IntersectionObserver(
        ([e]) => {
          // #region agent log
          const interacting = !!(e?.isIntersecting ?? false);
          __agentPost('H1', 'skills.component.ts:io', 'IntersectionObserver', {
            isIntersecting: interacting,
            ratio: e?.intersectionRatio,
            pausedWillBe: !interacting,
          });
          // #endregion agent log
          this.marqueePaused.set(!(e?.isIntersecting ?? false));
        },
        { rootMargin: '60px', threshold: 0 },
      );
      this.marqueeObserver.observe(zone);

      // Amostragem tardia do estado efetivo de animação/CSS (instrumentação apenas)
      // #region agent log
      window.setTimeout(() => {
        const tracks = zone.querySelectorAll<HTMLElement>('.marquee__track');
        const section = zone.closest('.skills');
        tracks.forEach((el, idx) => {
          const cs = getComputedStyle(el);
          __agentPost('H2', 'skills.component.ts:sample', `track[${idx}] computed`, {
            animationName: cs.animationName,
            animationPlayState: cs.animationPlayState,
            animationDuration: cs.animationDuration,
            transform: cs.transform,
            scrollW: el.scrollWidth,
          });
        });
        __agentPost('H5', 'skills.component.ts:sample', 'section flags', {
          hasPausedClass: section?.classList.contains('skills--marquee-paused') ?? null,
          signalPaused: this.marqueePaused(),
        });
      }, 2100);
      // #endregion agent log
    });
  }

  ngOnDestroy(): void {
    this.marqueeObserver?.disconnect();
  }
}
