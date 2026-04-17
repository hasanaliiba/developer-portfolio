// src/app/shared/components/case-study-card/case-study-card.component.ts
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseStudy, localize } from '../../models/case-study.model';
import { LanguageService } from '../../../core/services/language.service';

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#1e3a5f 0%,#0f2027 100%)',
  'linear-gradient(135deg,#1a0a2e 0%,#2d1b69 100%)',
  'linear-gradient(135deg,#0a1a0f 0%,#052e16 100%)',
  'linear-gradient(135deg,#1a0f0a 0%,#2d1408 100%)',
  'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
];

@Component({
  selector: 'app-case-study-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './case-study-card.component.html',
  host: { class: 'flex w-full h-full' },
})
export class CaseStudyCardComponent {
  readonly lang = inject(LanguageService);
  study = input.required<CaseStudy>();

  localized = computed(() => localize(this.study(), this.lang.currentLang()));

  hasBanner = computed(() => !!this.study().bannerUrl?.trim());

  fallbackGradient = computed(() => {
    const code = this.study().title.charCodeAt(0);
    const hash = Number.isNaN(code) ? 0 : code % FALLBACK_GRADIENTS.length;
    return FALLBACK_GRADIENTS[hash];
  });

  /** Up to 4 bullet points drawn from the richest available array. */
  featureBullets = computed(() => {
    const s = this.localized();
    const source =
      s.challengePoints?.length  ? s.challengePoints  :
      s.solutionItems?.length    ? s.solutionItems    :
      s.benefits?.length         ? s.benefits         : [];
    return source.slice(0, 4);
  });

  /** All tags — shown as chips at the bottom of the card. */
  tags = computed(() => this.study().tags ?? []);
}
