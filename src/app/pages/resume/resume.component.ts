import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ResumeService } from '../../core/services/resume.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resume.component.html',
})
export class ResumeComponent {
  private sanitizer = inject(DomSanitizer);
  private resumeService = inject(ResumeService);

  active = toSignal(
    this.resumeService.getActive().pipe(
      map(r => r
        ? { ...r, safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(r.fileUrl) }
        : null
      )
    )
  );

  downloadPdf(fileUrl: string, name: string): void {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = `${name.replace(/\s+/g, '_')}.pdf`;
    a.click();
  }
}
