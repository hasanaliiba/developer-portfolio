import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaseStudyService } from '../../core/services/case-study.service';
import { SettingsService } from '../../core/services/settings.service';
import { CaseStudyCardComponent } from '../../shared/components/case-study-card/case-study-card.component';

const GRID: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CaseStudyCardComponent],
  templateUrl: './work.component.html',
})
export class WorkComponent {
  private caseStudyService = inject(CaseStudyService);
  private settingsService  = inject(SettingsService);

  allStudies  = toSignal(this.caseStudyService.getVisible(), { initialValue: [] });
  settings    = toSignal(this.settingsService.get(), { initialValue: { columnsPerRow: 2 as const } });
  activeTag   = signal<string | null>(null);

  // All unique tags across every study, sorted
  allTags = computed(() =>
    [...new Set(this.allStudies().flatMap(s => s.tags ?? []))].sort()
  );

  // Filtered list
  filtered = computed(() => {
    const tag = this.activeTag();
    return tag
      ? this.allStudies().filter(s => s.tags?.includes(tag))
      : this.allStudies();
  });

  // CSS grid class driven by the admin setting
  gridClass = computed(() => GRID[this.settings().columnsPerRow] ?? GRID[2]);

  setTag(tag: string | null): void { this.activeTag.set(tag); }
}
