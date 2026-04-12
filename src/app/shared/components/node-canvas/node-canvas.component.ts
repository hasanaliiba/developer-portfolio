// src/app/shared/components/node-canvas/node-canvas.component.ts
import {
  Component, ElementRef, AfterViewInit,
  OnDestroy, ViewChild, inject, NgZone
} from '@angular/core';

interface CanvasNode {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
}

@Component({
  selector: 'app-node-canvas',
  standalone: true,
  template: `<canvas #canvas class="absolute inset-0 w-full h-full pointer-events-none"></canvas>`,
  host: { class: 'absolute inset-0 overflow-hidden pointer-events-none' },
})
export class NodeCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private darkMode = document.documentElement.getAttribute('data-theme') !== 'light';
  private themeObserver!: MutationObserver;

  private zone = inject(NgZone);
  private mouse = { x: -999, y: -999 };
  private nodes: CanvasNode[] = [];
  private rafId = 0;
  private resizeObserver!: ResizeObserver;

  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.init();
    });
  }

  private init(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    const parent = canvas.parentElement!;

    // Size canvas to parent
    const resize = () => {
      canvas.width  = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();

    this.resizeObserver = new ResizeObserver(resize);
    this.resizeObserver.observe(parent);

    this.themeObserver = new MutationObserver(() => {
      this.darkMode = document.documentElement.getAttribute('data-theme') !== 'light';
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Seed nodes
    this.nodes = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 1.8 + 1,
    }));

    // Mouse tracking on parent
    parent.addEventListener('mousemove', this.onMouseMove);
    parent.addEventListener('mouseleave', this.onMouseLeave);

    this.draw();
  }

  private onMouseMove = (e: MouseEvent): void => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  private onMouseLeave = (): void => {
    this.mouse = { x: -999, y: -999 };
  };

  private draw = (): void => {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const MAX_DIST   = 110;
    const MOUSE_DIST = 130;
    const dotColor   = this.darkMode ? 'rgba(34,197,94,0.5)'  : 'rgba(34,197,94,0.3)';
    const lineBase   = 'rgba(34,197,94,';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move nodes
    this.nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    // Node-to-node lines
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = lineBase + ((1 - d / MAX_DIST) * 0.18) + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Mouse lines
    this.nodes.forEach(n => {
      const d = Math.hypot(n.x - this.mouse.x, n.y - this.mouse.y);
      if (d < MOUSE_DIST) {
        ctx.beginPath();
        ctx.strokeStyle = lineBase + ((1 - d / MOUSE_DIST) * 0.55) + ')';
        ctx.lineWidth = 1;
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.stroke();
      }
    });

    // Dots
    this.nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    });

    this.rafId = requestAnimationFrame(this.draw);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    this.themeObserver?.disconnect();
    const parent = this.canvasRef?.nativeElement?.parentElement;
    parent?.removeEventListener('mousemove', this.onMouseMove);
    parent?.removeEventListener('mouseleave', this.onMouseLeave);
  }
}
