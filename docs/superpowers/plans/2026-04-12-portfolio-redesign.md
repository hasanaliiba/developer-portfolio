# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the public-facing portfolio — dark hero with interactive node network, floating pill nav, redesigned About+Skills, case study cards with tag overflow, and a minimal dark contact section — all with Fade Up + Stagger scroll animations.

**Architecture:** All changes are to the existing Angular 17+ standalone component app. No new routes, services, or Firestore changes are needed — only component templates, styles, and two new Angular primitives (a directive and a canvas component). The home page becomes a single scrollable page with anchor sections for About, Work, and Contact.

**Tech Stack:** Angular 17+ (standalone, signals, `toSignal`), Tailwind CSS, CSS custom properties, Canvas API, IntersectionObserver API

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/styles.css` | Modify | Add `@keyframes fadeUp`, `.fade-up` / `.in-view` utility classes, dark-first default |
| `src/app/shared/directives/fade-up.directive.ts` | **Create** | IntersectionObserver directive — adds `in-view` class when element enters viewport |
| `src/app/shared/components/node-canvas/node-canvas.component.ts` | **Create** | Standalone canvas component — animated floating dots that react to mouse |
| `src/app/shared/components/top-nav/top-nav.component.ts` | Modify | Inject ResumeService; add `openResume()` method; add `activeSection` scroll tracking |
| `src/app/shared/components/top-nav/top-nav.component.html` | Modify | Replace with floating pill layout |
| `src/app/app.component.ts` | Modify | Remove `pt-16` from `<main>` (hero handles own spacing) |
| `src/app/app.routes.ts` | Modify | Remove `/resume` route |
| `src/app/pages/home/home.component.ts` | Modify | Add `toSignal` for studies + settings; add `copyEmail()` method |
| `src/app/pages/home/home.component.html` | Modify | Full page rewrite — Hero, About, Work, Contact, Footer sections |
| `src/app/shared/components/case-study-card/case-study-card.component.ts` | Modify | Add `visibleTags` and `overflowCount` computed signals |
| `src/app/shared/components/case-study-card/case-study-card.component.html` | Modify | Dark image header, overlaid tags with +N pill, new card body |

---

## Task 1: Add global animation styles

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add fadeUp keyframe and utility classes**

Open `src/styles.css` and append the following block after the existing `@media (prefers-reduced-motion)` block:

```css
/* ─── Scroll animations ─────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: no-preference) {
  .fade-up {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 500ms ease-out, transform 500ms ease-out;
  }
  .fade-up.in-view {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Elements are always visible when reduced-motion is set */
@media (prefers-reduced-motion: reduce) {
  .fade-up { opacity: 1; transform: none; }
}
```

- [ ] **Step 2: Verify the app still compiles**

```bash
cd "/Users/hasansali/Career/Front-end portfolio/hasan-portfolio"
npx ng build --configuration development 2>&1 | tail -5
```

Expected: `Build at:` line with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "style: add fadeUp keyframe and .fade-up/.in-view utility classes"
```

---

## Task 2: Create FadeUp directive

**Files:**
- Create: `src/app/shared/directives/fade-up.directive.ts`

- [ ] **Step 1: Create the directive file**

```typescript
// src/app/shared/directives/fade-up.directive.ts
import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[fadeUp]',
  standalone: true,
})
export class FadeUpDirective implements OnInit, OnDestroy {
  /** Stagger delay in ms. Pass as [fadeUp]="120 * index" */
  @Input('fadeUp') delayMs: number = 0;

  private el = inject(ElementRef<HTMLElement>);
  private observer!: IntersectionObserver;

  ngOnInit(): void {
    const el = this.el.nativeElement;
    el.classList.add('fade-up');
    if (this.delayMs) {
      el.style.transitionDelay = `${this.delayMs}ms`;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add('in-view');
            this.observer.unobserve(el); // only animate once
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd "/Users/hasansali/Career/Front-end portfolio/hasan-portfolio"
npx ng build --configuration development 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/shared/directives/fade-up.directive.ts
git commit -m "feat: add FadeUpDirective with IntersectionObserver stagger support"
```

---

## Task 3: Create NodeCanvas component

**Files:**
- Create: `src/app/shared/components/node-canvas/node-canvas.component.ts`

- [ ] **Step 1: Create the component**

