# Portfolio Redesign — Design Spec
**Date:** 2026-04-12  
**Status:** Approved  
**Stack:** Angular 17+ standalone components, Tailwind CSS, TypeScript signals

---

## 1. Overview

A full visual and structural redesign of Hasan Ali's front-end portfolio. The site moves from a multi-page tab-based navigation to a single scrollable home page with anchor sections, retaining individual case study detail pages. The design style is **Motion-Driven** — scroll-entrance animations, microinteractions, and an interactive hero background.

---

## 2. Architecture Changes

### Navigation restructure
- **Remove** Work and Contact as separate route pages from the nav
- **Add** Work and Contact as scroll-anchor sections on the home page (`#work`, `#contact`)
- **Convert** the Resume nav tab to a button that opens the active resume PDF in a new tab
- The About section already exists on home — keep as scroll anchor `#about`

### Home page section order
```
[Nav — fixed floating pill]
[Hero]
[About + Skills]      ← #about
[Work / Case Studies] ← #work
[Contact]             ← #contact
[Footer]
```

---

## 3. Design Tokens

### Colours
```
--c-bg:          #09090b   (dark bg)
--c-bg-surface:  #18181b   (dark card surface)
--c-bg-border:   #27272a   (dark border)
--c-text:        #fafafa   (dark mode text)
--c-muted:       #71717a   (secondary text)
--c-subtle:      #a1a1aa   (tertiary / placeholders)
--c-accent:      #22c55e   (green primary accent)
--c-accent-dim:  rgba(34,197,94,0.12)  (tinted bg)

/* Light mode overrides */
--c-bg:          #ffffff
--c-bg-surface:  #f9fafb
--c-bg-border:   #e4e4e7
--c-text:        #09090b
--c-muted:       #52525b
--c-subtle:      #a1a1aa
```

### Typography
- **Body / UI:** Inter (400, 500, 600, 700, 800)
- **Monospace / tags / labels:** Fira Code (400, 500)
- **Scale:** 10 → 11 → 12 → 13 → 14 → 15 → 16 → 18 → 24 → 32 → 48 → 52px

### Spacing
4pt base grid. All spacing values multiples of 4px.

### Border radius
- Tags / pills: 6px
- Cards: 14px
- Nav pill: 999px (fully rounded)
- Buttons: 10px

---

## 4. Navigation

**Structure:** Floating pill fixed to the top of the viewport.

**Layout:**
```
[Hasan Ali]   [About · Work · Contact   Resume ↗]   [☀/🌙]
```

- **Left:** "Hasan Ali" in Inter 700, 15px
- **Centre-right:** Pill widget — `background: var(--c-bg-surface)`, `border: 1px solid var(--c-bg-border)`, `border-radius: 999px`, `padding: 4px 5px`. Active link gets a white inner pill (`background:#fff, box-shadow: 0 1px 3px rgba(0,0,0,0.08)`). Resume is a filled dark button inside the pill.
- **Far right:** Theme toggle icon button
- **Scroll behaviour:** Active section highlighted via IntersectionObserver updating the active nav link
- **Backdrop:** `backdrop-filter: blur(12px)` with slight transparency so content scrolls beneath it

---

## 5. Hero Section

**Style:** Dark full-screen (`background: #09090b`), left-aligned content, interactive node network background.

**Node network:**
- Canvas element fills the hero, `pointer-events: none`, sits behind content
- ~38 floating dots (`fill: rgba(34,197,94,0.5)`, radius 1–2.8px)
- Dots connect with faint green lines when within 110px of each other (`opacity` proportional to distance)
- On `mousemove`, dots within 130px of cursor draw lines toward the cursor (stronger opacity)
- Animation via `requestAnimationFrame`, dots drift at ±0.4px/frame, bounce off edges
- Dark mode: green-tinted nodes. Light mode: slightly less opaque nodes (same canvas logic, CSS custom property controls colour)

**Content layout:**
```
[Available for work •]     ← green pill badge, dot pulses
[Building digital          ← Inter 800, 52px, -0.03em tracking
 experiences that
 make an impact]           ← "make an impact" in #22c55e
[sub-headline paragraph]   ← Inter 400, 15px, #71717a
[See my work →]  [Get in touch]   ← green + ghost buttons
```

**Entrance animation:** Content fades up (Fade Up + Stagger) on page load, not scroll — the hero is always above the fold.

**"Available for work" badge:**
- `background: rgba(34,197,94,0.1)`, `border: 1px solid rgba(34,197,94,0.25)`, `color: #4ade80`
- Pulsing green dot: `animation: pulse 1.8s ease-in-out infinite` (scale + opacity)

**Buttons:**
- Primary: `background: #22c55e`, `color: #09090b`, `font-weight: 700`, `border-radius: 10px`
- Secondary: `background: transparent`, `border: 1px solid #3f3f46`, `color: #fafafa`

---

## 6. About + Skills Section

**Layout:** Two-column CSS Grid (`1fr 1fr`, gap 40px), aligned to the start.

**Left — Bio:**
- Eyebrow label: Fira Code, 10px, uppercase, `color: #a1a1aa`, `letter-spacing: 0.22em`
- Heading: Inter 700, 26px, "My background"
- Three paragraphs of bio text: Inter 400, 13px, `line-height: 1.8`, `color: var(--c-muted)`
- CTA link: "See my work" with a short horizontal line before it (24px wide, 2px height)

**Right — Skills card (compact):**
- Container: `background: var(--c-bg-surface)`, `border: 1px solid var(--c-bg-border)`, `border-radius: 14px`, `padding: 16px 18px`
- Title: Inter 600, 12px
- Four groups: Frontend / Backend / Design / Tools
- Group label: Fira Code, 9px, uppercase, `color: #a1a1aa`, `letter-spacing: 0.2em`
- Tags: `background: #f4f4f5`, `border: 1px solid #e4e4e7`, `color: #374151`, `font-size: 11px`, `padding: 3px 10px`, `border-radius: 6px`
- Group margin-bottom: 12px (last child 0)

