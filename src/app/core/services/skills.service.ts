// src/app/core/services/skills.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore, doc, docData, setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SkillGroup, SkillsDoc } from '../../shared/models/skill.model';

const CACHE_KEY = 'portfolio-skills';

const DEFAULT_GROUPS: SkillGroup[] = [
  {
    label: 'Frontend',
    skills: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS', 'Responsive'],
  },
  {
    label: 'Backend',
    skills: ['Laravel', 'PHP', 'Firebase', 'MySQL'],
  },
  {
    label: 'Tools',
    skills: ['Figma', 'Git', 'GitHub Actions', 'Docker', 'Linux'],
  },
];

@Injectable({ providedIn: 'root' })
export class SkillsService {
  private firestore = inject(Firestore);
  private ref = doc(this.firestore, 'settings', 'skills');

  /** Read cached groups synchronously for instant render. */
  getCached(): SkillGroup[] {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) return JSON.parse(raw) as SkillGroup[];
    } catch {}
    return DEFAULT_GROUPS;
  }

  /** Live stream from Firestore; falls back to defaults if doc is missing. */
  get(): Observable<SkillGroup[]> {
    return (docData(this.ref) as Observable<SkillsDoc | undefined>).pipe(
      map(d => (d?.groups?.length ? d.groups : DEFAULT_GROUPS)),
      tap(groups => {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(groups)); } catch {}
      }),
    );
  }

  /** Persist groups to Firestore (overwrites). */
  save(groups: SkillGroup[]): Promise<void> {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(groups)); } catch {}
    return setDoc(this.ref, { groups } satisfies SkillsDoc);
  }
}
