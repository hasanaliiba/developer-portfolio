// src/app/shared/components/top-nav/top-nav.component.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { ResumeService } from '../../../core/services/resume.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  templateUrl: './top-nav.component.html',
})
export class TopNavComponent implements OnInit, OnDestroy {
  readonly theme        = inject(ThemeService);
  private resumeService = inject(ResumeService);
  private router        = inject(Router);

  readonly navLinks = [
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'contact', label: 'Contact' },
  ];

  readonly menuOpen      = signal(false);
  readonly activeResume  = toSignal(this.resumeService.getActive());
  readonly activeSection = signal<string>('');
  private sectionObserver!: IntersectionObserver;

  ngOnInit(): void {
    const sections = ['hero', 'about', 'work', 'contact'];
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) this.sectionObserver.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
  }

  toggleMenu(): void { this.menuOpen.update(v => !v); }
  closeMenu(): void  { this.menuOpen.set(false); }

  scrollTo(sectionId: string): void {
    this.closeMenu();
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.doScroll(sectionId), 100);
      });
    } else {
      this.doScroll(sectionId);
    }
  }

  private doScroll(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  openResume(): void {
    const resume = this.activeResume();
    if (!resume?.fileUrl) return;
    const fileUrl = resume.fileUrl as string;
    if (fileUrl.startsWith('data:')) {
      const [header, data] = fileUrl.split(',');
      const mime = header.match(/:(.*?);/)?.[1] ?? 'application/pdf';
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 300_000);
    } else {
      window.open(fileUrl, '_blank');
    }
  }
}
