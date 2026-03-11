// Curated palette inspired by Ukiyo-e prints and natural pigments.
// Each color is chosen to be distinguishable at 25% opacity on #0d1117,
// pleasant when many overlap, and non-fatiguing during hours of use.
export const CODE_COLORS = [
  '#c4a265', // kitsune — warm gold (fox fur)
  '#7b9fba', // sora — soft sky blue
  '#b86e5a', // akane — terracotta red
  '#7aab8e', // matcha — muted green tea
  '#a07cbb', // fuji — wisteria purple
  '#cb8a6e', // kohaku — amber
  '#6a9dab', // asagi — pale indigo-teal
  '#c47d93', // sakura — dusty rose
  '#8a9e6b', // wakaba — young leaf
  '#b5a047', // karashi — mustard
  '#7e8cc4', // ruri — lapis lazuli
  '#ab7f6b', // tsuchi — earth
  '#6ba5a5', // seiji — celadon
  '#c47070', // beni — crimson
  '#9b8fad', // sumire — violet
  '#8fb87f', // nae — seedling
] as const;

export function nextColor(existingColors: string[]): string {
  const used = new Set(existingColors);
  for (const c of CODE_COLORS) {
    if (!used.has(c)) return c;
  }
  return CODE_COLORS[existingColors.length % CODE_COLORS.length];
}
