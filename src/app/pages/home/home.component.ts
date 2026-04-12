// src/app/pages/home/home.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CaseStudyService } from '../../core/services/case-study.service';
import { SettingsService } from '../../core/services/settings.service';
import { CaseStudyCardComponent } from '../../shared/components/case-study-card/case-study-card.component';
import { NodeCanvasComponent } from '../../shared/components/node-canvas/node-canvas.component';
import { TypewriterComponent } from '../../shared/components/typewriter/typewriter.component';
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
  imports: [RouterLink, CaseStudyCardComponent, NodeCanvasComponent, TypewriterComponent, FadeUpDirective],
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

  readonly copied = signal(false);

  copyEmailWithFeedback(): void {
    navigator.clipboard.writeText('hasanaliiba@gmail.com').then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }).catch(() => {});
  }
}
