// src/app/core/services/experience.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ExperienceItem, ExperienceDoc } from '../../shared/models/experience.model';

const CACHE_KEY = 'portfolio-experience';

const DEFAULT_ITEMS: ExperienceItem[] = [
  {
    role: 'Front-End Developer',
    company: 'Freelance / Self-employed',
    type: 'Freelance',
    period: '2023 – Present',
    current: true,
    bullets: [
      'Designing and building Angular SPAs with signal-based state, lazy loading, and component-level performance tuning.',
      'Architecting Laravel REST APIs with MySQL and Firebase backends consumed by Angular front ends.',
      'Delivering responsive, pixel-perfect interfaces from Figma designs using Tailwind CSS.',
      'Automating CI/CD pipelines with GitHub Actions and Docker for streamlined production deployments.',
    ],
    tags: ['Angular', 'TypeScript', 'RxJS', 'Laravel', 'Tailwind CSS', 'Firebase', 'Docker'],
  },
  {
    role: 'Junior Front-End Developer',
    company: 'Digital Agency',
    type: 'Full-time',
    period: '2021 – 2023',
    current: false,
    bullets: [
      'Built and maintained client-facing Angular applications with a focus on component reusability.',
      'Collaborated with UI/UX designers to translate Figma prototypes into accessible, mobile-first interfaces.',
      'Optimised bundle size and runtime performance through lazy loading and code-splitting strategies.',
      'Integrated RESTful APIs and third-party services including payment gateways and analytics platforms.',
    ],
    tags: ['Angular', 'TypeScript', 'JavaScript', 'SCSS', 'REST APIs', 'Git'],
  },
  {
    role: 'Web Developer',
    company: 'Web Studio',
    type: 'Full-time',
    period: '2019 – 2021',
    current: false,
    bullets: [
      'Developed and maintained Laravel-based applications and e-commerce sites for SME clients.',
      'Built dynamic front-end experiences with vanilla JavaScript before transitioning to modern frameworks.',
      'Managed MySQL databases and handled server administration on Linux environments.',
    ],
    tags: ['Laravel', 'PHP', 'JavaScript', 'MySQL', 'HTML', 'CSS', 'Linux'],
  },
];

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private firestore = inject(Firestore);
  private ref = doc(this.firestore, 'settings', 'experience');

  getCached(): ExperienceItem[] {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) return JSON.parse(raw) as ExperienceItem[];
    } catch {}
    return DEFAULT_ITEMS;
  }

  get(): Observable<ExperienceItem[]> {
    return (docData(this.ref) as Observable<ExperienceDoc | undefined>).pipe(
      map(d => (d?.items?.length ? d.items : DEFAULT_ITEMS)),
      tap(items => {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)); } catch {}
      }),
    );
  }

  save(items: ExperienceItem[]): Promise<void> {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)); } catch {}
    return setDoc(this.ref, { items } satisfies ExperienceDoc);
  }
}
