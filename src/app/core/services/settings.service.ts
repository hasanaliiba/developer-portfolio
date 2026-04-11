import { Injectable, inject } from '@angular/core';
import {
  Firestore, doc, docData, setDoc,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface SiteSettings {
  columnsPerRow: 1 | 2 | 3 | 4;
}

const DEFAULTS: SiteSettings = { columnsPerRow: 2 };
const REF = 'settings/display';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private firestore = inject(Firestore);

  get(): Observable<SiteSettings> {
    return (docData(doc(this.firestore, REF)) as Observable<SiteSettings | undefined>).pipe(
      map(s => s ?? DEFAULTS),
      catchError(() => of(DEFAULTS)),
    );
  }

  setColumns(columnsPerRow: 1 | 2 | 3 | 4): Promise<void> {
    return setDoc(doc(this.firestore, REF), { columnsPerRow }, { merge: true });
  }
}
