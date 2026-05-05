import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';

type GameStatus = 'idle' | 'playing' | 'paused' | 'over';

interface Obstacle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  nearHit: boolean;
}

interface TrailDot {
  x: number;
  y: number;
  a: number;
}

const STORAGE_KEY = 'mm.heroGame.best';

@Component({
  selector: 'app-hero-game',
  standalone: true,
  templateUrl: './hero-game.component.html',
  styleUrl: './hero-game.component.scss',
})
export class HeroGameComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  protected readonly wrapper = viewChild.required<ElementRef<HTMLElement>>('wrapper');
  protected readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  protected readonly open = signal(false);
  protected readonly status = signal<GameStatus>('idle');
  protected readonly score = signal(0);
  protected readonly best = signal(0);
  protected readonly durationMs = signal(15000);
  protected readonly timeLeft = signal(15);

  private ctx: CanvasRenderingContext2D | null = null;
  private dpr = 1;
  private width = 0;
  private height = 0;

  private rafId = 0;
  private lastTs = 0;
  private elapsed = 0;
  private running = false;
  private isVisible = true;
  private reducedMotion = false;

  // player state
  private px = 0;
  private py = 0;
  private tx = 0;
  private ty = 0;
  private pr = 6.5;

  // game entities
  private obstacles: Obstacle[] = [];
  private trail: TrailDot[] = [];
  private spawnAcc = 0;
  private nearMissAcc = 0;

  // tokens
  private accent = '#7af5c4';
  private accentGlow = 'rgba(122, 245, 196, 0.45)';

  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  private prevOverflow = '';
  private prevTouchAction = '';
  private prevPosition = '';
  private prevTop = '';
  private prevLeft = '';
  private prevRight = '';
  private prevWidth = '';
  private lockedScrollY = 0;
  private scrollLockActive = false;

  private readonly onPointerMove = (e: PointerEvent) => {
    if (this.status() === 'idle') return;
    const rect = this.canvas().nativeElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.width;
    const y = ((e.clientY - rect.top) / rect.height) * this.height;
    this.tx = clamp(x, this.pr, this.width - this.pr);
    this.ty = clamp(y, this.pr, this.height - this.pr);
  };

  private readonly onPointerDown = (e: PointerEvent) => {
    if (this.status() === 'idle') return;
    // evita selecionar texto/scroll acidental no mobile
    e.preventDefault();
  };

  protected setDifficulty(ms: number): void {
    this.durationMs.set(ms);
    this.timeLeft.set(Math.ceil(ms / 1000));
  }

  private readonly onVisibility = () => {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.document.hidden && this.status() === 'playing') {
      this.status.set('paused');
    }
  };

  protected onBackdrop(e: PointerEvent): void {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? Number(stored) : 0;
      this.best.set(Number.isFinite(parsed) ? parsed : 0);
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.setupCanvas();
      this.attachObservers();
      this.document.addEventListener('visibilitychange', this.onVisibility);
      this.drawFrame(); // desenho inicial (idle)
    });

    // Modal: trava scroll mantendo a posição (evita backdrop “errado” com página scrollada + iOS).
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const isOpen = this.open();
      const body = this.document.body;
      const html = this.document.documentElement;

      if (isOpen) {
        this.lockedScrollY = window.scrollY || html.scrollTop;
        if (!this.scrollLockActive) {
          this.prevOverflow = body.style.overflow;
          this.prevTouchAction = body.style.touchAction;
          this.prevPosition = body.style.position;
          this.prevTop = body.style.top;
          this.prevLeft = body.style.left;
          this.prevRight = body.style.right;
          this.prevWidth = body.style.width;
          this.scrollLockActive = true;
        }

        body.style.overflow = 'hidden';
        body.style.touchAction = 'none';
        body.style.position = 'fixed';
        body.style.top = `-${this.lockedScrollY}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        return;
      }

      if (!this.scrollLockActive) return;

      this.scrollLockActive = false;
      body.style.overflow = this.prevOverflow;
      body.style.touchAction = this.prevTouchAction;
      body.style.position = this.prevPosition;
      body.style.top = this.prevTop;
      body.style.left = this.prevLeft;
      body.style.right = this.prevRight;
      body.style.width = this.prevWidth;

      const y = this.lockedScrollY;
      window.requestAnimationFrame(() => window.scrollTo(0, y));
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stopLoop();
    this.detachObservers();
    this.detachListeners();
    this.document.removeEventListener('visibilitychange', this.onVisibility);
    if (!this.scrollLockActive) return;
    this.scrollLockActive = false;
    const body = this.document.body;
    body.style.overflow = this.prevOverflow;
    body.style.touchAction = this.prevTouchAction;
    body.style.position = this.prevPosition;
    body.style.top = this.prevTop;
    body.style.left = this.prevLeft;
    body.style.right = this.prevRight;
    body.style.width = this.prevWidth;
    window.scrollTo(0, this.lockedScrollY);
  }

  protected openModal(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.open.set(true);
    this.status.set('idle');
    this.drawFrame();
  }

  protected close(): void {
    this.open.set(false);
    this.status.set('idle');
    this.stopLoop();
    this.drawFrame();
  }

  protected start(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.ctx) this.setupCanvas();
    this.open.set(true);
    this.status.set('playing');
    // Dois frames: após abrir o modal/layout flex o canvas costuma medir 0×0 no primeiro RAF.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        this.resize();
        this.resetGame();
        this.startLoop();
      }),
    );
  }

  protected restart(): void {
    if (this.status() === 'idle') return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        this.resize();
        this.resetGame();
        this.status.set('playing');
        this.lastTs = performance.now();
        if (!this.running) {
          this.startLoop();
        }
      }),
    );
  }

  protected togglePause(): void {
    const s = this.status();
    if (s === 'playing') {
      this.status.set('paused');
      return;
    }
    if (s === 'paused') {
      this.status.set('playing');
      this.lastTs = performance.now();
      return;
    }
  }

  private setupCanvas(): void {
    const canvasEl = this.canvas().nativeElement;
    const ctx = canvasEl.getContext('2d', { alpha: true });
    if (!ctx) return;
    this.ctx = ctx;
    this.readTokens();
    this.resize();

    this.detachListeners();
    canvasEl.addEventListener('pointermove', this.onPointerMove, { passive: true });
    canvasEl.addEventListener('pointerdown', this.onPointerDown, { passive: false });
  }

  private detachListeners(): void {
    const el = this.canvas()?.nativeElement;
    if (!el) return;
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerdown', this.onPointerDown);
  }

  private readTokens(): void {
    const styles = getComputedStyle(this.wrapper().nativeElement);
    const accent = styles.getPropertyValue('--color-accent').trim();
    const glow = styles.getPropertyValue('--color-accent-glow').trim();
    if (accent) this.accent = accent;
    if (glow) this.accentGlow = glow;
  }

  private attachObservers(): void {
    const el = this.canvas().nativeElement;
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      this.drawFrame();
    });
    this.resizeObserver.observe(el);

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
        // Com modal aberto o canvas está sobre a viewport; não pausar só porque o chip do hero saiu da área visível.
        if (!this.isVisible && !this.open()) {
          if (this.status() === 'playing') this.status.set('paused');
        }
      },
      { threshold: 0.05 },
    );
    this.intersectionObserver.observe(this.wrapper().nativeElement);
  }

  private detachObservers(): void {
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.resizeObserver = null;
    this.intersectionObserver = null;
  }

  private resize(): void {
    if (!this.ctx) return;
    const canvasEl = this.canvas().nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    let cssW = rect.width;
    let cssH = rect.height;
    if (cssW < 2 || cssH < 2) {
      const stage = canvasEl.closest('.hg-modal__stage');
      if (stage instanceof HTMLElement) {
        cssW = Math.max(cssW, stage.clientWidth, stage.offsetWidth);
        cssH = Math.max(cssH, stage.clientHeight, stage.offsetHeight);
      }
    }

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(32, Math.round(cssW));
    this.height = Math.max(32, Math.round(cssH));

    canvasEl.width = Math.round(this.width * this.dpr);
    canvasEl.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const pad = this.pr + 2;
    if (this.px === 0 && this.py === 0) {
      this.px = this.width * 0.5;
      this.py = this.height * 0.6;
      this.tx = this.px;
      this.ty = this.py;
    } else {
      this.px = clamp(this.px, pad, this.width - pad);
      this.py = clamp(this.py, pad, this.height - pad);
      this.tx = clamp(this.tx, pad, this.width - pad);
      this.ty = clamp(this.ty, pad, this.height - pad);
    }
  }

  private resetGame(): void {
    const duration = this.durationMs();
    this.elapsed = 0;
    this.spawnAcc = 0;
    this.nearMissAcc = 0;
    this.obstacles = [];
    this.trail = [];
    this.score.set(0);
    this.timeLeft.set(Math.ceil(duration / 1000));

    this.px = this.width * 0.5;
    this.py = this.height * 0.65;
    this.tx = this.px;
    this.ty = this.py;
  }

  private startLoop(): void {
    if (this.running) return;
    this.running = true;
    this.lastTs = performance.now();
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  private stopLoop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private tick(ts: number): void {
    if (!this.running) return;
    const dt = Math.min(48, ts - this.lastTs);
    this.lastTs = ts;

    // Enquanto playing/paused/over no modal, o físico não deve depender do chip do hero estar na viewport.
    if (this.status() === 'playing') {
      this.step(dt);
    }

    this.drawFrame();
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  private step(dt: number): void {
    this.elapsed += dt;
    const remain = Math.max(0, this.durationMs() - this.elapsed);
    this.timeLeft.set(Math.ceil(remain / 1000));

    // player smoothing
    const lerp = this.reducedMotion ? 0.22 : 0.18;
    this.px += (this.tx - this.px) * lerp;
    this.py += (this.ty - this.py) * lerp;

    // trail
    if (!this.reducedMotion) {
      this.trail.push({ x: this.px, y: this.py, a: 1 });
      if (this.trail.length > 14) this.trail.shift();
      for (const t of this.trail) t.a *= 0.86;
    } else {
      this.trail = [];
    }

    // spawn obstacles (cap)
    const cap = this.reducedMotion ? 8 : 14;
    this.spawnAcc += dt;
    const baseInterval = 520; // ms
    const accel = Math.min(220, this.elapsed / 120); // a bit faster over time
    const interval = Math.max(260, baseInterval - accel);
    if (this.spawnAcc >= interval && this.obstacles.length < cap) {
      this.spawnAcc = 0;
      this.spawnObstacle();
    }

    const dtSec = dt / 1000;
    for (const o of this.obstacles) {
      o.x += o.vx * dtSec;
      o.y += o.vy * dtSec;
      o.life -= dt;
      o.nearHit = false;

      const d = dist(o.x, o.y, this.px, this.py);
      const hitR = o.r + this.pr;
      if (d <= hitR) {
        this.onHit();
        return;
      }
      const near = hitR + 10;
      if (d <= near) {
        o.nearHit = true;
        this.nearMissAcc += dt;
      }
    }
    this.obstacles = this.obstacles.filter((o) => o.life > 0);

    // score: time survived + near-miss bonus
    const timeScore = Math.floor(this.elapsed / 120);
    const nearScore = Math.floor(this.nearMissAcc / 180);
    this.score.set(timeScore + nearScore);

    if (remain <= 0) {
      this.onWin();
    }
  }

  private spawnObstacle(): void {
    const side = (Math.random() * 4) | 0; // 0 top, 1 right, 2 bottom, 3 left
    const r = 7 + Math.random() * 10;

    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;

    // speed scales lightly
    const speed = 110 + Math.min(110, this.elapsed / 120);

    if (side === 0) {
      x = Math.random() * this.width;
      y = -r - 2;
      vx = (Math.random() - 0.5) * 40;
      vy = speed;
    } else if (side === 2) {
      x = Math.random() * this.width;
      y = this.height + r + 2;
      vx = (Math.random() - 0.5) * 40;
      vy = -speed;
    } else if (side === 1) {
      x = this.width + r + 2;
      y = Math.random() * this.height;
      vx = -speed;
      vy = (Math.random() - 0.5) * 40;
    } else {
      x = -r - 2;
      y = Math.random() * this.height;
      vx = speed;
      vy = (Math.random() - 0.5) * 40;
    }

    // steer slightly toward player for tension
    const steer = 0.16;
    const dx = this.px - x;
    const dy = this.py - y;
    const len = Math.max(1, Math.hypot(dx, dy));
    vx += (dx / len) * speed * steer;
    vy += (dy / len) * speed * steer;

    this.obstacles.push({
      x,
      y,
      r,
      vx,
      vy,
      life: 4200,
      nearHit: false,
    });
  }

  private onHit(): void {
    this.status.set('over');
    this.persistBest();
  }

  private onWin(): void {
    this.status.set('over');
    this.persistBest();
  }

  private persistBest(): void {
    const s = this.score();
    if (s > this.best()) this.best.set(s);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(this.best()));
    } catch {
      // ignore
    }
  }

  private drawFrame(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    // dot grid (mais leve em reduced motion)
    const step = this.reducedMotion ? 18 : 14;
    ctx.fillStyle = this.reducedMotion ? 'rgba(245, 245, 247, 0.04)' : 'rgba(245, 245, 247, 0.05)';
    for (let yy = step; yy < this.height; yy += step) {
      for (let xx = step; xx < this.width; xx += step) {
        ctx.beginPath();
        ctx.arc(xx, yy, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // trail
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      ctx.globalAlpha = t.a * 0.5;
      ctx.fillStyle = this.accent;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // obstacles (cap de blur)
    for (const o of this.obstacles) {
      const glow = this.reducedMotion ? 0 : o.nearHit ? 12 : 8;
      ctx.shadowColor = this.accentGlow;
      ctx.shadowBlur = glow;
      ctx.fillStyle = o.nearHit ? this.accent : 'rgba(245, 245, 247, 0.65)';
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // player
    const active = this.status() !== 'idle';
    if (active) {
      ctx.shadowColor = this.accentGlow;
      ctx.shadowBlur = 16;
      ctx.fillStyle = this.accent;
      ctx.beginPath();
      ctx.arc(this.px, this.py, this.pr, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // ring
      ctx.strokeStyle = 'rgba(245, 245, 247, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.px, this.py, this.pr + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}
