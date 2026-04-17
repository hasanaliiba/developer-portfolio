import { Component, inject, signal, computed } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaseStudyService } from '../../core/services/case-study.service';
import { ResumeService } from '../../core/services/resume.service';
import { SettingsService } from '../../core/services/settings.service';
import { SkillsService } from '../../core/services/skills.service';
import { ExperienceService } from '../../core/services/experience.service';
import { AuthService } from '../../core/services/auth.service';
import { CaseStudy } from '../../shared/models/case-study.model';
import { SkillGroup } from '../../shared/models/skill.model';
import { ExperienceItem } from '../../shared/models/experience.model';
import { CaseStudyFormComponent } from './case-study-form/case-study-form.component';
import { KNOWN_SKILLS, getSkillIcon } from '../../core/data/skill-icons';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AsyncPipe, CaseStudyFormComponent],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  private caseStudyService   = inject(CaseStudyService);
  private resumeService      = inject(ResumeService);
  private settingsService    = inject(SettingsService);
  private skillsService      = inject(SkillsService);
  private experienceService  = inject(ExperienceService);
  private authService        = inject(AuthService);
  private router             = inject(Router);

  // ── Display Settings ─────────────────────────────────────────
  settings    = toSignal(this.settingsService.get(), { initialValue: { columnsPerRow: 2 as const, i18nEnabled: true } });
  columnOptions: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
  setColumns(n: 1 | 2 | 3 | 4): void { this.settingsService.setColumns(n); }
  setI18nEnabled(enabled: boolean): void { this.settingsService.setI18nEnabled(enabled); }

  // ── Case Studies ─────────────────────────────────────────────
  studies$     = this.caseStudyService.getAll();
  editingStudy = signal<CaseStudy | null>(null);
  showAddForm  = signal(false);

  toggleVisibility(study: CaseStudy): void { this.caseStudyService.toggleVisibility(study.id, !study.visible); }
  deleteStudy(study: CaseStudy): void { if (confirm(`Delete "${study.title}"?`)) this.caseStudyService.delete(study.id); }
  editStudy(study: CaseStudy): void { this.showAddForm.set(false); this.editingStudy.set(study); }
  onFormSaved(): void { this.editingStudy.set(null); this.showAddForm.set(false); }

  // ── Resumes ──────────────────────────────────────────────────
  resumes$       = this.resumeService.getAll();
  showResumeForm = signal(false);
  resumeTab      = signal<'upload' | 'link'>('upload');
  resumeName     = signal('');
  resumeUrl      = signal('');
  selectedFile   = signal<File | null>(null);
  fileSizeMB     = signal<string>('');
  sizeError      = signal('');
  saving         = signal(false);

  setTab(tab: 'upload' | 'link'): void {
    this.resumeTab.set(tab);
    this.selectedFile.set(null);
    this.fileSizeMB.set('');
    this.sizeError.set('');
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.sizeError.set('');
    if (!file) { this.selectedFile.set(null); return; }
    const mb = file.size / 1024 / 1024;
    if (mb > 0.75) {
      this.sizeError.set(`File is ${mb.toFixed(2)} MB. Please keep it under 750 KB so it fits in Firestore.`);
      this.selectedFile.set(null);
      return;
    }
    this.selectedFile.set(file);
    this.fileSizeMB.set(mb.toFixed(2));
    if (!this.resumeName().trim()) {
      this.resumeName.set(file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '));
    }
  }

  async addResume(): Promise<void> {
    const name = this.resumeName().trim();
    if (!name) return;
    this.saving.set(true);
    try {
      let fileUrl: string;
      if (this.resumeTab() === 'upload') {
        const file = this.selectedFile();
        if (!file) return;
        fileUrl = await this.readAsDataUrl(file);
      } else {
        fileUrl = this.resumeUrl().trim();
        if (!fileUrl) return;
      }
      await this.resumeService.add({ name, fileUrl, visible: false });
      this.resetForm();
    } finally {
      this.saving.set(false);
    }
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private resetForm(): void {
    this.resumeName.set('');
    this.resumeUrl.set('');
    this.selectedFile.set(null);
    this.fileSizeMB.set('');
    this.sizeError.set('');
    this.showResumeForm.set(false);
  }

  setActiveResume(id: string): void { this.resumeService.setActive(id); }
  hideResume(id: string): void      { this.resumeService.hide(id); }
  deleteResume(id: string): void    { if (confirm('Delete this resume?')) this.resumeService.delete(id); }

  // ── Skills Management ─────────────────────────────────────────
  /** Live copy of groups being edited (deep clone from Firestore). */
  private _savedGroups = toSignal(this.skillsService.get(), { initialValue: this.skillsService.getCached() });

  /** Working copy — mutated locally, only persisted on Save. */
  skillGroups = signal<SkillGroup[]>([]);
  skillsDirty = signal(false);
  skillsSaving = signal(false);

  /** Expanded group index (accordion). */
  expandedGroup = signal<number | null>(0);

  /** Per-group skill input state. */
  skillInputs = signal<string[]>([]);

  /** Autocomplete suggestions for skill input. */
  suggestions = signal<string[]>([]);
  activeInputIdx = signal<number | null>(null);

  readonly knownSkills = KNOWN_SKILLS;


  private resetSkillsFromServer(): void {
    const groups = this._savedGroups();
    this.skillGroups.set(groups.map(g => ({ label: g.label, skills: [...g.skills] })));
    this.skillInputs.set(groups.map(() => ''));
    this.expandedGroup.set(groups.length > 0 ? 0 : null);
    this.skillsDirty.set(false);
  }

  toggleGroup(idx: number): void {
    this.expandedGroup.set(this.expandedGroup() === idx ? null : idx);
  }

  addGroup(): void {
    const groups = [...this.skillGroups()];
    groups.push({ label: 'New Category', skills: [] });
    const inputs = [...this.skillInputs(), ''];
    this.skillGroups.set(groups);
    this.skillInputs.set(inputs);
    this.expandedGroup.set(groups.length - 1);
    this.skillsDirty.set(true);
  }

  removeGroup(idx: number): void {
    if (!confirm('Remove this category and all its skills?')) return;
    const groups = this.skillGroups().filter((_, i) => i !== idx);
    const inputs = this.skillInputs().filter((_, i) => i !== idx);
    this.skillGroups.set(groups);
    this.skillInputs.set(inputs);
    if (this.expandedGroup() === idx) this.expandedGroup.set(null);
    this.skillsDirty.set(true);
  }

  updateGroupLabel(idx: number, label: string): void {
    const groups = this.skillGroups().map((g, i) => i === idx ? { ...g, label } : g);
    this.skillGroups.set(groups);
    this.skillsDirty.set(true);
  }

  moveGroup(idx: number, dir: -1 | 1): void {
    const groups = [...this.skillGroups()];
    const inputs = [...this.skillInputs()];
    const target = idx + dir;
    if (target < 0 || target >= groups.length) return;
    [groups[idx], groups[target]] = [groups[target], groups[idx]];
    [inputs[idx], inputs[target]] = [inputs[target], inputs[idx]];
    this.skillGroups.set(groups);
    this.skillInputs.set(inputs);
    this.expandedGroup.set(target);
    this.skillsDirty.set(true);
  }

  removeSkill(groupIdx: number, skillIdx: number): void {
    const groups = this.skillGroups().map((g, i) => {
      if (i !== groupIdx) return g;
      return { ...g, skills: g.skills.filter((_, si) => si !== skillIdx) };
    });
    this.skillGroups.set(groups);
    this.skillsDirty.set(true);
  }

  onSkillInput(groupIdx: number, value: string): void {
    const inputs = [...this.skillInputs()];
    inputs[groupIdx] = value;
    this.skillInputs.set(inputs);
    this.activeInputIdx.set(groupIdx);

    const q = value.trim().toLowerCase();
    if (!q) { this.suggestions.set([]); return; }

    const existing = this.skillGroups()[groupIdx]?.skills ?? [];
    const matches = this.knownSkills.filter(k =>
      k.toLowerCase().includes(q) && !existing.includes(k)
    ).slice(0, 8);
    this.suggestions.set(matches);
  }

  addSkillFromInput(groupIdx: number): void {
    const value = this.skillInputs()[groupIdx]?.trim();
    if (!value) return;
    this.commitSkill(groupIdx, value);
  }

  selectSuggestion(groupIdx: number, skill: string): void {
    this.commitSkill(groupIdx, skill);
  }

  private commitSkill(groupIdx: number, skill: string): void {
    const groups = this.skillGroups();
    if (groups[groupIdx]?.skills.includes(skill)) return;

    const updated = groups.map((g, i) => {
      if (i !== groupIdx) return g;
      return { ...g, skills: [...g.skills, skill] };
    });
    this.skillGroups.set(updated);

    const inputs = [...this.skillInputs()];
    inputs[groupIdx] = '';
    this.skillInputs.set(inputs);
    this.suggestions.set([]);
    this.activeInputIdx.set(null);
    this.skillsDirty.set(true);
  }

  closeSuggestions(): void {
    setTimeout(() => { this.suggestions.set([]); this.activeInputIdx.set(null); }, 150);
  }

  async saveSkills(): Promise<void> {
    this.skillsSaving.set(true);
    try {
      await this.skillsService.save(this.skillGroups());
      this.skillsDirty.set(false);
    } finally {
      this.skillsSaving.set(false);
    }
  }

  discardSkills(): void {
    this.resetSkillsFromServer();
  }

  getSkillIcon(name: string): { url: string; darkInvert: boolean } | null {
    return getSkillIcon(name);
  }

  // ── Experience Management ─────────────────────────────────────
  private _savedExp = toSignal(this.experienceService.get(), { initialValue: this.experienceService.getCached() });

  expItems    = signal<ExperienceItem[]>([]);
  expDirty    = signal(false);
  expSaving   = signal(false);
  expExpanded = signal<number | null>(0);

  /** Per-entry tag input */
  expTagInputs = signal<string[]>([]);

  /** Per-entry new bullet text */
  expBulletInputs = signal<string[]>([]);

  readonly employmentTypes = ['Full-time', 'Freelance', 'Contract', 'Part-time', 'Internship'];

  constructor() {
    this.resetSkillsFromServer();
    this.resetExpFromServer();
  }

  private resetExpFromServer(): void {
    const items = this._savedExp();
    this.expItems.set(items.map(e => ({
      ...e,
      bullets: [...e.bullets],
      tags:    [...e.tags],
    })));
    this.expTagInputs.set(items.map(() => ''));
    this.expBulletInputs.set(items.map(() => ''));
    this.expExpanded.set(items.length > 0 ? 0 : null);
    this.expDirty.set(false);
  }

  toggleExpEntry(idx: number): void {
    this.expExpanded.set(this.expExpanded() === idx ? null : idx);
  }

  addExpEntry(): void {
    const newEntry: ExperienceItem = {
      role: 'New Role', company: '', type: 'Full-time',
      period: '', current: false, bullets: [], tags: [],
    };
    this.expItems.set([...this.expItems(), newEntry]);
    this.expTagInputs.set([...this.expTagInputs(), '']);
    this.expBulletInputs.set([...this.expBulletInputs(), '']);
    this.expExpanded.set(this.expItems().length - 1);
    this.expDirty.set(true);
  }

  removeExpEntry(idx: number): void {
    if (!confirm('Remove this experience entry?')) return;
    this.expItems.set(this.expItems().filter((_, i) => i !== idx));
    this.expTagInputs.set(this.expTagInputs().filter((_, i) => i !== idx));
    this.expBulletInputs.set(this.expBulletInputs().filter((_, i) => i !== idx));
    if (this.expExpanded() === idx) this.expExpanded.set(null);
    this.expDirty.set(true);
  }

  moveExpEntry(idx: number, dir: -1 | 1): void {
    const items   = [...this.expItems()];
    const tinputs = [...this.expTagInputs()];
    const binputs = [...this.expBulletInputs()];
    const target  = idx + dir;
    if (target < 0 || target >= items.length) return;
    [items[idx], items[target]]   = [items[target], items[idx]];
    [tinputs[idx], tinputs[target]] = [tinputs[target], tinputs[idx]];
    [binputs[idx], binputs[target]] = [binputs[target], binputs[idx]];
    this.expItems.set(items);
    this.expTagInputs.set(tinputs);
    this.expBulletInputs.set(binputs);
    this.expExpanded.set(target);
    this.expDirty.set(true);
  }

  updateExpField<K extends keyof ExperienceItem>(idx: number, field: K, value: ExperienceItem[K]): void {
    this.expItems.set(this.expItems().map((e, i) => i === idx ? { ...e, [field]: value } : e));
    this.expDirty.set(true);
  }

  // Bullets
  addExpBullet(idx: number): void {
    const text = this.expBulletInputs()[idx]?.trim();
    if (!text) return;
    const items = this.expItems().map((e, i) =>
      i === idx ? { ...e, bullets: [...e.bullets, text] } : e
    );
    this.expItems.set(items);
    const bi = [...this.expBulletInputs()]; bi[idx] = '';
    this.expBulletInputs.set(bi);
    this.expDirty.set(true);
  }

  updateExpBullet(entryIdx: number, bulletIdx: number, value: string): void {
    const items = this.expItems().map((e, i) => {
      if (i !== entryIdx) return e;
      const bullets = e.bullets.map((b, bi) => bi === bulletIdx ? value : b);
      return { ...e, bullets };
    });
    this.expItems.set(items);
    this.expDirty.set(true);
  }

  removeExpBullet(entryIdx: number, bulletIdx: number): void {
    const items = this.expItems().map((e, i) =>
      i === entryIdx ? { ...e, bullets: e.bullets.filter((_, bi) => bi !== bulletIdx) } : e
    );
    this.expItems.set(items);
    this.expDirty.set(true);
  }

  onExpBulletInput(idx: number, value: string): void {
    const bi = [...this.expBulletInputs()]; bi[idx] = value;
    this.expBulletInputs.set(bi);
  }

  // Tags
  addExpTag(idx: number): void {
    const tag = this.expTagInputs()[idx]?.trim();
    if (!tag) return;
    if (this.expItems()[idx]?.tags.includes(tag)) return;
    const items = this.expItems().map((e, i) =>
      i === idx ? { ...e, tags: [...e.tags, tag] } : e
    );
    this.expItems.set(items);
    const ti = [...this.expTagInputs()]; ti[idx] = '';
    this.expTagInputs.set(ti);
    this.expDirty.set(true);
  }

  removeExpTag(entryIdx: number, tagIdx: number): void {
    const items = this.expItems().map((e, i) =>
      i === entryIdx ? { ...e, tags: e.tags.filter((_, ti) => ti !== tagIdx) } : e
    );
    this.expItems.set(items);
    this.expDirty.set(true);
  }

  onExpTagInput(idx: number, value: string): void {
    const ti = [...this.expTagInputs()]; ti[idx] = value;
    this.expTagInputs.set(ti);
  }

  async saveExperience(): Promise<void> {
    this.expSaving.set(true);
    try {
      await this.experienceService.save(this.expItems());
      this.expDirty.set(false);
    } finally {
      this.expSaving.set(false);
    }
  }

  discardExperience(): void { this.resetExpFromServer(); }

  // ── Auth ─────────────────────────────────────────────────────
  signOut(): void { this.authService.signOut().then(() => this.router.navigate(['/admin/login'])); }
}
