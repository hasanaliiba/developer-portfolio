// src/app/core/services/experience.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ExperienceItem, ExperienceDoc } from '../../shared/models/experience.model';

const CACHE_KEY = 'portfolio-experience';

const DEFAULT_ITEMS: ExperienceItem[] = [
  {
    role: 'Freelance Frontend Engineer',
    company: 'Self-employed',
    type: 'Freelance',
    period: 'Jan 2025 – Present',
    current: true,
    bullets: [
      'Building Angular SPAs for clients across fintech, SaaS, and e-commerce verticals.',
      'Delivering end-to-end solutions from architecture and component design to CI/CD deployment.',
      'Translating Figma designs into pixel-perfect, accessible, production-ready interfaces.',
      'Available for remote contracts and full-time roles worldwide.',
    ],
    tags: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Tailwind CSS', 'REST APIs'],
  },
  {
    role: 'Senior Software Engineer (Front End)',
    company: 'Techlogix',
    type: 'Full-time',
    period: 'Feb 2022 – Jan 2025',
    current: false,
    bullets: [
      'Architected and delivered the end-to-end Customer Onboarding module, converting manual intake into a dynamic, API-driven flow with MOL Code verification and automated KYC, resulting in 100% digitization of customer registrations.',
      'Architected and maintained a universal Angular component library following Clean Code and SOLID principles, standardising UI/UX patterns across UAE and Qatar platforms and accelerating development velocity by 25%.',
      'Executed a multi-version Angular migration (v6 → v15), transitioning from View Engine to Ivy, resulting in a 40% reduction in build times.',
      'Integrated Western Union and Ventaja RESTful APIs into core remittance screens, eliminating the need for external service portals.',
      'Provided technical mentorship to junior and mid-level developers through structured code reviews.',
    ],
    tags: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Angular Material', 'Kendo UI', 'REST APIs', 'Jenkins'],
  },
  {
    role: 'Software Engineer (Front End)',
    company: 'Techlogix',
    type: 'Full-time',
    period: 'Mar 2019 – Feb 2022',
    current: false,
    bullets: [
      'Overhauled grid pagination and rendering logic using Angular Material data tables, standardising data views for 2,000+ records and resolving memory-related crashes during batch searches.',
      'Centralised financial calculation logic into reusable Angular services, eliminating rounding discrepancies across currency and gold weight conversions.',
      'Migrated all system fonts and icons from external CDNs to local assets, delivering faster First Contentful Paint in firewalled banking environments.',
      'Authored unit and integration tests using Jasmine and Karma to validate financial calculation services, improving regression coverage across critical modules.',
    ],
    tags: ['Angular', 'TypeScript', 'RxJS', 'Angular Material', 'Jasmine', 'Karma', 'MySQL', 'Git'],
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
