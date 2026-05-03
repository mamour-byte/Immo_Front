import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

const colorMap = {
  // Text colors
  'text-slate-900': 'text-text-main',
  'text-slate-800': 'text-text-main',
  'text-slate-700': 'text-text-main',
  'text-slate-600': 'text-text-muted',
  'text-slate-500': 'text-text-muted',
  'text-slate-400': 'text-text-muted',
  'text-slate-300': 'text-border',
  'text-rose-500': 'text-primary',
  'text-rose-600': 'text-primary',
  'text-rose-700': 'text-primary-hover',
  'text-rose-800': 'text-primary-dark',
  'text-rose-900': 'text-primary-dark',
  'text-rose-50': 'text-secondary-light',
  'text-rose-100': 'text-secondary',

  // Background colors
  'bg-slate-900': 'bg-primary-dark',
  'bg-slate-800': 'bg-primary-dark',
  'bg-slate-700': 'bg-primary-dark',
  'bg-slate-100': 'bg-surface',
  'bg-slate-50': 'bg-surface',
  'bg-slate-200': 'bg-border',
  'bg-rose-500': 'bg-primary',
  'bg-rose-600': 'bg-primary',
  'bg-rose-700': 'bg-primary-hover',
  'bg-rose-800': 'bg-primary-dark',
  'bg-rose-900': 'bg-primary-dark',
  'bg-rose-50': 'bg-secondary-light',
  'bg-rose-100': 'bg-secondary-light',

  // Border colors
  'border-slate-100': 'border-border',
  'border-slate-200': 'border-border',
  'border-slate-300': 'border-border',
  'border-slate-400': 'border-border',
  'border-slate-500': 'border-text-muted',
  'border-slate-600': 'border-text-muted',
  'border-slate-700': 'border-text-main',
  'border-slate-800': 'border-text-main',
  'border-slate-900': 'border-text-main',
  'border-rose-500': 'border-primary',
  'border-rose-600': 'border-primary',
  'border-rose-700': 'border-primary-hover',
  'border-rose-50': 'border-secondary-light',

  // Ring colors
  'ring-rose-500': 'ring-primary',
  'ring-rose-600': 'ring-primary',
  'ring-slate-100': 'ring-border',
  'ring-slate-200': 'ring-border',
  'ring-slate-300': 'ring-border',
  'ring-slate-900': 'ring-primary-dark',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [oldClass, newClass] of Object.entries(colorMap)) {
    // Replace whole words only to avoid partial matches
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newClass);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.js'))) {
      processFile(fullPath);
    }
  }
}

console.log('Starting color refactoring...');
traverseDirectory(SRC_DIR);
console.log('Done.');
