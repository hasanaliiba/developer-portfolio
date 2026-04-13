// src/app/core/i18n/translations.ts

export type LangCode = 'en' | 'fr' | 'es' | 'ar';

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
  caseStudy: {
    back: string; challenge: string; solution: string; results: string;
    technologies: string; details: string; client: string; industry: string;
    timeline: string; role: string; viewLive: string; related: string;
    notFound: string; notFoundBack: string;
  };
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
    caseStudy: {
      back:         'Back to Work',
      challenge:    'The Challenge',
      solution:     'The Solution',
      results:      'Results & Impact',
      technologies: 'Technologies Used',
      details:      'Project Details',
      client:       'Client',
      industry:     'Industry',
      timeline:     'Timeline',
      role:         'My Role',
      viewLive:     'View Live Project',
      related:      'Related Case Studies',
      notFound:     'Case study not found.',
      notFoundBack: '← Back to Work',
    },
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
    caseStudy: {
      back:         '← Retour aux projets',
      challenge:    'Le Défi',
      solution:     'La Solution',
      results:      'Résultats & Impact',
      technologies: 'Technologies utilisées',
      details:      'Détails du projet',
      client:       'Client',
      industry:     'Secteur',
      timeline:     'Durée',
      role:         'Mon rôle',
      viewLive:     'Voir le projet en ligne ↗',
      related:      'Études de cas associées',
      notFound:     'Étude de cas introuvable.',
      notFoundBack: '← Retour aux projets',
    },
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
    caseStudy: {
      back:         '← Volver a proyectos',
      challenge:    'El Desafío',
      solution:     'La Solución',
      results:      'Resultados e Impacto',
      technologies: 'Tecnologías utilizadas',
      details:      'Detalles del proyecto',
      client:       'Cliente',
      industry:     'Industria',
      timeline:     'Duración',
      role:         'Mi rol',
      viewLive:     'Ver proyecto en vivo ↗',
      related:      'Proyectos relacionados',
      notFound:     'Proyecto no encontrado.',
      notFoundBack: '← Volver a proyectos',
    },
  },

  ar: {
    nav: { about: 'عني', work: 'أعمالي', contact: 'تواصل', resume: 'السيرة الذاتية' },
    hero: {
      badge:  'متاح للعمل',
      h1:     'أبني تجارب',
      h2:     'رقمية',
      accent: 'تصنع الفارق',
      sub:    'مطوّر واجهات أمامية متخصص في Angular و Laravel — أصنع تطبيقات ويب سريعة وسهلة الوصول وجميلة من المملكة المتحدة.',
      cta1:   'اكتشف أعمالي',
      cta2:   'تواصل معي',
    },
    about: {
      eyebrow: 'عني',
      heading: 'خلفيتي',
      p1: 'أنا مطوّر مستقل ومبدع أركّز على بناء تجارب رقمية مؤثرة — أجمع بين الكود النظيف وواجهة المستخدم المدروسة.',
      p2: 'متخصص في Angular و Laravel، أحوّل المشاكل المعقدة إلى تطبيقات ويب سريعة وسهلة الوصول وجاهزة للإنتاج.',
      p3: 'بدأت رحلتي بتصميم واجهات المستخدم، ثم تطورت نحو التطوير الشامل. أهتم بعمق بالأداء وإمكانية الوصول والتفاصيل الصغيرة التي تجعل المنتج مميزًا.',
      cta: 'اكتشف أعمالي',
      skillsTitle: 'المهارات والخبرات',
      groups: [
        { label: 'الواجهة الأمامية', tags: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS'] },
        { label: 'الخلفية',          tags: ['Laravel', 'PHP', 'Firebase', 'MySQL'] },
        { label: 'التصميم',          tags: ['Figma', 'UI/UX', 'Responsive'] },
        { label: 'الأدوات',          tags: ['Git', 'GitHub Actions', 'Docker', 'Linux'] },
      ],
    },
    work:    { eyebrow: 'المعرض', heading: 'أعمال مختارة', all: 'الكل', empty: 'لا توجد دراسات حالة بعد.' },
    contact: {
      eyebrow: 'تواصل معي',
      h1:      'لنبني',
      accent:  'شيئًا رائعًا',
      sub:     'متاح للعمل الحر وفرص العمل الكامل أو مجرد محادثة جيدة. بريدي الإلكتروني مفتوح دائمًا.',
      copy:    'نسخ', copied: 'تم النسخ!',
      sendEmail: 'إرسال بريد ↗', linkedin: 'لينكدإن ↗', github: 'جيتهاب ↗',
    },
    footer: { text: '© 2026 حسن علي · مبني بـ Angular و Tailwind' },
    card:   { eyebrow: 'دراسة حالة', cta: 'عرض دراسة الحالة' },
    caseStudy: {
      back:         '→ العودة إلى الأعمال',
      challenge:    'التحدي',
      solution:     'الحل',
      results:      'النتائج والأثر',
      technologies: 'التقنيات المستخدمة',
      details:      'تفاصيل المشروع',
      client:       'العميل',
      industry:     'القطاع',
      timeline:     'المدة الزمنية',
      role:         'دوري',
      viewLive:     'عرض المشروع المباشر ↗',
      related:      'دراسات حالة ذات صلة',
      notFound:     'دراسة الحالة غير موجودة.',
      notFoundBack: '→ العودة إلى الأعمال',
    },
  },
};
