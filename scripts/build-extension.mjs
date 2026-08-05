import { cpSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist/extension');
const sourceDir = resolve(root, 'extension');

mkdirSync(distDir, { recursive: true });

const filesToCopy = [
  { from: resolve(sourceDir, 'manifest.json'), to: resolve(distDir, 'manifest.json') },
  { from: resolve(sourceDir, 'popup.html'), to: resolve(distDir, 'popup.html') },
  { from: resolve(sourceDir, 'sidepanel.html'), to: resolve(distDir, 'sidepanel.html') },
  { from: resolve(sourceDir, 'fullpage.html'), to: resolve(distDir, 'fullpage.html') },
];

for (const file of filesToCopy) {
  if (existsSync(file.from)) {
    copyFileSync(file.from, file.to);
  }
}

cpSync(resolve(sourceDir, 'icons'), resolve(distDir, 'icons'), { recursive: true });

const nestedHtmlDir = resolve(distDir, 'extension');
if (existsSync(resolve(nestedHtmlDir, 'popup.html'))) {
  copyFileSync(resolve(nestedHtmlDir, 'popup.html'), resolve(distDir, 'popup.html'));
}
if (existsSync(resolve(nestedHtmlDir, 'sidepanel.html'))) {
  copyFileSync(resolve(nestedHtmlDir, 'sidepanel.html'), resolve(distDir, 'sidepanel.html'));
}
if (existsSync(resolve(nestedHtmlDir, 'fullpage.html'))) {
  copyFileSync(resolve(nestedHtmlDir, 'fullpage.html'), resolve(distDir, 'fullpage.html'));
}
