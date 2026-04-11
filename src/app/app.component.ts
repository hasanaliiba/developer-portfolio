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
      <main class="pt-16">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  readonly theme = inject(ThemeService);
}
