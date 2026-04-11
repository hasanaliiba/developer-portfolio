import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseStudyFormComponent } from './case-study-form.component';
import { CaseStudyService } from '../../../core/services/case-study.service';

describe('CaseStudyFormComponent', () => {
  let fixture: ComponentFixture<CaseStudyFormComponent>;
  let mockService: jasmine.SpyObj<CaseStudyService>;
  beforeEach(async () => {
    mockService = jasmine.createSpyObj('CaseStudyService', ['add', 'update']);
    mockService.add.and.returnValue(Promise.resolve());
    mockService.update.and.returnValue(Promise.resolve());
    await TestBed.configureTestingModule({
      imports: [CaseStudyFormComponent],
      providers: [{ provide: CaseStudyService, useValue: mockService }],
    }).compileComponents();
    fixture = TestBed.createComponent(CaseStudyFormComponent);
    fixture.detectChanges();
  });
  it('renders title input', () => expect(fixture.nativeElement.querySelector('input[formControlName="title"]')).toBeTruthy());
  it('renders slug input', () => expect(fixture.nativeElement.querySelector('input[formControlName="slug"]')).toBeTruthy());
  it('renders problem textarea', () => expect(fixture.nativeElement.querySelector('textarea[formControlName="problem"]')).toBeTruthy());
  it('calls add() on valid submit', async () => {
    const comp = fixture.componentInstance;
    comp.form.setValue({ title:'Test', slug:'test', bannerUrl:'https://x.com/img.jpg', tags:'Angular', problem:'p', solution:'s', result:'r', visible:true, order:1 });
    await comp.save();
    expect(mockService.add).toHaveBeenCalled();
  });
});
