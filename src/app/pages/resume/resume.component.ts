import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resume.component.html',
})
export class ResumeComponent {
  downloadPdf(): void {
    window.print();
  }
}
