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

      this.marqueeObserver = new IntersectionObserver(
        ([e]) => {
          this.marqueePaused.set(!(e?.isIntersecting ?? false));
        },
        { rootMargin: '60px', threshold: 0 },
      );
      this.marqueeObserver.observe(zone);
    });
  }

  ngOnDestroy(): void {
    this.marqueeObserver?.disconnect();
  }
}
