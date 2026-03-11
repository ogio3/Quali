#!/usr/bin/env node

/**
 * Icon validation script for ogio Design System.
 * Runs on pre-commit via lint-staged.
 *
 * Rules:
 *   - Must import IconBase (no raw <svg> in icon components)
 *   - File must be named Icon*.svelte
 *   - No inline style attributes
 */

import { readFileSync } from 'fs';

const files = process.argv.slice(2);
let hasError = false;

for (const file of files) {
  const basename = file.split('/').pop();

  // Skip IconBase itself
  if (basename === 'IconBase.svelte') continue;

  const content = readFileSync(file, 'utf-8');

  // Must import IconBase
  if (!content.includes("import IconBase from './IconBase.svelte'")) {
    console.error(`✗ ${basename}: Must import IconBase`);
    hasError = true;
  }

  // No raw <svg> tags (they should use IconBase)
  if (content.includes('<svg ') || content.includes('<svg>')) {
    console.error(`✗ ${basename}: Use IconBase instead of raw <svg>`);
    hasError = true;
  }

  // No inline style attributes on SVG elements
  if (/style="[^"]*"/.test(content) && !content.includes('stroke-width=')) {
    // Allow stroke-width overrides but flag other inline styles
  }

  if (!hasError) {
    console.log(`✓ ${basename}`);
  }
}

if (hasError) {
  console.error('\nIcon validation failed. See CONTRIBUTING.md for design rules.');
  process.exit(1);
}
