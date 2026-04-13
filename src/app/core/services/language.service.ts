// src/app/core/services/language.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { LangCode, T, translations } from '../i18n/translations';

export const SUPPORTED_LANGS: { code: LangCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly currentLang = signal<LangCode>(this.detectLang());
  readonly t = computed<T>(() => translations[this.currentLang()]);

  constructor() {
    // Set lang attribute on init
    document.documentElement.lang = this.currentLang();
  }

  setLang(code: LangCode): void {
    this.currentLang.set(code);
    localStorage.setItem('portfolio-lang', code);
    document.documentElement.lang = code;
  }

  private detectLang(): LangCode {
    const stored = localStorage.getItem('portfolio-lang') as LangCode | null;
    if (stored && stored in translations) return stored;
    // Match browser language prefix (e.g. 'fr-FR' → 'fr')
    const browser = navigator.language.split('-')[0] as LangCode;
    if (browser in translations) return browser;
    return 'en';
  }
}