```typescript
// src/app/shared/components/node-canvas/node-canvas.component.ts
import {
  Component, ElementRef, Input, AfterViewInit,
  OnDestroy, ViewChild, inject, NgZone
} from '@angular/core';

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
}

@Component({
  selector: 'app-node-canvas',
  standalone: true,
  template: `<canvas #canvas class="absolute inset-0 w-full h-full pointer-events-none"></canvas>`,
  host: { class: 'absolute inset-0 overflow-hidden pointer-events-none' },
})
export class NodeCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  /** Use darker green for dark backgrounds, lighter for light */
  @Input() dark = true;

  private zone = inject(NgZone);
  private mouse = { x: -999, y: -999 };
  private nodes: Node[] = [];
  private rafId = 0;
  private resizeObserver!: ResizeObserver;

  private get ctx(): CanvasRenderingContext2D {
    return this.canvasRef.nativeElement.getContext('2d')!;
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.init();
    });
  }

  private init(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;

    // Size canvas to parent
    const resize = () => {
      canvas.width  = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();

    this.resizeObserver = new ResizeObserver(resize);
    this.resizeObserver.observe(parent);

    // Seed nodes
    this.nodes = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 1,
    }));

    // Mouse tracking on parent
    parent.addEventListener('mousemove', this.onMouseMove);
    parent.addEventListener('mouseleave', this.onMouseLeave);

    this.draw();
  }

  private onMouseMove = (e: MouseEvent): void => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  private onMouseLeave = (): void => {
    this.mouse = { x: -999, y: -999 };
  };

  private draw = (): void => {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const MAX_DIST   = 110;
    const MOUSE_DIST = 130;
    const dotColor   = this.dark ? 'rgba(34,197,94,0.5)'  : 'rgba(34,197,94,0.3)';
    const lineBase   = 'rgba(34,197,94,';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move nodes
    this.nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    // Node-to-node lines
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = lineBase + ((1 - d / MAX_DIST) * 0.18) + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Mouse lines
    this.nodes.forEach(n => {
      const d = Math.hypot(n.x - this.mouse.x, n.y - this.mouse.y);
      if (d < MOUSE_DIST) {
        ctx.beginPath();
        ctx.strokeStyle = lineBase + ((1 - d / MOUSE_DIST) * 0.55) + ')';
        ctx.lineWidth = 1;
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.stroke();
      }
    });

    // Dots
    this.nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    });

    this.rafId = requestAnimationFrame(this.draw);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    const parent = this.canvasRef?.nativeElement?.parentElement;
    parent?.removeEventListener('mousemove', this.onMouseMove);
    parent?.removeEventListener('mouseleave', this.onMouseLeave);
  }
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd "/Users/hasansali/Career/Front-end portfolio/hasan-portfolio"
npx ng build --configuration development 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/shared/components/node-canvas/node-canvas.component.ts
git commit -m "feat: add NodeCanvasComponent with mouse-reactive floating dot network"
```

---

## Task 4: Redesign the navigation

**Files:**
- Modify: `src/app/shared/components/top-nav/top-nav.component.ts`
- Modify: `src/app/shared/components/top-nav/top-nav.component.html`
- Modify: `src/app/app.component.ts`

- [ ] **Step 1: Update top-nav.component.ts**

Replace the entire file content:

```typescript
// src/app/shared/components/top-nav/top-nav.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { ResumeService } from '../../../core/services/resume.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  templateUrl: './top-nav.component.html',
})
export class TopNavComponent {
  readonly theme        = inject(ThemeService);
  private resumeService = inject(ResumeService);
  private sanitizer     = inject(DomSanitizer);
  private router        = inject(Router);

  readonly menuOpen     = signal(false);
  readonly activeResume = toSignal(this.resumeService.getActive());

  toggleMenu(): void { this.menuOpen.update(v => !v); }
  closeMenu(): void  { this.menuOpen.set(false); }

