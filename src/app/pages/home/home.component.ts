// src/app/pages/home/home.component.ts
import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaseStudyService } from '../../core/services/case-study.service';
import { SettingsService } from '../../core/services/settings.service';
import { LanguageService } from '../../core/services/language.service';
import { SkillsService } from '../../core/services/skills.service';
import { ExperienceService } from '../../core/services/experience.service';
import { getSkillIcon } from '../../core/data/skill-icons';
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
export class HomeComponent implements OnInit, OnDestroy {
  private caseStudyService   = inject(CaseStudyService);
  private settingsService    = inject(SettingsService);
  private skillsService      = inject(SkillsService);
  private experienceService  = inject(ExperienceService);
  readonly lang              = inject(LanguageService);

  allStudies  = toSignal(this.caseStudyService.getVisible(), { initialValue: [] });
  settings    = toSignal(this.settingsService.get(), { initialValue: this.settingsService.getCached() });
  skillGroups = toSignal(this.skillsService.get(), { initialValue: this.skillsService.getCached() });
  experiences = toSignal(this.experienceService.get(), { initialValue: this.experienceService.getCached() });
  activeTag   = signal<string | null>(null);

  allTags = computed(() =>
    [...new Set(this.allStudies().flatMap(s => s.tags ?? []))].sort()
  );

  filtered = computed(() => {
    const tag = this.activeTag();
    return tag ? this.allStudies().filter(s => s.tags?.includes(tag)) : this.allStudies();
  });

  gridClass = computed(() => GRID[this.settings().columnsPerRow] ?? GRID[2]);

  setTag(tag: string | null): void { this.activeTag.set(tag); }

  skillIcon(name: string): { url: string; darkInvert: boolean } | null {
    return getSkillIcon(name);
  }

  /** Derived from GitHub API: repos by language — JS×3, TS×2, HTML×1 out of 6 repos with a language */
  readonly githubLangs = [
    { name: 'JavaScript', color: '#f1e05a', pct: 50 },
    { name: 'TypeScript', color: '#3178c6', pct: 33 },
    { name: 'HTML',       color: '#e34c26', pct: 17 },
  ];

  readonly copied = signal(false);
  readonly showBackToTop = signal(false);

  private onScroll = (): void => {
    this.showBackToTop.set(window.scrollY > 400);
  };

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  copyEmailWithFeedback(): void {
    navigator.clipboard.writeText('hasanaliiba@gmail.com').then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }).catch(() => {});
  }
}
