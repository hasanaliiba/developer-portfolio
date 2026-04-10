import { Timestamp } from '@angular/fire/firestore';

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  bannerUrl: string;
  tags: string[];
  problem: string;
  solution: string;
  result: string;
  visible: boolean;
  order: number;
  createdAt: Timestamp;
}

export type CaseStudyCreate = Omit<CaseStudy, 'id' | 'createdAt'>;
