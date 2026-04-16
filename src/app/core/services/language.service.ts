// src/app/core/services/language.service.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LangCode, T, translations } from '../i18n/translations';
import { SettingsService } from './settings.service';


const RTL_LANGS: LangCode[] = ['ar'];

export const SUPPORTED_LANGS: { code: LangCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
  { code: 'ar', label: 'العربية',  flag: '🇸🇦' },
];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private settingsService = inject(SettingsService);
  private settingsSignal = toSignal(
    this.settingsService.get(),
    { initialValue: this.settingsService.getCached() }
  );

  /** Whether the multi-language feature is active (controlled from admin). */
  readonly enabled = computed(() => this.settingsSignal().i18nEnabled !== false);

  readonly currentLang = signal<LangCode>(this.detectLang());

  /** Returns English when i18n is disabled, otherwise the selected language. */
  readonly t = computed<T>(() => translations[this.enabled() ? this.currentLang() : 'en']);

  readonly isRtl = computed(() => this.enabled() && RTL_LANGS.includes(this.currentLang()));

  constructor() {
    // Apply on init
    this.applyDomAttrs(this.currentLang());

    // React to the enabled toggle changing (Firestore-driven, async is fine here)
    effect(() => {
      this.applyDomAttrs(this.enabled() ? this.currentLang() : 'en');
    });
  }

  setLang(code: LangCode): void {
    this.currentLang.set(code);
    localStorage.setItem('portfolio-lang', code);
    // Synchronous — fixes the intermittent layout-vs-text race
    this.applyDomAttrs(code);
  }

  private applyDomAttrs(code: string): void {
    document.documentElement.lang = code;
    document.documentElement.dir  = RTL_LANGS.includes(code as LangCode) ? 'rtl' : 'ltr';
  }

  private detectLang(): LangCode {
    const stored = localStorage.getItem('portfolio-lang') as LangCode | null;
    if (stored && stored in translations) return stored;
    const browser = navigator.language.split('-')[0] as LangCode;
    if (browser in translations) return browser;
    return 'en';
  }
}
