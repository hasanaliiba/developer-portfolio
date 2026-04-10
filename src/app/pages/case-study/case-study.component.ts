import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseStudyService } from '../../core/services/case-study.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-case-study',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './case-study.component.html',
})
export class CaseStudyComponent {
  private route = inject(ActivatedRoute);
  private caseStudyService = inject(CaseStudyService);
  study = toSignal(this.route.params.pipe(switchMap(p => this.caseStudyService.getBySlug(p['slug']))));
}
