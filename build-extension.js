import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Files to copy to dist from dev folder
const files = [
  ['dev/manifest.json', 'manifest.json'],
  ['dev/icons/icon16.png', 'icons/icon16.png'],
  ['dev/icons/icon48.png', 'icons/icon48.png'],
  ['dev/icons/icon128.png', 'icons/icon128.png'],
  ['dev/background.js', 'background.js']
];

// Create dist directory if it doesn't exist
if (!existsSync('dist')) {
  mkdirSync('dist');
}

// Create icons directory in dist
if (!existsSync('dist/icons')) {
  mkdirSync('dist/icons');
}

// Copy each file to dist
files.forEach(([src, dest]) => {
  const sourcePath = resolve(__dirname, src);
  const targetPath = resolve(__dirname, 'dist', dest);
  
  try {
    copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${src} to dist/${dest}`);
  } catch (error) {
    console.error(`Error copying ${src}:`, error);
  }
});

console.log('Extension build complete!');