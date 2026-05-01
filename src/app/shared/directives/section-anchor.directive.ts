import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActiveSectionService } from '../../core/services/active-section.service';

/**
 * Registra a seção no scroll-spy (IntersectionObserver) para o menu ativo.
 */
@Directive({
  selector: '[appSectionAnchor]',
  standalone: true,
})
export class SectionAnchorDirective implements OnInit, OnDestroy {
  readonly appSectionAnchor = input.required<string>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly activeSection = inject(ActiveSectionService);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const id = this.appSectionAnchor();
    const el = this.el.nativeElement;
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && e.intersectionRatio >= 0.35) {
              this.zone.run(() => this.activeSection.setActive(id));
            }
          }
        },
        { root: null, rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25, 0.35, 0.5, 1] },
      );
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
