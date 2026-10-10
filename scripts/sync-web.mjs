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
  .replace('</head>', '<link rel="stylesheet" href="app/app-shell.css">\n</head>')
  .replace('<script src="assets/config.js"></script>',
           '<script src="app/app-config.js"></script>\n<script src="assets/config.js"></script>\n<script src="app/app-shell.js"></script>');
// The website's offline service worker is not needed inside the app.
html = html.replace(/<script>if \('serviceWorker'[^<]*<\/script>\n?/, '');
if (!html.includes('app/app-shell.js')) { console.error('Could not inject the app shell into index.html'); process.exit(1); }
writeFileSync(`${OUT}/index.html`, html);
console.log('www/ ready');
