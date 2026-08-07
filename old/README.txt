OLD — previous versions of the site
====================================

Nothing in this folder is loaded by the live site. It is kept only as a
reference / rollback point.

  index.html          the very first version (dark neon theme)
  style.css            its stylesheet
  script.js            its scripts
  *-preview.png         screenshots of that design

  index-static.html    the warm-paper redesign, as plain static HTML —
                        this was "the current site" before the React port
  logo-legacy.png       the old neon logo.png, before the warm-paper recolor
  favicon-legacy.ico    the old neon favicon.ico, before the warm-paper recolor

The current site is a Vite + React (TypeScript) app, deployed to
Cloudflare Pages:

  index.html            Vite entry — head/meta/fonts + <div id="root">
  src/main.tsx           mounts <App/>
  src/App.tsx             the full page markup as JSX
  src/lib/scene.js, motion.js, main.js
                        the original vanilla animation scripts, unmodified
                        except scene.js now imports three.js as a module
                        instead of relying on a CDN <script> global
  public/assets/css/…    same base.css / sections.css / motion.css as before,
                        loaded via plain <link> tags — untouched
  public/*.jpg,*.png     the project photos, favicon.ico, logo.png

  npm run dev      — local dev server
  npm run build    — outputs dist/ (Cloudflare Pages build command)
