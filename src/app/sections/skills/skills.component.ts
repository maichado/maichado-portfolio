import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionAnchorDirective } from '../../shared/directives/section-anchor.directive';

interface SkillChip {
  name: string;
  years: number;
  description: string;
  iconId: 'angular' | 'flutter' | 'react' | 'typescript' | 'ionic' | 'mfe';
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [SectionAnchorDirective, RevealDirective, NgTemplateOutlet],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  protected readonly skills: readonly SkillChip[] = [
    { name: 'Angular', years: 4, description: 'Arquitetura e times', iconId: 'angular' },
    { name: 'Flutter', years: 5, description: 'Apps críticos offline', iconId: 'flutter' },
    { name: 'React Native', years: 3, description: 'Mobile corporativo', iconId: 'react' },
    { name: 'TypeScript', years: 4, description: 'Contratos sólidos', iconId: 'typescript' },
    { name: 'Ionic', years: 3, description: 'Híbrido com sabor nativo', iconId: 'ionic' },
    { name: 'Microfrontends', years: 1, description: 'Governança e autonomia', iconId: 'mfe' },
  ];

  // Duplicado para loop infinito sem corte visível
  protected readonly looped = [...this.skills, ...this.skills];

  // Linha 2 invertida para direção oposta
  protected readonly reversed = [...this.skills].reverse();
  protected readonly loopedReversed = [...this.reversed, ...this.reversed];
}
