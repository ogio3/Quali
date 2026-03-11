export const ui = $state({
  activeProjectId: null as string | null,
  activeDocumentId: null as string | null,
  activeCodeId: null as string | null,
  panel: 'codebook' as 'codebook' | 'segments' | 'memos',
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

export const dataTrust = $state({
  lastBackupTime: 0,
  changesSinceBackup: 0
});

export function trackChange() {
  dataTrust.changesSinceBackup++;
}

export function markBackedUp() {
  dataTrust.lastBackupTime = Date.now();
  dataTrust.changesSinceBackup = 0;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
  clearTimeout(toastTimer);
  ui.toast = { message, type };
  toastTimer = setTimeout(() => {
    ui.toast = null;
  }, 3000);
}
