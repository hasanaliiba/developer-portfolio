import { Component, inject, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shared/components/top-nav/top-nav.component';
import { ThemeService } from './core/services/theme.service';

const LOADER_MIN_MS = 2500; // minimum loader display time

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
  // Injected here to initialise theme before first paint.
  readonly theme = inject(ThemeService);

  constructor() {
    afterNextRender(() => {
      const el = document.getElementById('app-loader');
      if (!el) return;

      const start: number = ((window as unknown) as Record<string, number>)['__loaderStart'] ?? Date.now();
      const elapsed = Date.now() - start;
      const delay = Math.max(0, LOADER_MIN_MS - elapsed);

      setTimeout(() => {
        el.classList.add('loader-done');
        // Remove from DOM after transition completes (0.55s)
        setTimeout(() => el.remove(), 600);
      }, delay);
    });
  }
}
