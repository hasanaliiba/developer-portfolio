// src/app/core/data/skill-icons.ts
// Single source of truth for all skill → devicon icon mappings.
// `darkInvert: true` means apply `invert + brightness boost` in dark mode
// (needed for black-on-transparent icons that would disappear on dark backgrounds).

const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

export interface SkillIconDef {
  url: string;
  darkInvert?: true;
}

export const SKILL_ICONS: Record<string, SkillIconDef> = {
  // ── Frontend ──────────────────────────────────────────────────
  'Angular':          { url: `${DI}/angular/angular-original.svg` },
  'React':            { url: `${DI}/react/react-original.svg` },
  'Vue':              { url: `${DI}/vuejs/vuejs-original.svg` },
  'Next.js':          { url: `${DI}/nextjs/nextjs-original.svg`, darkInvert: true },
  'Nuxt':             { url: `${DI}/nuxtjs/nuxtjs-original.svg` },
  'Svelte':           { url: `${DI}/svelte/svelte-original.svg` },
  'TypeScript':       { url: `${DI}/typescript/typescript-original.svg` },
  'JavaScript':       { url: `${DI}/javascript/javascript-original.svg` },
  'HTML':             { url: `${DI}/html5/html5-original.svg` },
  'CSS':              { url: `${DI}/css3/css3-original.svg` },
  'Tailwind CSS':     { url: `${DI}/tailwindcss/tailwindcss-original.svg` },
  'Bootstrap':        { url: `${DI}/bootstrap/bootstrap-original.svg` },
  'Sass':             { url: `${DI}/sass/sass-original.svg` },
  'RxJS':             { url: `${DI}/rxjs/rxjs-original.svg` },
  'Redux':            { url: `${DI}/redux/redux-original.svg` },
  'GraphQL':          { url: `${DI}/graphql/graphql-plain.svg` },
  'jQuery':           { url: `${DI}/jquery/jquery-original.svg` },
  'Responsive':       { url: `${DI}/css3/css3-original.svg` },

  // ── Backend ───────────────────────────────────────────────────
  'Laravel':          { url: `${DI}/laravel/laravel-original.svg` },
  'PHP':              { url: `${DI}/php/php-original.svg` },
  'Node.js':          { url: `${DI}/nodejs/nodejs-original.svg` },
  'Express':          { url: `${DI}/express/express-original.svg`, darkInvert: true },
  'NestJS':           { url: `${DI}/nestjs/nestjs-original.svg` },
  'Django':           { url: `${DI}/django/django-plain.svg` },
  'FastAPI':          { url: `${DI}/fastapi/fastapi-original.svg` },
  'Ruby on Rails':    { url: `${DI}/rails/rails-original-wordmark.svg` },
  'Spring Boot':      { url: `${DI}/spring/spring-original.svg` },
  'Go':               { url: `${DI}/go/go-original.svg` },
  'Rust':             { url: `${DI}/rust/rust-original.svg` },
  'Python':           { url: `${DI}/python/python-original.svg` },
  'Java':             { url: `${DI}/java/java-original.svg` },
  'C#':               { url: `${DI}/csharp/csharp-original.svg` },
  '.NET':             { url: `${DI}/dotnetcore/dotnetcore-original.svg` },

  // ── Databases ─────────────────────────────────────────────────
  'MySQL':            { url: `${DI}/mysql/mysql-original.svg` },
  'PostgreSQL':       { url: `${DI}/postgresql/postgresql-original.svg` },
  'MongoDB':          { url: `${DI}/mongodb/mongodb-original.svg` },
  'Redis':            { url: `${DI}/redis/redis-original.svg` },
  'SQLite':           { url: `${DI}/sqlite/sqlite-original.svg` },
  'Firebase':         { url: `${DI}/firebase/firebase-plain.svg` },
  'Supabase':         { url: `${DI}/supabase/supabase-original.svg` },
  'Elasticsearch':    { url: `${DI}/elasticsearch/elasticsearch-original.svg` },

  // ── DevOps & Cloud ────────────────────────────────────────────
  'Docker':           { url: `${DI}/docker/docker-original.svg` },
  'Kubernetes':       { url: `${DI}/kubernetes/kubernetes-original.svg` },
  'AWS':              { url: `${DI}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
  'Google Cloud':     { url: `${DI}/googlecloud/googlecloud-original.svg` },
  'Azure':            { url: `${DI}/azure/azure-original.svg` },
  'GitHub Actions':   { url: `${DI}/github/github-original.svg`, darkInvert: true },
  'GitLab CI':        { url: `${DI}/gitlab/gitlab-original.svg` },
  'Nginx':            { url: `${DI}/nginx/nginx-original.svg` },
  'Linux':            { url: `${DI}/linux/linux-original.svg`, darkInvert: true },
  'Ubuntu':           { url: `${DI}/ubuntu/ubuntu-original.svg` },
  'Vercel':           { url: `${DI}/vercel/vercel-original.svg`, darkInvert: true },
  'Netlify':          { url: `${DI}/netlify/netlify-original.svg` },
  'Heroku':           { url: `${DI}/heroku/heroku-original.svg` },
  'Terraform':        { url: `${DI}/terraform/terraform-original.svg` },

  // ── Tools & Design ────────────────────────────────────────────
  'Git':              { url: `${DI}/git/git-original.svg` },
  'GitHub':           { url: `${DI}/github/github-original.svg`, darkInvert: true },
  'GitLab':           { url: `${DI}/gitlab/gitlab-original.svg` },
  'Figma':            { url: `${DI}/figma/figma-original.svg` },
  'Jira':             { url: `${DI}/jira/jira-original.svg` },
  'Webpack':          { url: `${DI}/webpack/webpack-original.svg` },
  'Vite':             { url: `${DI}/vitejs/vitejs-original.svg` },
  'Jest':             { url: `${DI}/jest/jest-plain.svg` },
  'Cypress':          { url: `${DI}/cypressio/cypressio-original.svg`, darkInvert: true },
  'Storybook':        { url: `${DI}/storybook/storybook-original.svg` },
  'Postman':          { url: `${DI}/postman/postman-original.svg` },
  'VS Code':          { url: `${DI}/vscode/vscode-original.svg` },
};

/** Returns icon metadata for a skill name, or null if unmapped. */
export function getSkillIcon(name: string): { url: string; darkInvert: boolean } | null {
  const def = SKILL_ICONS[name];
  return def ? { url: def.url, darkInvert: !!def.darkInvert } : null;
}

/** All known skill names, sorted alphabetically. */
export const KNOWN_SKILLS = Object.keys(SKILL_ICONS).sort();
