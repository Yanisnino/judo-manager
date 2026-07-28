/**
 * prepare-standalone.js
 * Copies the Next.js standalone build + static assets
 * into "electron-app-bundle" folder so electron-builder
 * can embed it as a resource inside the .exe installer.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STANDALONE_SRC = path.join(ROOT, '.next', 'standalone');
const STATIC_SRC     = path.join(ROOT, '.next', 'static');
const PUBLIC_SRC     = path.join(ROOT, 'public');
const BUNDLE_DEST    = path.join(ROOT, 'electron-app-bundle');

// ─── helpers ──────────────────────────────────────────────────────────────────
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠  Source does not exist, skipping: ${src}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ─── main ─────────────────────────────────────────────────────────────────────
console.log('🔨  Preparing standalone bundle for electron-builder...');

// Clean previous bundle
if (fs.existsSync(BUNDLE_DEST)) {
  fs.rmSync(BUNDLE_DEST, { recursive: true, force: true });
}
fs.mkdirSync(BUNDLE_DEST, { recursive: true });

// 1. Copy the standalone server (server.js + node_modules included by Next)
copyDir(STANDALONE_SRC, BUNDLE_DEST);

// 2. Copy built static assets into <bundle>/.next/static
copyDir(STATIC_SRC, path.join(BUNDLE_DEST, '.next', 'static'));

// 3. Copy public folder
copyDir(PUBLIC_SRC, path.join(BUNDLE_DEST, 'public'));

console.log('✅  Bundle ready at:', BUNDLE_DEST);
