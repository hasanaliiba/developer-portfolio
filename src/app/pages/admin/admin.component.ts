import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CaseStudyService } from '../../core/services/case-study.service';
import { AuthService } from '../../core/services/auth.service';
import { CaseStudy } from '../../shared/models/case-study.model';
import { CaseStudyFormComponent } from './case-study-form/case-study-form.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AsyncPipe, CaseStudyFormComponent],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  private caseStudyService = inject(CaseStudyService);
  private authService = inject(AuthService);
  private router = inject(Router);

  studies$ = this.caseStudyService.getAll();
  editingStudy = signal<CaseStudy | null>(null);
  showAddForm = signal(false);

  toggleVisibility(study: CaseStudy): void { this.caseStudyService.toggleVisibility(study.id, !study.visible); }
  delete(study: CaseStudy): void { if (confirm(`Delete "${study.title}"?`)) this.caseStudyService.delete(study.id); }
  editStudy(study: CaseStudy): void { this.showAddForm.set(false); this.editingStudy.set(study); }
  onFormSaved(): void { this.editingStudy.set(null); this.showAddForm.set(false); }
  signOut(): void { this.authService.signOut().then(() => this.router.navigate(['/admin/login'])); }
}
