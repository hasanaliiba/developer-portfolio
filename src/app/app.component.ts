import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavComponent } from './shared/components/sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarNavComponent],
  template: `
    <div class="flex min-h-dvh bg-[#0F172A]">
      <app-sidebar-nav />
      <main class="flex-1 ml-14 min-h-dvh">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
