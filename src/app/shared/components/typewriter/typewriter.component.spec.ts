import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TypewriterComponent } from './typewriter.component';

@Component({ standalone: true, imports: [TypewriterComponent], template: `<app-typewriter text="Hi" [speed]="0" />` })
class HostComponent {}

describe('TypewriterComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
  });
  it('types the full text', fakeAsync(() => {
    fixture.detectChanges(); tick(0); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Hi');
  }));
  it('renders cursor', fakeAsync(() => {
    fixture.detectChanges(); tick(0); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cursor')).toBeTruthy();
  }));
});
