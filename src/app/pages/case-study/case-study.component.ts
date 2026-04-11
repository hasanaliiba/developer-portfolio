import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseStudyService } from '../../core/services/case-study.service';
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

  study = toSignal(
    this.route.params.pipe(switchMap(p => this.svc.getBySlug(p['slug'])))
  );

  allVisible = toSignal(this.svc.getVisible(), { initialValue: [] });

  related = computed(() => {
    const s = this.study();
    if (!s) return [];
    return this.allVisible().filter(x => x.slug !== s.slug).slice(0, 3);
  });
}
