// src/app/core/services/language.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { LangCode, T, translations } from '../i18n/translations';

const RTL_LANGS: LangCode[] = ['ar'];

export const SUPPORTED_LANGS: { code: LangCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
  { code: 'ar', label: 'العربية',  flag: '🇸🇦' },
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly currentLang = signal<LangCode>(this.detectLang());
  readonly t = computed<T>(() => translations[this.currentLang()]);
  readonly isRtl = computed(() => RTL_LANGS.includes(this.currentLang()));

  constructor() {
    // Apply on init synchronously so dir/lang are always set before first render
    this.applyDomAttrs(this.currentLang());
  }

  setLang(code: LangCode): void {
    this.currentLang.set(code);
    localStorage.setItem('portfolio-lang', code);
    // Set DOM attributes synchronously — same tick as the signal update
    // so layout flip and text change always happen together
    this.applyDomAttrs(code);
  }

  private applyDomAttrs(code: LangCode): void {
    document.documentElement.lang = code;
    document.documentElement.dir  = RTL_LANGS.includes(code) ? 'rtl' : 'ltr';
  }

  private detectLang(): LangCode {
    const stored = localStorage.getItem('portfolio-lang') as LangCode | null;
    if (stored && stored in translations) return stored;
    const browser = navigator.language.split('-')[0] as LangCode;
    if (browser in translations) return browser;
    return 'en';
  }
}
