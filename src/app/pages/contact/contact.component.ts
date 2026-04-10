import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');

  submit(): void {
    if (this.form.invalid) return;
    this.status.set('sending');
    this.http.post(environment.formspreeEndpoint, this.form.value, {
      headers: { Accept: 'application/json' },
    }).subscribe({
      next: () => { this.status.set('sent'); this.form.reset(); },
      error: () => this.status.set('error'),
    });
  }
}
