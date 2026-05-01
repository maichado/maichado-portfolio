import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NAV_SECTIONS } from '../../../core/constants/nav-sections';
import { ActiveSectionService } from '../../../core/services/active-section.service';
import { MagneticDirective } from '../../directives/magnetic.directive';

interface PillStyle {
  left: number;
  width: number;
}

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [MagneticDirective],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly active = inject(ActiveSectionService);

  protected readonly sections = NAV_SECTIONS.filter((s) => s.id !== 'contato');
  protected readonly cta = NAV_SECTIONS.find((s) => s.id === 'contato')!;

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly pill = signal<PillStyle | null>(null);
  protected readonly activeId = computed(() => this.active.activeId());

  private readonly nav = viewChild<ElementRef<HTMLElement>>('navList');
  private readonly links = viewChildren<ElementRef<HTMLAnchorElement>>('navLink');

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const onScroll = () => this.scrolled.set(window.scrollY > 12);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => this.updatePill());
      this.updatePill();
    });

    // Recalcula a posição da pill sempre que muda a seção ativa
    effect(() => {
      this.activeId();
      if (isPlatformBrowser(this.platformId)) {
        queueMicrotask(() => this.updatePill());
      }
    });
  }

  protected onLinkClick(): void {
    this.menuOpen.set(false);
    window.setTimeout(() => this.updatePill(), 320);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  private updatePill(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const links = this.links();
    const navEl = this.nav()?.nativeElement;
    if (!navEl || links.length === 0) return;

    const id = this.activeId();
    const target = links.find((ref) => ref.nativeElement.dataset['id'] === id);
    if (!target) {
      this.pill.set(null);
      return;
    }
    const navRect = navEl.getBoundingClientRect();
    const r = target.nativeElement.getBoundingClientRect();
    this.pill.set({ left: r.left - navRect.left, width: r.width });
  }
}
