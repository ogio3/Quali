export const ui = $state({
  activeProjectId: null as string | null,
  activeDocumentId: null as string | null,
  activeCodeId: null as string | null,
  panel: 'codebook' as 'codebook' | 'segments',
  filterCodeId: null as string | null,
  commandPaletteOpen: false,
  toast: null as { message: string; type: 'info' | 'success' | 'error' } | null
});

export const selection = $state({
  start: -1,
  end: -1,
  text: '',
  active: false,
  anchorRect: null as DOMRect | null
});

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
  clearTimeout(toastTimer);
  ui.toast = { message, type };
  toastTimer = setTimeout(() => {
    ui.toast = null;
  }, 3000);
}
