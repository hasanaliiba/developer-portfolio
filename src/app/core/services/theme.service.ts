import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(this.initTheme());

  constructor() {
    effect(() => {
      const html = document.documentElement;
      if (this.isDark()) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      localStorage.setItem('portfolio-theme', this.isDark() ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }

  private initTheme(): boolean {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) return stored === 'dark';
    // Default to dark; respect system preference as fallback
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
