import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseStudyService } from '../../core/services/case-study.service';
import { LanguageService } from '../../core/services/language.service';
import { localize } from '../../shared/models/case-study.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CaseStudyCardComponent } from '../../shared/components/case-study-card/case-study-card.component';

@Component({
  selector: 'app-case-study',
  standalone: true,
  imports: [RouterLink, CaseStudyCardComponent],
  templateUrl: './case-study.component.html',
})
export class CaseStudyComponent {
  private route = inject(ActivatedRoute);
  private svc = inject(CaseStudyService);
  readonly lang = inject(LanguageService);

  study = toSignal(
    this.route.params.pipe(switchMap(p => this.svc.getBySlug(p['slug'])))
  );

  localized = computed(() => {
    const s = this.study();
    return s ? localize(s, this.lang.currentLang()) : undefined;
  });

  allVisible = toSignal(this.svc.getVisible(), { initialValue: [] });

  related = computed(() => {
    const s = this.study();
    if (!s) return [];
    return this.allVisible().filter(x => x.slug !== s.slug).slice(0, 3);
  });
}
