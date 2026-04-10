import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseStudyComponent } from './case-study.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CaseStudyService } from '../../core/services/case-study.service';
import { of } from 'rxjs';
import { CaseStudy } from '../../shared/models/case-study.model';
import { Timestamp } from '@angular/fire/firestore';

const mockStudy: CaseStudy = { id:'1', title:'Project Beta', slug:'project-beta', bannerUrl:'https://x.com/img.jpg', tags:['Angular','Laravel'], problem:'The problem was X.', solution:'The solution was Y.', result:'The result was Z.', visible:true, order:1, createdAt:{} as Timestamp };

describe('CaseStudyComponent', () => {
  let fixture: ComponentFixture<CaseStudyComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudyComponent, RouterTestingModule],
      providers: [{ provide: CaseStudyService, useValue: { getBySlug: () => of(mockStudy) } }],
    }).compileComponents();
    fixture = TestBed.createComponent(CaseStudyComponent);
    fixture.detectChanges();
  });
  it('displays title', async () => { await fixture.whenStable(); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('Project Beta'); });
  it('displays Problem section', async () => { await fixture.whenStable(); fixture.detectChanges(); expect(fixture.nativeElement.textContent?.toUpperCase()).toContain('PROBLEM'); });
  it('displays Solution section', async () => { await fixture.whenStable(); fixture.detectChanges(); expect(fixture.nativeElement.textContent?.toUpperCase()).toContain('SOLUTION'); });
  it('displays Result section', async () => { await fixture.whenStable(); fixture.detectChanges(); expect(fixture.nativeElement.textContent?.toUpperCase()).toContain('RESULT'); });
});