  scrollTo(sectionId: string): void {
    this.closeMenu();
    // If not on home page, navigate home first then scroll
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.doScroll(sectionId), 100);
      });
    } else {
      this.doScroll(sectionId);
    }
  }

  private doScroll(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  openResume(): void {
    const resume = this.activeResume();
    if (!resume?.fileUrl) return;
    const fileUrl = resume.fileUrl as string;
    if (fileUrl.startsWith('data:')) {
      // base64 stored in Firestore — convert to blob URL
      const [header, data] = fileUrl.split(',');
      const mime = header.match(/:(.*?);/)?.[1] ?? 'application/pdf';
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } else {
      window.open(fileUrl, '_blank');
    }
  }
}
```

- [ ] **Step 2: Update top-nav.component.html**

Replace the entire file content:

```html
<!-- src/app/shared/components/top-nav/top-nav.component.html -->
<header class="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none" data-no-print>
  <nav class="max-w-6xl mx-auto pointer-events-auto"
       aria-label="Primary navigation">

    <!-- ── Desktop pill ── -->
    <div class="hidden md:flex items-center justify-between
                bg-[var(--c-surface)]/80 backdrop-blur-md
                border border-[var(--c-border)]
                rounded-2xl px-5 py-3 shadow-sm">

      <!-- Name -->
      <button (click)="scrollTo('hero')"
              class="font-bold text-[var(--c-fg)] text-[15px] tracking-tight hover:opacity-70 transition-opacity cursor-pointer">
        Hasan Ali
      </button>

      <!-- Links pill -->
      <div class="inline-flex items-center gap-1
                  bg-[var(--c-surface2)] border border-[var(--c-border)]
                  rounded-full px-1.5 py-1">
        @for (link of [{id:'about',label:'About'},{id:'work',label:'Work'},{id:'contact',label:'Contact'}]; track link.id) {
          <button (click)="scrollTo(link.id)"
                  class="px-4 py-1.5 rounded-full text-[13px] font-medium text-[var(--c-fg-muted)]
                         hover:text-[var(--c-fg)] hover:bg-[var(--c-surface)] transition-all duration-150 cursor-pointer">
            {{ link.label }}
          </button>
        }
        <!-- Resume button -->
        @if (activeResume()) {
          <button (click)="openResume()"
                  class="ml-1 bg-[var(--c-fg)] text-[var(--c-bg)] text-[13px] font-semibold
                         px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity cursor-pointer
                         inline-flex items-center gap-1">
            Resume
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 class="w-3 h-3 opacity-60" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd"/>
            </svg>
          </button>
        }
      </div>

      <!-- Theme toggle -->
      <button (click)="theme.toggle()"
              [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
              class="w-8 h-8 flex items-center justify-center rounded-lg
                     text-[var(--c-fg-subtle)] hover:text-[var(--c-fg-muted)]
                     hover:bg-[var(--c-surface2)] transition-all duration-200 cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-[#22c55e]">
        @if (theme.isDark()) {
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" aria-hidden="true">
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.061zM5.404 6.464a.75.75 0 001.06-1.06L5.404 4.343a.75.75 0 00-1.06 1.06l1.06 1.061z"/>
          </svg>
        } @else {
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clip-rule="evenodd"/>
          </svg>
        }
      </button>
    </div>

    <!-- ── Mobile bar ── -->
    <div class="md:hidden flex items-center justify-between
                bg-[var(--c-surface)]/80 backdrop-blur-md
                border border-[var(--c-border)]
                rounded-2xl px-4 py-3 shadow-sm">
      <button (click)="scrollTo('hero')"
              class="font-bold text-[var(--c-fg)] text-[15px] tracking-tight cursor-pointer">
        Hasan Ali
      </button>
      <div class="flex items-center gap-2">
        <button (click)="theme.toggle()"
                [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--c-fg-subtle)]
                       hover:bg-[var(--c-surface2)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#22c55e]">
          @if (theme.isDark()) {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" aria-hidden="true">
              <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.061zM5.404 6.464a.75.75 0 001.06-1.06L5.404 4.343a.75.75 0 00-1.06 1.06l1.06 1.061z"/>
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clip-rule="evenodd"/>
            </svg>
          }
        </button>
        <button (click)="toggleMenu()"
                [attr.aria-expanded]="menuOpen()"
                aria-label="Toggle menu"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--c-fg-subtle)]
                       hover:bg-[var(--c-surface2)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#22c55e]">
          @if (!menuOpen()) {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" aria-hidden="true">
              <path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clip-rule="evenodd"/>
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
          }
        </button>
      </div>
    </div>

    <!-- Mobile dropdown -->
    @if (menuOpen()) {
      <div class="md:hidden mt-2 bg-[var(--c-surface)]/90 backdrop-blur-md
                  border border-[var(--c-border)] rounded-2xl px-4 py-3
                  flex flex-col gap-1 shadow-sm">
        @for (link of [{id:'about',label:'About'},{id:'work',label:'Work'},{id:'contact',label:'Contact'}]; track link.id) {
          <button (click)="scrollTo(link.id)"
                  class="text-left px-3 py-2.5 rounded-xl text-sm font-medium
                         text-[var(--c-fg-muted)] hover:text-[var(--c-fg)]
                         hover:bg-[var(--c-surface2)] transition-all cursor-pointer">
            {{ link.label }}
          </button>
        }
        @if (activeResume()) {
          <button (click)="openResume()"
                  class="text-left px-3 py-2.5 rounded-xl text-sm font-semibold
                         text-[var(--c-fg)] hover:bg-[var(--c-surface2)] transition-all cursor-pointer">
            Resume ↗
          </button>
        }
      </div>
    }
  </nav>
</header>
```

- [ ] **Step 3: Update app.component.ts — remove pt-16 from main**

Replace the template in `src/app/app.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shared/components/top-nav/top-nav.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopNavComponent],
  template: `
    <div class="min-h-dvh bg-[var(--c-bg)] transition-colors duration-200">
      <app-top-nav />
      <main>
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  readonly theme = inject(ThemeService);
}
```

