import { Component, inject, input, output, effect } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaseStudyService } from '../../../core/services/case-study.service';
import { CaseStudy } from '../../../shared/models/case-study.model';

@Component({
  selector: 'app-case-study-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './case-study-form.component.html',
})
export class CaseStudyFormComponent {
  study = input<CaseStudy | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private fb = inject(FormBuilder);
  private svc = inject(CaseStudyService);

  form = this.fb.group({
    // Hero
    title:     ['', Validators.required],
    subtitle:  [''],
    slug:      ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    bannerUrl: ['', Validators.required],
    liveUrl:   [''],
    tags:      ['', Validators.required],
    metrics:   this.fb.array([]),

    // Challenge
    problem:         ['', Validators.required],
    challengePoints: this.fb.array([]),

    // Solution
    solution:      ['', Validators.required],
    solutionItems: this.fb.array([]),

    // Results
    result:   ['', Validators.required],
    benefits: this.fb.array([]),

    // Sidebar
    technologies: [''],
    client:       [''],
    timeline:     [''],
    role:         [''],
    industry:     [''],

    // Meta
    order:   [0, [Validators.required, Validators.min(0)]],
    visible: [true],
  });

  // ── Getters ────────────────────────────────────────
  get metricsArr()         { return this.form.get('metrics')         as FormArray; }
  get challengePointsArr() { return this.form.get('challengePoints') as FormArray; }
  get solutionItemsArr()   { return this.form.get('solutionItems')   as FormArray; }
  get benefitsArr()        { return this.form.get('benefits')        as FormArray; }

  asGroup(ctrl: AbstractControl): FormGroup { return ctrl as FormGroup; }

  // ── Add / remove helpers ──────────────────────────
  addMetric()               { this.metricsArr.push(this.fb.group({ value: [''], label: [''] })); }
  removeMetric(i: number)   { this.metricsArr.removeAt(i); }

  addPoint()                { this.challengePointsArr.push(this.fb.control('')); }
  removePoint(i: number)    { this.challengePointsArr.removeAt(i); }

  addSolution()             { this.solutionItemsArr.push(this.fb.group({ title: [''], description: [''] })); }
  removeSolution(i: number) { this.solutionItemsArr.removeAt(i); }

  addBenefit()              { this.benefitsArr.push(this.fb.group({ title: [''], description: [''] })); }
  removeBenefit(i: number)  { this.benefitsArr.removeAt(i); }

  // ── Patch form when editing ───────────────────────
  constructor() {
    effect(() => {
      const s = this.study();
      this.metricsArr.clear();
      this.challengePointsArr.clear();
      this.solutionItemsArr.clear();
      this.benefitsArr.clear();

      if (!s) return;

      this.form.patchValue({
        title:        s.title,
        subtitle:     s.subtitle      ?? '',
        slug:         s.slug,
        bannerUrl:    s.bannerUrl,
        liveUrl:      s.liveUrl       ?? '',
        tags:         s.tags?.join(', ') ?? '',
        problem:      s.problem,
        solution:     s.solution,
        result:       s.result,
        technologies: s.technologies?.join(', ') ?? '',
        client:       s.client        ?? '',
        timeline:     s.timeline      ?? '',
        role:         s.role          ?? '',
        industry:     s.industry      ?? '',
        order:        s.order,
        visible:      s.visible,
      });

      (s.metrics         ?? []).forEach(m  => this.metricsArr.push(this.fb.group({ value: [m.value], label: [m.label] })));
      (s.challengePoints ?? []).forEach(p  => this.challengePointsArr.push(this.fb.control(p)));
      (s.solutionItems   ?? []).forEach(si => this.solutionItemsArr.push(this.fb.group({ title: [si.title], description: [si.description] })));
      (s.benefits        ?? []).forEach(b  => this.benefitsArr.push(this.fb.group({ title: [b.title], description: [b.description] })));
    });
  }

  // ── Save ─────────────────────────────────────────
  async save(): Promise<void> {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();

    const csv = (s: string | null) => (s ?? '').split(',').map(t => t.trim()).filter(Boolean);

    const data = {
      title:           v.title!,
      subtitle:        v.subtitle    ?? '',
      slug:            v.slug!,
      bannerUrl:       v.bannerUrl!,
      liveUrl:         v.liveUrl     ?? '',
      tags:            csv(v.tags),
      metrics:         (v.metrics         as any[]) ?? [],
      problem:         v.problem!,
      challengePoints: (v.challengePoints as string[]) ?? [],
      solution:        v.solution!,
      solutionItems:   (v.solutionItems   as any[]) ?? [],
      result:          v.result!,
      benefits:        (v.benefits        as any[]) ?? [],
      technologies:    csv(v.technologies),
      client:          v.client     ?? '',
      timeline:        v.timeline   ?? '',
      role:            v.role       ?? '',
      industry:        v.industry   ?? '',
      order:           v.order      ?? 0,
      visible:         v.visible    ?? true,
    };

    const s = this.study();
    if (s) await this.svc.update(s.id, data);
    else   await this.svc.add(data);
    this.saved.emit();
  }

  cancel(): void { this.cancelled.emit(); }
}
