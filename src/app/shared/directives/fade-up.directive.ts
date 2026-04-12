// src/app/shared/directives/fade-up.directive.ts
import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[fadeUp]',
  standalone: true,
})
export class FadeUpDirective implements OnInit, OnDestroy {
  /** Stagger delay in ms. Pass as [fadeUp]="120 * index" */
  @Input('fadeUp') delayMs: number = 0;

  private el = inject(ElementRef<HTMLElement>);
  private observer!: IntersectionObserver;

  ngOnInit(): void {
    const el = this.el.nativeElement;
    el.classList.add('fade-up');
    if (this.delayMs) {
      el.style.transitionDelay = `${this.delayMs}ms`;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add('in-view');
            this.observer.unobserve(el); // only animate once
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