- [ ] **Step 4: Verify the app compiles and nav renders**

```bash
cd "/Users/hasansali/Career/Front-end portfolio/hasan-portfolio"
npx ng build --configuration development 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/shared/components/top-nav/top-nav.component.ts \
        src/app/shared/components/top-nav/top-nav.component.html \
        src/app/app.component.ts
git commit -m "feat: redesign nav as floating pill with scroll anchors and resume open"
```

---

## Task 5: Update routes — remove /resume

**Files:**
- Modify: `src/app/app.routes.ts`

- [ ] **Step 1: Remove the resume route**

Replace the entire file:

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'work/:slug', loadComponent: () => import('./pages/case-study/case-study.component').then(m => m.CaseStudyComponent) },
  { path: 'admin/login', loadComponent: () => import('./pages/admin/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
```

Note: `/work` and `/contact` routes are removed — these sections now live on the home page as scroll anchors.

- [ ] **Step 2: Verify**

```bash
cd "/Users/hasansali/Career/Front-end portfolio/hasan-portfolio"
npx ng build --configuration development 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/app.routes.ts
git commit -m "refactor: remove /resume, /work, /contact routes — now scroll sections on home"
```

---

## Task 6: Update home.component.ts

**Files:**
- Modify: `src/app/pages/home/home.component.ts`

- [ ] **Step 1: Rewrite the component class**

```typescript
// src/app/pages/home/home.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaseStudyService } from '../../core/services/case-study.service';
import { SettingsService } from '../../core/services/settings.service';
import { CaseStudyCardComponent } from '../../shared/components/case-study-card/case-study-card.component';
import { NodeCanvasComponent } from '../../shared/components/node-canvas/node-canvas.component';
import { FadeUpDirective } from '../../shared/directives/fade-up.directive';

const GRID: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CaseStudyCardComponent, NodeCanvasComponent, FadeUpDirective],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private caseStudyService = inject(CaseStudyService);
  private settingsService  = inject(SettingsService);

  allStudies = toSignal(this.caseStudyService.getVisible(), { initialValue: [] });
  settings   = toSignal(this.settingsService.get(), { initialValue: { columnsPerRow: 2 as const } });
  activeTag  = signal<string | null>(null);

  allTags = computed(() =>
    [...new Set(this.allStudies().flatMap(s => s.tags ?? []))].sort()
  );

  filtered = computed(() => {
    const tag = this.activeTag();
    return tag ? this.allStudies().filter(s => s.tags?.includes(tag)) : this.allStudies();
  });

  gridClass = computed(() => GRID[this.settings().columnsPerRow] ?? GRID[2]);

  setTag(tag: string | null): void { this.activeTag.set(tag); }

  copyEmail(): void {
    navigator.clipboard.writeText('hasanaliiba@gmail.com').catch(() => {});
  }

  readonly copied = signal(false);

  copyEmailWithFeedback(): void {
    navigator.clipboard.writeText('hasanaliiba@gmail.com').then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }).catch(() => {});
  }
}
```

- [ ] **Step 2: Verify compile**

```bash
cd "/Users/hasansali/Career/Front-end portfolio/hasan-portfolio"
npx ng build --configuration development 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/home/home.component.ts
git commit -m "refactor: update HomeComponent with signals, tag filter, email copy"
```

---

## Task 7: Rewrite home.component.html — Hero section

**Files:**
- Modify: `src/app/pages/home/home.component.html`

- [ ] **Step 1: Replace the entire home template**

Replace `src/app/pages/home/home.component.html` with the following complete template (all sections):

```html
<!-- ═══════════════════════════════════════════════
     HERO
