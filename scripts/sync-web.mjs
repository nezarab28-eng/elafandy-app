// Copies the website from ./catalog into ./www and adds the app shell.
// To update the app: replace ./catalog with the new website folder, then run `npm run sync`.
import { cpSync, rmSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

const SRC = 'catalog', OUT = 'www';
if (!existsSync(`${SRC}/index.html`)) { console.error(`Missing ${SRC}/index.html — copy the website folder into ./${SRC}`); process.exit(1); }

rmSync(OUT, { recursive: true, force: true });
for (const d of ['index.html', 'assets', 'data', 'images', 'bundles']) {
  if (existsSync(`${SRC}/${d}`)) cpSync(`${SRC}/${d}`, `${OUT}/${d}`, { recursive: true });
}
cpSync('shell', `${OUT}/app`, { recursive: true });

let html = readFileSync(`${OUT}/index.html`, 'utf8');
html = html
  .replace('</head>', '<link rel="stylesheet" href="app/app-shell.css">\n<link rel="stylesheet" href="app/skin-tech.css">\n</head>')
  .replace('<script src="data/products.js"></script>', '<script src="data/products.js"></script>\n<script src="app/live-data.js"></script>')
  .replace('<script src="assets/app.js"></script>', '<script src="assets/app.js"></script>\n<script src="app/skin-tech.js"></script>')
  .replace('<script src="assets/config.js"></script>',
           '<script src="app/app-config.js"></script>\n<script src="assets/config.js"></script>\n<script src="app/app-shell.js"></script>');
// The website's offline service worker is not needed inside the app.
html = html.replace(/<script>if \('serviceWorker'[^<]*<\/script>\n?/, '');
if (!html.includes('app/app-shell.js')) { console.error('Could not inject the app shell into index.html'); process.exit(1); }
writeFileSync(`${OUT}/index.html`, html);

// Product images: let the app load them from the website when online (see shell/live-data.js).
const appJs = `${OUT}/assets/app.js`;
const js = readFileSync(appJs, 'utf8');
const IMG = "'images/' + id + '.webp'";
if (!js.includes(IMG)) { console.error('Could not find the image path in assets/app.js'); process.exit(1); }
writeFileSync(appJs, js.replace(IMG, "(window.IMG_BASE || '') + " + IMG));
console.log('www/ ready');