**Scroll entrance:** Fade Up + Stagger — left column first, right card 120ms later.

---

## 7. Case Study Cards

**Grid:** CSS Grid with columns driven by the `columnsPerRow` site setting (1–4). Default 2.

**Card structure:**
```
[Dark gradient image header — 160px tall]
  └ Tech tags (max 3 visible) + +N overflow pill  ← overlaid bottom-left
[White/dark card body]
  ├ Meta line: "Web App · 2024" (Fira Code, 10px, muted)
  ├ Title (Inter 700, 15px)
  ├ Description (Inter 400, 12px, 2–3 lines)
  └ "View case study →" (Inter 600, 12px, accent green)
```

**Image header:**
- `background: linear-gradient(135deg, ...)` — each card uses a unique dark gradient based on its primary colour. Falls back gracefully when no banner image uploaded.
- When a real banner image exists: displayed as `object-fit: cover` with a dark overlay (`rgba(0,0,0,0.45)`) so tags remain legible

**Tag overflow:**
- Show first 3 tags only
- If more exist: append a `+N` pill
- Light mode pill: `background: rgba(34,197,94,0.15)`, `border: 1px solid rgba(34,197,94,0.35)`, `color: #4ade80`
- Tags themselves: `background: rgba(255,255,255,0.1)`, `border: 1px solid rgba(255,255,255,0.18)`, `color: rgba(255,255,255,0.85)`, Fira Code 10px

**Hover state:** `transform: translateY(-4px)`, `box-shadow: 0 12px 32px rgba(0,0,0,0.09)`, `transition: 0.2s ease`

**Dark mode:** Card body switches to `background: #09090b`, `border: 1px solid #27272a`. Tags get green-tinted pills. Green glow radial in image header.

**Card height consistency:** `host: { class: 'flex w-full h-full' }` on the card component. Anchor tag inside uses `flex flex-col h-full`. CTA link uses `mt-auto` to pin to the bottom.

---

## 8. Contact Section

**Style:** Dark, centred, minimal (`background: #09090b`).

**Layout:** Single centred column, `max-width: 560px`, `padding: 80px 52px`.

**Content:**
```
[Get in touch]             ← Fira Code eyebrow, green
[Let's build               ← Inter 800, 48px
 something great]          ← "something great" in #22c55e
[sub-text paragraph]       ← 15px, #71717a

[hasan@example.com   copy] ← email pill with copy button

[Send email ↗]             ← green button, full width
[LinkedIn ↗]  [GitHub ↗]   ← two muted buttons side by side
```

**Email pill:**
- `background: #18181b`, `border: 1px solid #27272a`, `border-radius: 14px`, `padding: 14px 22px`
- Email in Fira Code, 15px, `color: #fafafa`
- Copy button: `background: #27272a`, `border-radius: 6px` — clicking copies to clipboard

**Buttons:**
- Send email: `background: #22c55e`, `color: #09090b`, `font-weight: 700`, full width
- LinkedIn + GitHub: side by side, `background: #18181b`, `border: 1px solid #27272a`, `color: #a1a1aa`
- All: `border-radius: 10px`, `padding: 10–12px 22px`

**No contact form** — directs to email + social links only.

**Green glow:** `radial-gradient(ellipse, rgba(34,197,94,0.1), transparent 65%)` centred behind the content.

**Scroll entrance:** Fade Up + Stagger — eyebrow, heading, sub-text, email pill, buttons each stagger 120ms.

---

## 9. Animation System

**Trigger:** IntersectionObserver — threshold 0.15, `rootMargin: '0px 0px -60px 0px'`

**Entrance animation (Fade Up + Stagger):**
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
- Duration: `500ms`
- Easing: `ease-out`
- Stagger: `120ms` between sibling elements
- Each animatable element starts with `opacity: 0` and gets `.in-view` class when observed

**Hero entrance:** Same animation on page load (`animation-delay` staggered), not scroll-triggered.

**Card hover:** `transform: translateY(-4px)` + box-shadow, `transition: 200ms ease`

**Nav active pill:** Smooth background slide via CSS transition on the active indicator

**Reduced motion:** All animations wrapped in `@media (prefers-reduced-motion: no-preference)` — if user has reduced motion enabled, elements are visible immediately with no animation.

---

## 10. Theme Toggle (Light / Dark)

- Toggle stored in `localStorage` and applied as a `data-theme` attribute on `<html>`
- CSS custom properties (`--c-*`) switch based on `[data-theme="dark"]`
- Default: dark mode (matches hero)
- Icon: ☀ (light mode active) / 🌙 (dark mode active)

---

## 11. Footer

Minimal strip below the contact section:
```
© 2026 Hasan Ali · Built with Angular & Tailwind
```
- 13px, `color: #3f3f46` (dark) / `#a1a1aa` (light)
- No links, no columns — keep it clean

---

## 12. Responsive Behaviour

- **Mobile (< 768px):** Two-column layouts collapse to single column. Nav pill hides text links — shows hamburger or icon-only. Hero headline scales down to ~36px. Cards default to 1 column.
- **Tablet (768–1023px):** Two columns for about section. Cards at 2 columns.
- **Desktop (≥ 1024px):** Full layout as designed. Cards follow `columnsPerRow` setting.

---

## 13. Out of Scope

- The admin panel UI is not being redesigned in this spec — only the public-facing portfolio pages
- The case study detail page (`/case-study/:slug`) was redesigned in a prior session and is not changed here
- No new backend/Firestore changes required for this redesign
