import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ContactComponent', () => {
  let fixture: ComponentFixture<ContactComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
  });
  it('renders name input', () => expect(fixture.nativeElement.querySelector('input[formControlName="name"]')).toBeTruthy());
  it('renders email input', () => expect(fixture.nativeElement.querySelector('input[formControlName="email"]')).toBeTruthy());
  it('renders message textarea', () => expect(fixture.nativeElement.querySelector('textarea[formControlName="message"]')).toBeTruthy());
  it('submit button disabled when invalid', () => expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue());
  it('shows GitHub link', () => expect(fixture.nativeElement.textContent?.toLowerCase()).toContain('github'));
});
