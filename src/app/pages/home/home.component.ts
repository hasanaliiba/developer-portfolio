import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TypewriterComponent } from '../../shared/components/typewriter/typewriter.component';
import { CaseStudyCardComponent } from '../../shared/components/case-study-card/case-study-card.component';
import { CaseStudyService } from '../../core/services/case-study.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe, TypewriterComponent, CaseStudyCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly studies$ = inject(CaseStudyService).getVisible();
}
