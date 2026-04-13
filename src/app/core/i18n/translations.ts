// src/app/core/i18n/translations.ts

export type LangCode = 'en' | 'fr' | 'es';

export interface T {
  nav:     { about: string; work: string; contact: string; resume: string };
  hero:    { badge: string; h1: string; h2: string; accent: string; sub: string; cta1: string; cta2: string };
  about:   { eyebrow: string; heading: string; p1: string; p2: string; p3: string; cta: string;
             skillsTitle: string; groups: { label: string; tags: string[] }[] };
  work:    { eyebrow: string; heading: string; all: string; empty: string };
  contact: { eyebrow: string; h1: string; accent: string; sub: string;
             copy: string; copied: string; sendEmail: string; linkedin: string; github: string };
  footer:  { text: string };
  card:    { eyebrow: string; cta: string };
}

export const translations: Record<LangCode, T> = {
  en: {
    nav: { about: 'About', work: 'Work', contact: 'Contact', resume: 'Resume' },
    hero: {
      badge:  'Available for work',
      h1:     'Building digital',
      h2:     'experiences that',
      accent: 'make an impact',
      sub:    'Front End Developer specialising in Angular & Laravel — crafting fast, accessible, and beautiful web applications from the UK.',
      cta1:   'See my work',
      cta2:   'Get in touch',
    },
    about: {
      eyebrow: 'About Me',
      heading: 'My background',
      p1: "I'm a creative, independent developer with a strong focus on building impactful digital experiences — combining clean code with thoughtful UI.",
      p2: 'Specialising in Angular & Laravel, I turn complex problems into fast, accessible, production-ready web apps — from component architecture to CI/CD deployment.',
      p3: 'My journey started with UI design, then evolved into full-stack development. I care deeply about performance, accessibility, and the small details that make a product feel right.',
      cta: 'See my work',
      skillsTitle: 'Skills & Expertise',
      groups: [
        { label: 'Frontend', tags: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS'] },
        { label: 'Backend',  tags: ['Laravel', 'PHP', 'Firebase', 'MySQL'] },
        { label: 'Design',   tags: ['Figma', 'UI/UX', 'Responsive'] },
        { label: 'Tools',    tags: ['Git', 'GitHub Actions', 'Docker', 'Linux'] },
      ],
    },
    work:    { eyebrow: 'Portfolio', heading: 'Selected Work', all: 'All', empty: 'No case studies yet.' },
    contact: {
      eyebrow: 'Get in touch',
      h1:      "Let's build",
      accent:  'something great',
      sub:     'Open to freelance, full-time opportunities, or just a good conversation. My inbox is always open.',
      copy:    'copy', copied: 'Copied!',
      sendEmail: 'Send email ↗', linkedin: 'LinkedIn ↗', github: 'GitHub ↗',
    },
    footer: { text: '© 2026 Hasan Ali · Built with Angular & Tailwind' },
    card:   { eyebrow: 'Case Study', cta: 'View case study' },
  },

  fr: {
    nav: { about: 'À propos', work: 'Projets', contact: 'Contact', resume: 'CV' },
    hero: {
      badge:  'Disponible pour travailler',
      h1:     'Créer des expériences',
      h2:     'numériques qui',
      accent: 'font la différence',
      sub:    'Développeur Front End spécialisé en Angular & Laravel — créant des applications web rapides, accessibles et soignées depuis le Royaume-Uni.',
      cta1:   'Voir mes projets',
      cta2:   'Me contacter',
    },
    about: {
      eyebrow: 'À propos de moi',
      heading: 'Mon parcours',
      p1: "Je suis un développeur créatif et indépendant, axé sur la création d'expériences numériques impactantes — alliant code propre et interface réfléchie.",
      p2: "Spécialisé en Angular & Laravel, je transforme des problèmes complexes en applications web rapides, accessibles et prêtes pour la production.",
      p3: "Mon parcours a débuté par le design UI, puis a évolué vers le développement full-stack. Je me soucie profondément des performances, de l'accessibilité et des petits détails qui donnent vie à un produit.",
      cta: 'Voir mes projets',
      skillsTitle: 'Compétences',
      groups: [
        { label: 'Frontend', tags: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS'] },
        { label: 'Backend',  tags: ['Laravel', 'PHP', 'Firebase', 'MySQL'] },
        { label: 'Design',   tags: ['Figma', 'UI/UX', 'Responsive'] },
        { label: 'Outils',   tags: ['Git', 'GitHub Actions', 'Docker', 'Linux'] },
      ],
    },
    work:    { eyebrow: 'Portfolio', heading: 'Projets sélectionnés', all: 'Tous', empty: 'Aucun projet pour le moment.' },
    contact: {
      eyebrow: 'Contactez-moi',
      h1:      'Construisons',
      accent:  'quelque chose de grand',
      sub:     'Ouvert aux missions freelance, aux opportunités à temps plein, ou simplement à une bonne conversation. Ma boîte mail est toujours ouverte.',
      copy:    'copier', copied: 'Copié !',
      sendEmail: 'Envoyer un email ↗', linkedin: 'LinkedIn ↗', github: 'GitHub ↗',
    },
    footer: { text: '© 2026 Hasan Ali · Développé avec Angular & Tailwind' },
    card:   { eyebrow: 'Étude de cas', cta: 'Voir le projet' },
  },

  es: {
    nav: { about: 'Sobre mí', work: 'Proyectos', contact: 'Contacto', resume: 'CV' },
    hero: {
      badge:  'Disponible para trabajar',
      h1:     'Creando experiencias',
      h2:     'digitales que',
      accent: 'generan impacto',
      sub:    'Desarrollador Front End especializado en Angular & Laravel — creando aplicaciones web rápidas, accesibles y hermosas desde el Reino Unido.',
      cta1:   'Ver mis proyectos',
      cta2:   'Contactarme',
    },
    about: {
      eyebrow: 'Sobre mí',
      heading: 'Mi trayectoria',
      p1: "Soy un desarrollador creativo e independiente centrado en crear experiencias digitales de impacto — combinando código limpio con una interfaz cuidada.",
      p2: "Especializado en Angular & Laravel, convierto problemas complejos en aplicaciones web rápidas, accesibles y listas para producción.",
      p3: "Mi trayectoria comenzó en el diseño UI y evolucionó hacia el desarrollo full-stack. Me preocupo profundamente por el rendimiento, la accesibilidad y los pequeños detalles que hacen que un producto se sienta bien.",
      cta: 'Ver mis proyectos',
      skillsTitle: 'Habilidades',
      groups: [
        { label: 'Frontend',   tags: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS'] },
        { label: 'Backend',    tags: ['Laravel', 'PHP', 'Firebase', 'MySQL'] },
        { label: 'Diseño',     tags: ['Figma', 'UI/UX', 'Responsive'] },
        { label: 'Herramientas', tags: ['Git', 'GitHub Actions', 'Docker', 'Linux'] },
      ],
    },
    work:    { eyebrow: 'Portfolio', heading: 'Proyectos seleccionados', all: 'Todos', empty: 'Aún no hay proyectos.' },
    contact: {
      eyebrow: 'Contáctame',
      h1:      'Construyamos',
      accent:  'algo increíble',
      sub:     'Abierto a proyectos freelance, oportunidades a tiempo completo o simplemente una buena conversación. Mi bandeja de entrada siempre está abierta.',
      copy:    'copiar', copied: '¡Copiado!',
      sendEmail: 'Enviar email ↗', linkedin: 'LinkedIn ↗', github: 'GitHub ↗',
    },
    footer: { text: '© 2026 Hasan Ali · Desarrollado con Angular & Tailwind' },
    card:   { eyebrow: 'Caso de estudio', cta: 'Ver proyecto' },
  },
};