════════════════════════════════════════════════ -->
<section id="hero"
         class="relative min-h-dvh bg-[#09090b] flex items-center overflow-hidden">

  <!-- Node canvas background -->
  <app-node-canvas [dark]="true" />

  <!-- Green glow radials -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div class="absolute -top-24 right-0 w-96 h-96 rounded-full opacity-60"
         style="background:radial-gradient(circle,rgba(34,197,94,0.12),transparent 65%);filter:blur(40px)"></div>
    <div class="absolute bottom-0 left-1/4 w-72 h-72 rounded-full opacity-40"
         style="background:radial-gradient(circle,rgba(34,197,94,0.08),transparent 65%);filter:blur(40px)"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full pt-28 pb-20">

    <!-- Available badge -->
    <div class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8
                bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.25)]"
         [fadeUp]="0">
      <span class="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse flex-shrink-0"></span>
      <span class="text-[#4ade80] text-xs font-semibold tracking-wide font-mono">Available for work</span>
    </div>

    <!-- Headline -->
    <h1 class="font-extrabold text-[#fafafa] leading-[1.05] tracking-tight mb-6"
        style="font-size:clamp(2.4rem,6vw,3.5rem)"
        [fadeUp]="80">
      Building digital<br/>
      experiences that<br/>
      <span class="text-[#22c55e]">make an impact</span>
    </h1>

    <!-- Sub-headline -->
    <p class="text-[#71717a] text-base md:text-lg leading-relaxed mb-10 max-w-lg"
       [fadeUp]="160">
      Front End Developer specialising in Angular &amp; Laravel — crafting fast,
      accessible, and beautiful web applications from the UK.
    </p>

    <!-- CTAs -->
    <div class="flex flex-wrap gap-4" [fadeUp]="240">
      <button onclick="document.getElementById('work')?.scrollIntoView({behavior:'smooth'})"
              class="inline-flex items-center gap-2 bg-[#22c55e] text-[#09090b] font-bold
                     text-sm px-7 py-3.5 rounded-xl hover:bg-[#16a34a] transition-colors
                     duration-200 cursor-pointer focus:outline-none focus:ring-2
                     focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#09090b]
                     shadow-md shadow-green-500/20">
        See my work
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
             class="w-4 h-4" aria-hidden="true">
          <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd"/>
        </svg>
      </button>
      <button onclick="document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})"
              class="inline-flex items-center gap-2 bg-transparent text-[#fafafa] font-semibold
                     text-sm px-7 py-3.5 rounded-xl border border-[#3f3f46]
                     hover:border-[#52525b] transition-colors duration-200 cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2
                     focus:ring-offset-[#09090b]">
        Get in touch
      </button>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════
     ABOUT + SKILLS
════════════════════════════════════════════════ -->
<section id="about" class="bg-[var(--c-bg)] py-24">
  <div class="max-w-6xl mx-auto px-6 md:px-10">
    <div class="grid md:grid-cols-2 gap-10 md:gap-16 items-start">

      <!-- Bio -->
      <div>
        <p class="font-mono text-[10px] tracking-[0.22em] uppercase text-[#a1a1aa] mb-3"
           [fadeUp]="0">About Me</p>
        <h2 class="font-bold text-[var(--c-fg)] text-2xl md:text-[26px] leading-snug mb-5"
            [fadeUp]="80">My background</h2>
        <p class="text-[var(--c-fg-muted)] text-[13px] leading-[1.8] mb-4"
           [fadeUp]="160">
          I'm a creative, independent developer with a strong focus on building impactful
          digital experiences — combining clean code with thoughtful UI.
        </p>
        <p class="text-[var(--c-fg-muted)] text-[13px] leading-[1.8] mb-4"
           [fadeUp]="200">
          Specialising in Angular &amp; Laravel, I turn complex problems into fast, accessible,
          production-ready web apps — from component architecture to CI/CD deployment.
        </p>
        <p class="text-[var(--c-fg-subtle)] text-[12px] leading-[1.8] mb-6"
           [fadeUp]="240">
          My journey started with UI design, then evolved into full-stack development. I care
          deeply about performance, accessibility, and the small details that make a product
          feel right.
        </p>
        <button onclick="document.getElementById('work')?.scrollIntoView({behavior:'smooth'})"
                class="inline-flex items-center gap-2 text-[13px] font-semibold
                       text-[var(--c-fg)] cursor-pointer hover:gap-3 transition-all duration-200"
                [fadeUp]="280">
          <span class="w-6 h-0.5 bg-[var(--c-fg)] inline-block flex-shrink-0"></span>
          See my work
        </button>
      </div>

      <!-- Skills card -->
      <div [fadeUp]="120">
        <div class="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-2xl p-4 md:p-5">
          <p class="text-[12px] font-semibold text-[var(--c-fg)] mb-4">Skills &amp; Expertise</p>

          @for (group of [
            { label: 'Frontend', tags: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS'] },
            { label: 'Backend',  tags: ['Laravel', 'PHP', 'Firebase', 'MySQL'] },
            { label: 'Design',   tags: ['Figma', 'UI/UX', 'Responsive'] },
            { label: 'Tools',    tags: ['Git', 'GitHub Actions', 'Docker', 'Linux'] }
          ]; track group.label; let last = $last) {
            <div [class]="last ? '' : 'mb-3'">
              <p class="font-mono text-[9px] font-semibold tracking-[0.2em] uppercase
                        text-[#a1a1aa] mb-1.5">{{ group.label }}</p>
              <div class="flex flex-wrap gap-1.5">
                @for (tag of group.tags; track tag) {
                  <span class="bg-[var(--c-surface2)] border border-[var(--c-border)]
                               text-[var(--c-fg-muted)] text-[11px] font-medium
                               px-2.5 py-0.5 rounded-md">{{ tag }}</span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════
     WORK
════════════════════════════════════════════════ -->
<section id="work" class="bg-[var(--c-surface)] py-24 border-t border-[var(--c-border)]">
  <div class="max-w-6xl mx-auto px-6 md:px-10">

    <div [fadeUp]="0">
      <p class="font-mono text-[10px] tracking-[0.22em] uppercase text-[#22c55e] mb-3">Portfolio</p>
      <h2 class="font-bold text-[var(--c-fg)] text-2xl md:text-[26px] leading-snug mb-8">
        Selected Work
      </h2>
    </div>

    <!-- Tag filter -->
    @if (allTags().length > 0) {
      <div class="flex flex-wrap gap-2 mb-8" [fadeUp]="80">
        <button (click)="setTag(null)"
                [class]="activeTag() === null
                  ? 'bg-[#22c55e] text-[#09090b] font-semibold'
                  : 'bg-[var(--c-surface2)] border border-[var(--c-border)] text-[var(--c-fg-muted)] hover:text-[var(--c-fg)]'"
                class="text-[11px] px-3 py-1.5 rounded-full font-mono
                       transition-all duration-150 cursor-pointer">
          All
        </button>
        @for (tag of allTags(); track tag) {
          <button (click)="setTag(tag)"
                  [class]="activeTag() === tag
                    ? 'bg-[#22c55e] text-[#09090b] font-semibold'
                    : 'bg-[var(--c-surface2)] border border-[var(--c-border)] text-[var(--c-fg-muted)] hover:text-[var(--c-fg)]'"
                  class="text-[11px] px-3 py-1.5 rounded-full font-mono
                         transition-all duration-150 cursor-pointer">
            {{ tag }}
          </button>
        }
      </div>
    }

    <!-- Card grid -->
    <div class="grid gap-5" [class]="gridClass()" [fadeUp]="120">
      @for (study of filtered(); track study.id) {
        <app-case-study-card [study]="study" />
      } @empty {
        <div class="col-span-full rounded-2xl border border-dashed border-[var(--c-border)]
                    py-20 text-center">
          <p class="text-[var(--c-fg-muted)] font-mono text-sm">No case studies yet.</p>
        </div>
      }
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════
     CONTACT
════════════════════════════════════════════════ -->
<section id="contact" class="relative bg-[#09090b] py-24 overflow-hidden">

  <!-- Glow -->
  <div class="absolute inset-0 pointer-events-none flex items-center justify-center"
       aria-hidden="true">
    <div class="w-[500px] h-72 rounded-full opacity-60"
         style="background:radial-gradient(ellipse,rgba(34,197,94,0.1),transparent 65%);filter:blur(40px)"></div>
  </div>

  <div class="relative z-10 max-w-lg mx-auto px-6 text-center">

    <p class="font-mono text-[10px] tracking-[0.22em] uppercase text-[#22c55e] mb-4"
       [fadeUp]="0">Get in touch</p>

    <h2 class="font-extrabold text-[#fafafa] leading-[1.05] tracking-tight mb-5"
        style="font-size:clamp(2rem,5vw,3rem)"
        [fadeUp]="80">
      Let's build<br/>
      <span class="text-[#22c55e]">something great</span>
    </h2>

    <p class="text-[#71717a] text-[15px] leading-relaxed mb-8"
       [fadeUp]="160">
      Open to freelance, full-time opportunities, or just a good conversation.
      My inbox is always open.
    </p>

    <!-- Email pill -->
    <div class="inline-flex items-center gap-3 bg-[#18181b] border border-[#27272a]
                rounded-2xl px-5 py-3.5 mb-6"
         [fadeUp]="200">
      <span class="font-mono text-[14px] font-semibold text-[#fafafa]">
        hasanaliiba&#64;gmail.com
      </span>
      <button (click)="copyEmailWithFeedback()"
              class="text-[11px] text-[#52525b] bg-[#27272a] hover:bg-[#3f3f46]
                     px-2.5 py-1 rounded-md transition-colors cursor-pointer
                     focus:outline-none focus:ring-1 focus:ring-[#22c55e]">
        {{ copied() ? 'Copied!' : 'copy' }}
      </button>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col gap-3" [fadeUp]="240">
      <a href="mailto:hasanaliiba@gmail.com"
         class="inline-flex items-center justify-center gap-2 bg-[#22c55e] text-[#09090b]
                font-bold text-[13px] px-6 py-3 rounded-xl hover:bg-[#16a34a]
                transition-colors cursor-pointer focus:outline-none focus:ring-2
                focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#09090b]">
        Send email ↗
      </a>
      <div class="flex gap-3">
        <a href="https://linkedin.com/in/hasanaliiba" target="_blank" rel="noopener noreferrer"
           class="flex-1 inline-flex items-center justify-center gap-2 bg-[#18181b]
                  border border-[#27272a] text-[#a1a1aa] font-semibold text-[13px]
                  px-6 py-3 rounded-xl hover:border-[#3f3f46] hover:text-[#fafafa]
                  transition-all cursor-pointer focus:outline-none focus:ring-2
                  focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#09090b]">
          LinkedIn ↗
        </a>
        <a href="https://github.com/hasanaliiba" target="_blank" rel="noopener noreferrer"
           class="flex-1 inline-flex items-center justify-center gap-2 bg-[#18181b]
                  border border-[#27272a] text-[#a1a1aa] font-semibold text-[13px]
                  px-6 py-3 rounded-xl hover:border-[#3f3f46] hover:text-[#fafafa]
                  transition-all cursor-pointer focus:outline-none focus:ring-2
                  focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#09090b]">
          GitHub ↗
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════
     FOOTER
════════════════════════════════════════════════ -->
<footer class="bg-[#09090b] border-t border-[#1f1f23] py-6 text-center">
  <p class="text-[13px] text-[#3f3f46]">
    © 2026 Hasan Ali · Built with Angular &amp; Tailwind
  </p>
</footer>
```

- [ ] **Step 2: Verify compile**

```bash
cd "/Users/hasansali/Career/Front-end portfolio/hasan-portfolio"
npx ng build --configuration development 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/home/home.component.html
git commit -m "feat: full home page redesign — hero, about, work, contact, footer sections"
```

---

## Task 8: Redesign case study card

**Files:**
- Modify: `src/app/shared/components/case-study-card/case-study-card.component.ts`
- Modify: `src/app/shared/components/case-study-card/case-study-card.component.html`

- [ ] **Step 1: Add computed signals for tag overflow**

Replace `src/app/shared/components/case-study-card/case-study-card.component.ts`:

```typescript
// src/app/shared/components/case-study-card/case-study-card.component.ts
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseStudy } from '../../models/case-study.model';

const MAX_VISIBLE_TAGS = 3;

// Deterministic dark gradient per card based on first tag or title
const GRADIENTS = [
  'linear-gradient(135deg,#1e3a5f,#0f2027)',
  'linear-gradient(135deg,#1a0a2e,#2d1b69)',
  'linear-gradient(135deg,#0a1a0f,#052e16)',
  'linear-gradient(135deg,#1a0f0a,#2d1408)',
  'linear-gradient(135deg,#0f172a,#1e293b)',
];

@Component({
  selector: 'app-case-study-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './case-study-card.component.html',
  host: { class: 'flex w-full h-full' },
})
export class CaseStudyCardComponent {
  study = input.required<CaseStudy>();

  visibleTags = computed(() => (this.study().tags ?? []).slice(0, MAX_VISIBLE_TAGS));
  overflowCount = computed(() => Math.max(0, (this.study().tags ?? []).length - MAX_VISIBLE_TAGS));

  headerGradient = computed(() => {
    const hash = this.study().title.charCodeAt(0) % GRADIENTS.length;
    return GRADIENTS[hash];
  });
}
```

- [ ] **Step 2: Rewrite the card template**

Replace `src/app/shared/components/case-study-card/case-study-card.component.html`:

```html
<a [routerLink]="['/work', study().slug]"
   class="group flex flex-col w-full h-full rounded-2xl overflow-hidden cursor-pointer
          border border-[var(--c-border)] bg-[var(--c-surface)]
          transition-all duration-200
          hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10
          focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2
          focus:ring-offset-[var(--c-bg)]">

  <!-- Dark image header — 160px, tags overlaid bottom-left -->
  <div class="relative h-40 flex-shrink-0 overflow-hidden"
       [style.background]="study().bannerUrl ? '' : headerGradient()">

    <!-- Green glow -->
    <div class="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
         style="background:radial-gradient(circle,rgba(34,197,94,0.15),transparent 70%)"></div>

    <!-- Real banner image (when available) -->
    @if (study().bannerUrl) {
      <img [src]="study().bannerUrl"
           [alt]="study().title"
           loading="lazy"
           width="800" height="320"
           class="absolute inset-0 w-full h-full object-cover opacity-80
                  group-hover:opacity-90 group-hover:scale-[1.03]
                  transition-all duration-300" />
      <!-- Dark overlay so tags remain readable -->
      <div class="absolute inset-0 bg-black/45"></div>
    }

    <!-- Tags — bottom-left, max 3 + overflow pill -->
    <div class="absolute bottom-3 left-3 flex items-center gap-1.5 flex-wrap">
      @for (tag of visibleTags(); track tag) {
        <span class="font-mono text-[10px] px-2 py-0.5 rounded-md
                     bg-white/10 border border-white/18 text-white/85
                     backdrop-blur-sm">{{ tag }}</span>
      }
      @if (overflowCount() > 0) {
        <span class="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md
                     bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.35)]
                     text-[#4ade80]">+{{ overflowCount() }}</span>
      }
    </div>
  </div>

  <!-- Card body -->
  <div class="flex flex-col flex-1 p-5">
    <p class="font-mono text-[10px] text-[var(--c-fg-subtle)] mb-1.5">Case Study</p>
    <h3 class="font-bold text-[var(--c-fg)] text-[15px] leading-snug mb-2
               group-hover:text-[#22c55e] transition-colors duration-200">
      {{ study().title }}
    </h3>
    <p class="text-[var(--c-fg-muted)] text-[12px] leading-relaxed flex-1 mb-4 line-clamp-3">
      {{ study().subtitle }}
    </p>
    <!-- CTA pinned to bottom -->
    <div class="mt-auto inline-flex items-center gap-1.5
                text-[12px] font-semibold text-[#22c55e]
                group-hover:gap-2.5 transition-all duration-200">
      View case study
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
           class="w-3.5 h-3.5" aria-hidden="true">
        <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd"/>
      </svg>
    </div>
  </div>
</a>
```

- [ ] **Step 3: Verify compile**

```bash
cd "/Users/hasansali/Career/Front-end portfolio/hasan-portfolio"
npx ng build --configuration development 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/shared/components/case-study-card/case-study-card.component.ts \
        src/app/shared/components/case-study-card/case-study-card.component.html
git commit -m "feat: redesign case study card — dark image header, +N tag overflow, green CTA"
```

---

## Task 9: Smoke test in browser

- [ ] **Step 1: Start the dev server**

```bash
cd "/Users/hasansali/Career/Front-end portfolio/hasan-portfolio"
npx ng serve --open
```

- [ ] **Step 2: Check the following in the browser**

1. Home page loads — dark hero visible, node network animates, mouse causes lines to appear
2. Hero CTAs ("See my work", "Get in touch") scroll to `#work` and `#contact` sections
3. Nav pill visible — "Hasan Ali" left, About/Work/Contact buttons, Resume button (if a resume is set as active)
4. About section shows two-column bio + compact skills card. Skills card groups visible.
5. Work section shows case study cards with dark image headers, tags + `+N` overflow where applicable
6. Contact section shows dark background, green headline, email pill with copy button, three link buttons
7. Footer renders below contact
8. Theme toggle switches between light/dark — all sections adapt via CSS custom properties
9. Scroll animations: sections fade up as they enter the viewport
10. On mobile (resize to < 768px): layouts collapse to single column, nav shows hamburger menu

- [ ] **Step 3: Fix any visual issues found during testing before committing**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: post-smoke-test fixes"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Nav — floating pill, "Hasan Ali" left, About·Work·Contact + Resume button, theme toggle right (Task 4)
- [x] Hero — dark, node canvas, "Available" badge, fade-up stagger entrance (Task 7)
- [x] About+Skills — two-column, compact skills card, no skills in hero (Task 7)
- [x] Case study cards — dark image header, max 3 tags, +N overflow, hover lift (Task 8)
- [x] Work section — tag filter, columnsPerRow grid, scroll anchor (Task 7)
- [x] Contact — dark minimal, email pill + copy, Send/LinkedIn/GitHub buttons (Task 7)
- [x] Footer — minimal one-liner (Task 7)
- [x] FadeUp directive — scroll triggered, stagger via delayMs input (Task 2)
- [x] Reduced motion — CSS media query handles it (Task 1)
- [x] Resume button opens PDF in new tab (Task 4 — TopNav openResume())
- [x] Remove /resume, /work, /contact routes from nav (Tasks 4 + 5)
- [x] Theme toggle — already works via ThemeService, CSS tokens adapt (no changes needed)

**Types consistency:** `CaseStudyCardComponent.visibleTags` and `overflowCount` use `computed()` referencing `study().tags` — consistent with how `CaseStudy.tags: string[]` is defined in the model. `FadeUpDirective` input named `fadeUp` matches template syntax `[fadeUp]="120"`. `NodeCanvasComponent` selector `app-node-canvas` matches import in `HomeComponent`.
