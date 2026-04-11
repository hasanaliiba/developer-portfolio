import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CaseStudyService } from '../../core/services/case-study.service';
import { AuthService } from '../../core/services/auth.service';
import { CaseStudy } from '../../shared/models/case-study.model';
import { Timestamp } from '@angular/fire/firestore';
import { of } from 'rxjs';

const mockStudy: CaseStudy = { id:'1', title:'Admin Test', slug:'admin-test', bannerUrl:'https://x.com/img.jpg', tags:['Angular'], problem:'p', solution:'s', result:'r', visible:true, order:1, createdAt:{} as Timestamp };

describe('AdminComponent', () => {
  let fixture: ComponentFixture<AdminComponent>;
  let mockCS: jasmine.SpyObj<CaseStudyService>;
  let mockAuth: jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    mockCS = jasmine.createSpyObj('CaseStudyService', ['getAll','toggleVisibility','delete','add','update']);
    mockCS.getAll.and.returnValue(of([mockStudy]));
    mockCS.toggleVisibility.and.returnValue(Promise.resolve());
    mockCS.delete.and.returnValue(Promise.resolve());
    mockAuth = jasmine.createSpyObj('AuthService', ['signOut']);
    mockAuth.signOut.and.returnValue(Promise.resolve());
    await TestBed.configureTestingModule({
      imports: [AdminComponent, RouterTestingModule],
      providers: [{ provide: CaseStudyService, useValue: mockCS }, { provide: AuthService, useValue: mockAuth }],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
  });
  it('displays case study title', async () => { await fixture.whenStable(); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('Admin Test'); });
  it('calls toggleVisibility on toggle click', async () => { await fixture.whenStable(); fixture.detectChanges(); fixture.nativeElement.querySelector('[data-testid="toggle-visibility"]').click(); expect(mockCS.toggleVisibility).toHaveBeenCalledWith('1', false); });
  it('calls delete after confirm', async () => { await fixture.whenStable(); fixture.detectChanges(); spyOn(window,'confirm').and.returnValue(true); fixture.nativeElement.querySelector('[data-testid="delete"]').click(); expect(mockCS.delete).toHaveBeenCalledWith('1'); });
});
