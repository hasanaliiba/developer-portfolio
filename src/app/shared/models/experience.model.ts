// src/app/shared/models/experience.model.ts

export interface ExperienceItem {
  role: string;
  company: string;
  type: string;       // 'Full-time' | 'Freelance' | 'Contract' | 'Part-time' | 'Internship'
  period: string;     // e.g. "2023 – Present" or "Jan 2021 – Apr 2023"
  current: boolean;
  bullets: string[];
  tags: string[];
}

export interface ExperienceDoc {
  items: ExperienceItem[];
}
