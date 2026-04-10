import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HomeComponent, RouterTestingModule] }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });
  it('displays Hasan Ali', () => expect(fixture.nativeElement.textContent).toContain('Hasan Ali'));
  it('displays Front End Developer', () => expect(fixture.nativeElement.textContent).toContain('Front End Developer'));
  it('has View Work link', () => expect(Array.from(fixture.nativeElement.querySelectorAll('a')).some((a:any) => a.textContent.includes('View Work'))).toBeTrue());
  it('has Contact link', () => expect(Array.from(fixture.nativeElement.querySelectorAll('a')).some((a:any) => a.textContent.includes('Contact'))).toBeTrue());
});
