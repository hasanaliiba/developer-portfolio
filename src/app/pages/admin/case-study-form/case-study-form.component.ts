import { Component, inject, input, output, effect, signal } from '@angular/core';
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

  private fb  = inject(FormBuilder);
  private svc = inject(CaseStudyService);

  form = this.fb.group({
    title:     ['', Validators.required],
    subtitle:  [''],
    slug:      ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    bannerUrl: ['', Validators.required],
    liveUrl:   [''],
    tags:      ['', Validators.required],
    metrics:   this.fb.array([]),

    problem:         ['', Validators.required],
    challengePoints: this.fb.array([]),

    solution:      ['', Validators.required],
    solutionItems: this.fb.array([]),

    result:   ['', Validators.required],
    benefits: this.fb.array([]),

    technologies: [''],
    client:       [''],
    timeline:     [''],
    role:         [''],
    industry:     [''],

    order:   [0, [Validators.required, Validators.min(0)]],
    visible: [true],
  });

  // ── Banner upload state ───────────────────────────
  bannerTab     = signal<'upload' | 'link'>('link');
  bannerPreview = signal<string>('');
  bannerError   = signal<string>('');
  bannerLoading = signal(false);

  setBannerTab(tab: 'upload' | 'link'): void {
    this.bannerTab.set(tab);
    this.bannerError.set('');
    // Keep existing bannerUrl value when switching tabs
  }

  async onBannerFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.bannerError.set('');
    this.bannerLoading.set(true);

    try {
      const compressed = await this.compressImage(file, 1200, 0.75);
      // Rough size check — base64 is ~33% larger
      const approxBytes = compressed.length * 0.75;
      if (approxBytes > 700_000) {
        this.bannerError.set('Image is too large even after compression. Please use a smaller image or paste a URL instead.');
        this.bannerLoading.set(false);
        return;
      }
      this.bannerPreview.set(compressed);
      this.form.patchValue({ bannerUrl: compressed });
    } catch {
      this.bannerError.set('Could not process this image. Try a different file.');
    } finally {
      this.bannerLoading.set(false);
    }
  }

  /** Compress image via canvas. Returns a base64 JPEG data URL. */
  private compressImage(file: File, maxWidth: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale  = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

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
      this.bannerPreview.set('');
      this.bannerError.set('');


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

      // If editing and banner is a data URL, show it in upload preview
      if (s.bannerUrl?.startsWith('data:')) {
        this.bannerTab.set('upload');
        this.bannerPreview.set(s.bannerUrl);
      } else {
        this.bannerTab.set('link');
      }

      (s.metrics         ?? []).forEach(m  => this.metricsArr.push(this.fb.group({ value: [m.value], label: [m.label] })));
      (s.challengePoints ?? []).forEach(p  => this.challengePointsArr.push(this.fb.control(p)));
      (s.solutionItems   ?? []).forEach(si => this.solutionItemsArr.push(this.fb.group({ title: [si.title], description: [si.description] })));
      (s.benefits        ?? []).forEach(b  => this.benefitsArr.push(this.fb.group({ title: [b.title], description: [b.description] })));
    }, { allowSignalWrites: true });
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
