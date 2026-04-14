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

/** Per-language overrides for translatable text fields */
export interface CaseStudyI18n {
  title?: string;
  subtitle?: string;
  problem?: string;
  challengePoints?: string[];
  solution?: string;
  solutionItems?: SolutionItem[];
  result?: string;
  benefits?: BenefitItem[];
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

  // ── i18n ──────────────────────────
  /** Keyed by LangCode ('fr' | 'es' | 'ar'). Merged over base fields at display time. */
  i18n?: Record<string, CaseStudyI18n>;

  // ── Meta ──────────────────────────
  order: number;
  visible: boolean;
  createdAt: Timestamp;
}

export type CaseStudyCreate = Omit<CaseStudy, 'id' | 'createdAt'>;

/**
 * Returns a copy of `study` with the given language's translations merged in.
 * Falls back field-by-field to English when a translation is missing.
 */
export function localize(study: CaseStudy, lang: string): CaseStudy {
  if (lang === 'en' || !study.i18n?.[lang]) return study;
  const tr = study.i18n[lang];
  return {
    ...study,
    title:           tr.title           ?? study.title,
    subtitle:        tr.subtitle        ?? study.subtitle,
    problem:         tr.problem         ?? study.problem,
    challengePoints: tr.challengePoints ?? study.challengePoints,
    solution:        tr.solution        ?? study.solution,
    solutionItems:   tr.solutionItems   ?? study.solutionItems,
    result:          tr.result          ?? study.result,
    benefits:        tr.benefits        ?? study.benefits,
  };
}
