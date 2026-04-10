import { Component, input, OnInit, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  template: `<span>{{ displayed() }}<span class="cursor text-[#22c55e] animate-pulse font-thin">_</span></span>`,
})
export class TypewriterComponent implements OnInit, OnDestroy {
  text = input.required<string>();
  speed = input<number>(80);
  displayed = signal('');
  private index = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void { this.typeNext(); }
  private typeNext(): void {
    if (this.index < this.text().length) {
      this.displayed.update(d => d + this.text()[this.index++]);
      this.timer = setTimeout(() => this.typeNext(), this.speed());
    }
  }
  ngOnDestroy(): void { if (this.timer) clearTimeout(this.timer); }
}
