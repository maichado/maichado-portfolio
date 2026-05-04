import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { HeroGameComponent } from '../../shared/components/hero-game/hero-game.component';
import { MagneticDirective } from '../../shared/directives/magnetic.directive';
import { SectionAnchorDirective } from '../../shared/directives/section-anchor.directive';

const TYPEWRITER_PHRASES = [
  'Líder Técnico Frontend',
  'Consultor de Soluções Digitais V',
  'Referência no Banco Bradesco',
];

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SectionAnchorDirective, MagneticDirective, HeroGameComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);

  protected readonly typed = signal('');
  protected readonly entered = signal(false);
  protected readonly section = viewChild.required<ElementRef<HTMLElement>>('section');

  private phraseIdx = 0;
  private charIdx = 0;
  private typingForward = true;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        this.typed.set(TYPEWRITER_PHRASES[0]);
        this.entered.set(true);
        return;
      }
      // dispara animação de entrada
      window.setTimeout(() => this.entered.set(true), 60);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        this.typed.set(TYPEWRITER_PHRASES[0]);
        return;
      }
      window.setTimeout(() => this.typewriterStep(), 1200);
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const node = this.section().nativeElement;
    const rect = node.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const nx = (x - 50) / 50;
    const ny = (y - 50) / 50;
    const rx = (-ny * 7).toFixed(2);
    const ry = (nx * 10).toFixed(2);
    this.renderer.setStyle(node, '--hero-mx', `${x}%`);
    this.renderer.setStyle(node, '--hero-my', `${y}%`);
    this.renderer.setStyle(node, '--name-rx', `${rx}deg`);
    this.renderer.setStyle(node, '--name-ry', `${ry}deg`);
  }

  private typewriterStep(): void {
    const target = TYPEWRITER_PHRASES[this.phraseIdx];
    if (this.typingForward) {
      this.charIdx += 1;
      this.typed.set(target.slice(0, this.charIdx));
      if (this.charIdx >= target.length) {
        this.typingForward = false;
        window.setTimeout(() => this.typewriterStep(), 1800);
        return;
      }
      window.setTimeout(() => this.typewriterStep(), 50 + Math.random() * 35);
    } else {
      this.charIdx -= 1;
      this.typed.set(target.slice(0, this.charIdx));
      if (this.charIdx <= 0) {
        this.typingForward = true;
        this.phraseIdx = (this.phraseIdx + 1) % TYPEWRITER_PHRASES.length;
        window.setTimeout(() => this.typewriterStep(), 350);
        return;
      }
      window.setTimeout(() => this.typewriterStep(), 28);
    }
  }
}
