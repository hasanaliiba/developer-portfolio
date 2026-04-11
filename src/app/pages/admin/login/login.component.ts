import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-black px-12">
      <div class="text-center">
        <p class="text-[#333] text-xs tracking-[0.25em] uppercase font-mono mb-4">Portfolio</p>
        <h1 class="text-white text-3xl font-extrabold mb-10">Admin Portal</h1>
        <button (click)="signIn()" class="bg-[#22c55e] text-black font-bold text-sm px-8 py-4 rounded-sm hover:bg-[#16a34a] transition-colors">Sign in with Google</button>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  signIn(): void { this.auth.signInWithGoogle().then(() => this.router.navigate(['/admin'])); }
}
