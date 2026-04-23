import { Injectable, inject } from '@angular/core';
import {
  Firestore, doc, docData, setDoc,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface SiteSettings {
  columnsPerRow: 1 | 2 | 3 | 4;
  i18nEnabled?: boolean;
  /** When false, the Experience timeline block is hidden on the home page. Default: visible. */
  showExperienceSection?: boolean;
  /** When false, the GitHub activity block is hidden on the home page. Default: visible. */
  showGithubSection?: boolean;
}

const DEFAULTS: SiteSettings = {
  columnsPerRow: 2,
  i18nEnabled: true,
  showExperienceSection: true,
  showGithubSection: true,
};
const REF = 'settings/display';
const CACHE_KEY = 'portfolio-settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private firestore = inject(Firestore);

  /** Read cached settings synchronously — used as initialValue to avoid Firestore flicker. */
  getCached(): SiteSettings {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {}
    return DEFAULTS;
  }

  get(): Observable<SiteSettings> {
    return (docData(doc(this.firestore, REF)) as Observable<SiteSettings | undefined>).pipe(
      map(s => s ?? DEFAULTS),
      tap(s => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(s)); } catch {} }),
      catchError(() => of(DEFAULTS)),
    );
  }

  setColumns(columnsPerRow: 1 | 2 | 3 | 4): Promise<void> {
    this.patchCache({ columnsPerRow });
    return setDoc(doc(this.firestore, REF), { columnsPerRow }, { merge: true });
  }

  setI18nEnabled(i18nEnabled: boolean): Promise<void> {
    this.patchCache({ i18nEnabled });
    return setDoc(doc(this.firestore, REF), { i18nEnabled }, { merge: true });
  }

  setShowExperienceSection(showExperienceSection: boolean): Promise<void> {
    this.patchCache({ showExperienceSection });
    return setDoc(doc(this.firestore, REF), { showExperienceSection }, { merge: true });
  }

  setShowGithubSection(showGithubSection: boolean): Promise<void> {
    this.patchCache({ showGithubSection });
    return setDoc(doc(this.firestore, REF), { showGithubSection }, { merge: true });
  }

  private patchCache(patch: Partial<SiteSettings>): void {
    try {
      const current = this.getCached();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ...current, ...patch }));
    } catch {}
  }
}
