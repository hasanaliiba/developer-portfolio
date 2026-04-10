import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkComponent } from './work.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CaseStudyService } from '../../core/services/case-study.service';
import { of } from 'rxjs';
import { CaseStudy } from '../../shared/models/case-study.model';
import { Timestamp } from '@angular/fire/firestore';

const mockStudy: CaseStudy = { id:'1', title:'Project Alpha', slug:'project-alpha', bannerUrl:'https://x.com/img.jpg', tags:['Angular'], problem:'p', solution:'s', result:'r', visible:true, order:1, createdAt:{} as Timestamp };

describe('WorkComponent', () => {
  let fixture: ComponentFixture<WorkComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkComponent, RouterTestingModule],
      providers: [{ provide: CaseStudyService, useValue: { getVisible: () => of([mockStudy]) } }],
    }).compileComponents();
    fixture = TestBed.createComponent(WorkComponent);
    fixture.detectChanges();
  });
  it('displays Work heading', () => expect(fixture.nativeElement.textContent).toContain('Work'));
  it('renders case study card', async () => {
    await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Project Alpha');
  });
});
