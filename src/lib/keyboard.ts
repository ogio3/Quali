type Modifier = 'ctrl' | 'meta' | 'shift' | 'alt';

interface Shortcut {
  key: string;
  modifiers?: Modifier[];
  description: string;
  handler: (e: KeyboardEvent) => void;
  enabled: () => boolean;
}

const registry: Shortcut[] = [];

export function register(shortcut: Shortcut): () => void {
  registry.push(shortcut);
  return () => {
    const idx = registry.indexOf(shortcut);
    if (idx >= 0) registry.splice(idx, 1);
  };
}

function matchesModifiers(e: KeyboardEvent, mods?: Modifier[]): boolean {
  const required = new Set(mods ?? []);
  const isMac = navigator.platform.includes('Mac');

  if (required.has('ctrl') || required.has('meta')) {
    if (!(isMac ? e.metaKey : e.ctrlKey)) return false;
  } else {
    if (isMac ? e.metaKey : e.ctrlKey) return false;
  }

  if (required.has('shift') !== e.shiftKey) return false;
  if (required.has('alt') !== e.altKey) return false;

  return true;
}

export function dispatch(e: KeyboardEvent): void {
  // Don't capture when typing in input/textarea
  const tag = (e.target as HTMLElement)?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
    // Only allow Escape in inputs
    if (e.key !== 'Escape') return;
  }

  for (const s of registry) {
    if (!s.enabled()) continue;
    if (e.key === s.key && matchesModifiers(e, s.modifiers)) {
      e.preventDefault();
      s.handler(e);
      return;
    }
  }
}

export function getShortcuts(): Array<{ key: string; modifiers?: Modifier[]; description: string }> {
  return registry.map(s => ({
    key: s.key,
    modifiers: s.modifiers,
    description: s.description
  }));
}
