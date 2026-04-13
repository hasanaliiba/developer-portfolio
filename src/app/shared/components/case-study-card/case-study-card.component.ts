// src/app/shared/components/case-study-card/case-study-card.component.ts
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseStudy } from '../../models/case-study.model';

const MAX_VISIBLE_TAGS = 3;

const GRADIENTS = [
  'linear-gradient(135deg,#1e3a5f,#0f2027)',
  'linear-gradient(135deg,#1a0a2e,#2d1b69)',
  'linear-gradient(135deg,#0a1a0f,#052e16)',
  'linear-gradient(135deg,#1a0f0a,#2d1408)',
  'linear-gradient(135deg,#0f172a,#1e293b)',
];

@Component({
  selector: 'app-case-study-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './case-study-card.component.html',
  host: { class: 'flex w-full h-full' },
})
export class CaseStudyCardComponent {
  study = input.required<CaseStudy>();

  visibleTags = computed(() => (this.study().tags ?? []).slice(0, MAX_VISIBLE_TAGS));
  overflowCount = computed(() => Math.max(0, (this.study().tags ?? []).length - MAX_VISIBLE_TAGS));

  headerGradient = computed(() => {
    const hash = this.study().title.charCodeAt(0) % GRADIENTS.length;
    return GRADIENTS[hash];
  });
}
