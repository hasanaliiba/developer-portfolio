import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarNavComponent } from './sidebar-nav.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarNavComponent', () => {
  let fixture: ComponentFixture<SidebarNavComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SidebarNavComponent, RouterTestingModule] }).compileComponents();
    fixture = TestBed.createComponent(SidebarNavComponent);
    fixture.detectChanges();
  });
  it('renders HA initials', () => expect(fixture.nativeElement.textContent).toContain('HA'));
  it('renders Work link', () => expect(fixture.nativeElement.textContent?.toUpperCase()).toContain('WORK'));
  it('renders Contact link', () => expect(fixture.nativeElement.textContent?.toUpperCase()).toContain('CONTACT'));
});
