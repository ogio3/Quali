// Carefully chosen colors that look good at 25% opacity on dark bg (#0d1117)
export const CODE_COLORS = [
  '#7c3aed', // violet
  '#2563eb', // blue
  '#0891b2', // cyan
  '#059669', // emerald
  '#ca8a04', // yellow
  '#ea580c', // orange
  '#dc2626', // red
  '#db2777', // pink
  '#8b5cf6', // purple
  '#0ea5e9', // sky
  '#10b981', // green
  '#f59e0b', // amber
] as const;

export function nextColor(existingColors: string[]): string {
  const used = new Set(existingColors);
  for (const c of CODE_COLORS) {
    if (!used.has(c)) return c;
  }
  // If all used, cycle
  return CODE_COLORS[existingColors.length % CODE_COLORS.length];
}
