import { Timestamp } from '@angular/fire/firestore';

export interface Metric {
  value: string;   // e.g. "50%"
  label: string;   // e.g. "Faster Procurement"
}

export interface SolutionItem {
  title: string;
  description: string;
}

export interface BenefitItem {
  title: string;
  description: string;
}

export interface CaseStudy {
  id: string;

  // ── Hero ──────────────────────────
  title: string;
  subtitle: string;
  slug: string;
  bannerUrl: string;
  tags: string[];
  liveUrl: string;
  metrics: Metric[];           // up to 4 stat cards

  // ── Challenge ─────────────────────
  problem: string;             // overview paragraph
  challengePoints: string[];   // bullet points

  // ── Solution ──────────────────────
  solution: string;            // overview paragraph
  solutionItems: SolutionItem[];

  // ── Results ───────────────────────
  result: string;              // overview paragraph
  benefits: BenefitItem[];

  // ── Sidebar ───────────────────────
  technologies: string[];
  client: string;
  timeline: string;
  role: string;
  industry: string;

  // ── Meta ──────────────────────────
  order: number;
  visible: boolean;
  createdAt: Timestamp;
}

export type CaseStudyCreate = Omit<CaseStudy, 'id' | 'createdAt'>;
