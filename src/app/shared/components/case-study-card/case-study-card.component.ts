import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseStudy } from '../../models/case-study.model';

@Component({
  selector: 'app-case-study-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './case-study-card.component.html',
  host: { class: 'flex w-full h-full' },
})
export class CaseStudyCardComponent {
  study = input.required<CaseStudy>();
}
