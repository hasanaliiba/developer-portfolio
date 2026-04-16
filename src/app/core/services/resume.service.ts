import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData, doc,
  addDoc, updateDoc, deleteDoc, query,
  where, orderBy, serverTimestamp, CollectionReference, getDocs, writeBatch,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Resume, ResumeCreate } from '../../shared/models/resume.model';

const RESUME_CACHE_KEY = 'portfolio-active-resume';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private firestore = inject(Firestore);
  private col = collection(this.firestore, 'resumes') as CollectionReference<Resume>;

  /** Read cached active resume synchronously — used as initialValue to avoid Firestore flicker. */
  getCachedActive(): Resume | undefined {
    try {
      const raw = localStorage.getItem(RESUME_CACHE_KEY);
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  }

  getAll(): Observable<Resume[]> {
    return collectionData(query(this.col, orderBy('createdAt', 'desc')), { idField: 'id' }) as Observable<Resume[]>;
  }

  getActive(): Observable<Resume | undefined> {
    return (collectionData(
      query(this.col, where('visible', '==', true)),
      { idField: 'id' }
    ) as Observable<Resume[]>).pipe(
      map(r => r[0]),
      tap(r => {
        try {
          if (r) localStorage.setItem(RESUME_CACHE_KEY, JSON.stringify(r));
          else   localStorage.removeItem(RESUME_CACHE_KEY);
        } catch {}
      }),
    );
  }

  add(data: ResumeCreate): Promise<void> {
    return addDoc(this.col, { ...data, createdAt: serverTimestamp() } as any).then(() => {});
  }

  /** Set one resume as visible and hide all others atomically. */
  async setActive(id: string): Promise<void> {
    const snapshot = await getDocs(this.col);
    const batch = writeBatch(this.firestore);
    snapshot.docs.forEach(d => {
      batch.update(d.ref, { visible: d.id === id });
    });
    await batch.commit();
  }

  hide(id: string): Promise<void> {
    return updateDoc(doc(this.firestore, 'resumes', id), { visible: false });
  }

  delete(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'resumes', id));
  }
}
