import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavComponent } from './shared/components/sidebar-nav/sidebar-nav.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarNavComponent],
  template: `
    <div class="flex min-h-dvh bg-[var(--c-bg)]">
      <app-sidebar-nav />
      <main class="flex-1 ml-14 min-h-dvh">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  // Injecting ThemeService here ensures it is instantiated (and its effect runs)
  // as soon as the app boots, before any child component renders.
  readonly theme = inject(ThemeService);
}
