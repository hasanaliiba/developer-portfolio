import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CaseStudyService } from '../../core/services/case-study.service';
import { CaseStudyCardComponent } from '../../shared/components/case-study-card/case-study-card.component';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [AsyncPipe, CaseStudyCardComponent],
  templateUrl: './work.component.html',
})
export class WorkComponent {
  private caseStudyService = inject(CaseStudyService);
  studies$ = this.caseStudyService.getVisible();
}
