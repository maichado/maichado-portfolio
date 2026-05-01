import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Encapsula GSAP + ScrollTrigger com proteção de SSR.
 * Toda chamada a `gsap` deve passar por aqui ou checar `isBrowser` antes.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly platformId = inject(PLATFORM_ID);
  private registered = false;

  readonly isBrowser = isPlatformBrowser(this.platformId);

  init(): void {
    if (!this.isBrowser || this.registered) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    this.registered = true;
  }

  /** Refresh quando layout muda (ex.: após `@defer` resolver). */
  refresh(): void {
    if (!this.isBrowser) {
      return;
    }
    ScrollTrigger.refresh();
  }

  /** Acesso direto ao gsap (lazy-init). */
  get gsap(): typeof gsap {
    this.init();
    return gsap;
  }

  get scrollTrigger(): typeof ScrollTrigger {
    this.init();
    return ScrollTrigger;
  }

  prefersReducedMotion(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
