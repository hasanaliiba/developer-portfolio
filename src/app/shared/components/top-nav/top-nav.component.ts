// src/app/shared/components/top-nav/top-nav.component.ts
import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { ResumeService } from '../../../core/services/resume.service';
import { LanguageService, SUPPORTED_LANGS } from '../../../core/services/language.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  templateUrl: './top-nav.component.html',
})
export class TopNavComponent implements OnInit, OnDestroy {
  readonly theme        = inject(ThemeService);
  readonly lang         = inject(LanguageService);
  private resumeService = inject(ResumeService);
  private router        = inject(Router);

  readonly supportedLangs = SUPPORTED_LANGS;

  readonly navLinks = computed(() => [
    { id: 'about',   label: this.lang.t().nav.about },
    { id: 'work',    label: this.lang.t().nav.work },
    { id: 'contact', label: this.lang.t().nav.contact },
  ]);

  readonly menuOpen      = signal(false);
  readonly langMenuOpen  = signal(false);
  readonly activeResume  = toSignal(this.resumeService.getActive());
  readonly activeSection = signal<string>('hero');

  private readonly SECTIONS = ['hero', 'about', 'work', 'contact'];
  private readonly NAV_OFFSET = 100; // px below nav to trigger

  private onScroll = (): void => {
    // If scrolled to (or near) the bottom, activate the last section
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
      this.activeSection.set(this.SECTIONS[this.SECTIONS.length - 1]);
      return;
    }

    let current = 'hero';
    for (const id of this.SECTIONS) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= this.NAV_OFFSET) {
        current = id;
      }
    }
    this.activeSection.set(current);
  };

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  toggleMenu(): void { this.menuOpen.update(v => !v); }
  closeMenu(): void  { this.menuOpen.set(false); }

  toggleLangMenu(): void { this.langMenuOpen.update(v => !v); }
  closeLangMenu(): void  { this.langMenuOpen.set(false); }
  setLang(code: any): void { this.lang.setLang(code); this.closeLangMenu(); }

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
