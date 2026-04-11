import { Component, inject, input, output, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaseStudyService } from '../../../core/services/case-study.service';
import { CaseStudy } from '../../../shared/models/case-study.model';

@Component({
  selector: 'app-case-study-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './case-study-form.component.html',
})
export class CaseStudyFormComponent implements OnInit {
  study = input<CaseStudy | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private fb = inject(FormBuilder);
  private caseStudyService = inject(CaseStudyService);

  form = this.fb.group({
    title: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    bannerUrl: ['', Validators.required],
    tags: ['', Validators.required],
    problem: ['', Validators.required],
    solution: ['', Validators.required],
    result: ['', Validators.required],
    visible: [true],
    order: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    const s = this.study();
    if (s) this.form.patchValue({ ...s, tags: s.tags.join(', ') });
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const data = {
      title: raw.title!, slug: raw.slug!, bannerUrl: raw.bannerUrl!,
      tags: raw.tags!.split(',').map((t: string) => t.trim()).filter(Boolean),
      problem: raw.problem!, solution: raw.solution!, result: raw.result!,
      visible: raw.visible ?? true, order: raw.order ?? 0,
    };
    const s = this.study();
    if (s) await this.caseStudyService.update(s.id, data);
    else await this.caseStudyService.add(data);
    this.saved.emit();
  }

  cancel(): void { this.cancelled.emit(); }
}
