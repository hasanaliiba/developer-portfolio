import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resume.component.html',
})
export class ResumeComponent {
  private sanitizer = inject(DomSanitizer);
  readonly pdfUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/resume.pdf');
  readonly pdfHref = 'assets/resume.pdf';
  
  downloadPdf(): void {
    const a = document.createElement('a');
    a.href = this.pdfHref;
    a.download = 'Hasan_Ali_Resume.pdf';
    a.click();
  }
}
