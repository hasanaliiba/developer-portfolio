import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseStudyCardComponent } from './case-study-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CaseStudy } from '../../models/case-study.model';
import { Timestamp } from '@angular/fire/firestore';

const mockStudy: CaseStudy = { id:'1', title:'Test Project', slug:'test-project', bannerUrl:'https://example.com/img.jpg', tags:['Angular','TS'], problem:'p', solution:'s', result:'r', visible:true, order:1, createdAt:{} as Timestamp };

describe('CaseStudyCardComponent', () => {
  let fixture: ComponentFixture<CaseStudyCardComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CaseStudyCardComponent, RouterTestingModule] }).compileComponents();
    fixture = TestBed.createComponent(CaseStudyCardComponent);
    fixture.componentRef.setInput('study', mockStudy);
    fixture.detectChanges();
  });
  it('displays title', () => expect(fixture.nativeElement.textContent).toContain('Test Project'));
  it('displays tags', () => { expect(fixture.nativeElement.textContent).toContain('Angular'); expect(fixture.nativeElement.textContent).toContain('TS'); });
  it('renders banner image', () => expect(fixture.nativeElement.querySelector('img').src).toContain('example.com'));
  it('links to case study', () => expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toContain('test-project'));
});
