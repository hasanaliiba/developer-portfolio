import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaseStudy, CaseStudyCreate } from '../../shared/models/case-study.model';

@Injectable({ providedIn: 'root' })
export class CaseStudyService {
  private firestore = inject(Firestore);
  private col = collection(this.firestore, 'case-studies') as CollectionReference<CaseStudy>;

  getVisible(): Observable<CaseStudy[]> {
    return collectionData(query(this.col, where('visible', '==', true), orderBy('order', 'asc')), { idField: 'id' }) as Observable<CaseStudy[]>;
  }
  getAll(): Observable<CaseStudy[]> {
    return collectionData(query(this.col, orderBy('order', 'asc')), { idField: 'id' }) as Observable<CaseStudy[]>;
  }
  getBySlug(slug: string): Observable<CaseStudy | undefined> {
    return (collectionData(query(this.col, where('slug', '==', slug), where('visible', '==', true)), { idField: 'id' }) as Observable<CaseStudy[]>).pipe(map(s => s[0]));
  }
  add(data: CaseStudyCreate): Promise<void> {
    return addDoc(this.col, { ...data, createdAt: serverTimestamp() } as any).then(() => {});
  }
  update(id: string, data: Partial<CaseStudyCreate>): Promise<void> {
    return updateDoc(doc(this.firestore, 'case-studies', id), data as any);
  }
  toggleVisibility(id: string, visible: boolean): Promise<void> {
    return updateDoc(doc(this.firestore, 'case-studies', id), { visible });
  }
  delete(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'case-studies', id));
  }
}
