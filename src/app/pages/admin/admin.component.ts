import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaseStudyService } from '../../core/services/case-study.service';
import { ResumeService } from '../../core/services/resume.service';
import { SettingsService } from '../../core/services/settings.service';
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
  private resumeService    = inject(ResumeService);
  private settingsService  = inject(SettingsService);
  private authService      = inject(AuthService);
  private router           = inject(Router);

  // ── Display Settings ─────────────────────────────────────────
  settings    = toSignal(this.settingsService.get(), { initialValue: { columnsPerRow: 2 as const } });
  columnOptions: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
  setColumns(n: 1 | 2 | 3 | 4): void { this.settingsService.setColumns(n); }

  // ── Case Studies ─────────────────────────────────────────────
  studies$     = this.caseStudyService.getAll();
  editingStudy = signal<CaseStudy | null>(null);
  showAddForm  = signal(false);

  toggleVisibility(study: CaseStudy): void { this.caseStudyService.toggleVisibility(study.id, !study.visible); }
  deleteStudy(study: CaseStudy): void { if (confirm(`Delete "${study.title}"?`)) this.caseStudyService.delete(study.id); }
  editStudy(study: CaseStudy): void { this.showAddForm.set(false); this.editingStudy.set(study); }
  onFormSaved(): void { this.editingStudy.set(null); this.showAddForm.set(false); }

  // ── Resumes ──────────────────────────────────────────────────
  resumes$       = this.resumeService.getAll();
  showResumeForm = signal(false);
  resumeTab      = signal<'upload' | 'link'>('upload');
  resumeName     = signal('');
  resumeUrl      = signal('');
  selectedFile   = signal<File | null>(null);
  fileSizeMB     = signal<string>('');
  sizeError      = signal('');
  saving         = signal(false);

  setTab(tab: 'upload' | 'link'): void {
    this.resumeTab.set(tab);
    this.selectedFile.set(null);
    this.fileSizeMB.set('');
    this.sizeError.set('');
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.sizeError.set('');
    if (!file) { this.selectedFile.set(null); return; }
    const mb = file.size / 1024 / 1024;
    if (mb > 0.75) {
      this.sizeError.set(`File is ${mb.toFixed(2)} MB. Please keep it under 750 KB so it fits in Firestore.`);
      this.selectedFile.set(null);
      return;
    }
    this.selectedFile.set(file);
    this.fileSizeMB.set(mb.toFixed(2));
    if (!this.resumeName().trim()) {
      this.resumeName.set(file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '));
    }
  }

  async addResume(): Promise<void> {
    const name = this.resumeName().trim();
    if (!name) return;
    this.saving.set(true);
    try {
      let fileUrl: string;
      if (this.resumeTab() === 'upload') {
        const file = this.selectedFile();
        if (!file) return;
        fileUrl = await this.readAsDataUrl(file);
      } else {
        fileUrl = this.resumeUrl().trim();
        if (!fileUrl) return;
      }
      await this.resumeService.add({ name, fileUrl, visible: false });
      this.resetForm();
    } finally {
      this.saving.set(false);
    }
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private resetForm(): void {
    this.resumeName.set('');
    this.resumeUrl.set('');
    this.selectedFile.set(null);
    this.fileSizeMB.set('');
    this.sizeError.set('');
    this.showResumeForm.set(false);
  }

  setActiveResume(id: string): void { this.resumeService.setActive(id); }
  hideResume(id: string): void      { this.resumeService.hide(id); }
  deleteResume(id: string): void    { if (confirm('Delete this resume?')) this.resumeService.delete(id); }

  // ── Auth ─────────────────────────────────────────────────────
  signOut(): void { this.authService.signOut().then(() => this.router.navigate(['/admin/login'])); }
}
