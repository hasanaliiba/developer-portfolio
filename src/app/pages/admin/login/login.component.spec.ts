import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuth: jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    mockAuth = jasmine.createSpyObj('AuthService', ['signInWithGoogle']);
    mockAuth.signInWithGoogle.and.returnValue(Promise.resolve());
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuth }],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });
  it('renders sign-in button', () => expect(fixture.nativeElement.querySelector('button').textContent?.toLowerCase()).toContain('google'));
  it('calls signInWithGoogle on click', () => { fixture.nativeElement.querySelector('button').click(); expect(mockAuth.signInWithGoogle).toHaveBeenCalled(); });
});
