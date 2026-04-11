import { Timestamp } from '@angular/fire/firestore';

export interface Resume {
  id: string;
  name: string;       // display label, e.g. "Software Engineer Resume"
  fileUrl: string;    // public URL or assets path
  visible: boolean;   // only one should be true at a time
  createdAt: Timestamp;
}

export type ResumeCreate = Omit<Resume, 'id' | 'createdAt'>;
