import { Injectable, inject } from '@angular/core';
import {
  Firestore, doc, docData, setDoc,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface SiteSettings {
  columnsPerRow: 1 | 2 | 3 | 4;
  i18nEnabled?: boolean;
}

const DEFAULTS: SiteSettings = { columnsPerRow: 2, i18nEnabled: true };
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

  private patchCache(patch: Partial<SiteSettings>): void {
    try {
      const current = this.getCached();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ...current, ...patch }));
    } catch {}
  }
}
