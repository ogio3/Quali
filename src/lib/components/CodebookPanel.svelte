<script lang="ts">
  import { ui, selection, showToast, dataTrust, markBackedUp } from '$lib/state.svelte';
  import { createCode, updateCode, deleteCode, mergeCodes, db, listSegmentsByProject, listMemosByProject, type Code, type Segment, type Document } from '$lib/db';
  import { nextColor, CODE_COLORS } from '$lib/colors';
  import { register } from '$lib/keyboard';
  import { exportSegmentsCsv, exportCodebookJson, exportProjectJson, downloadFile } from '$lib/export';
  import { exportProjectQdpx, exportCodebookQdc, downloadQdpx, downloadQdc } from '$lib/refi-qda';
  import { importProjectJson } from '$lib/import';
  import { IconX, IconDownload, IconUpload, IconMerge } from './icons';

  let { codes, segments, documents, onchange }: {
    codes: Code[];
    segments: Segment[];
    documents: Document[];
    onchange: () => void;
  } = $props();

  let newCodeName = $state('');
  let editingId = $state<string | null>(null);
  let editingName = $state('');
  let mergeSourceId = $state<string | null>(null);

  let needsBackup = $derived(
    dataTrust.changesSinceBackup > 10 ||
    (dataTrust.changesSinceBackup > 0 && Date.now() - dataTrust.lastBackupTime > 2 * 60 * 60 * 1000)
  );

  // Register number key shortcuts for code assignment
  $effect(() => {
    const unregisters: (() => void)[] = [];
    for (const code of codes) {
      if (code.shortcut) {
        const codeId = code.id;
        const key = String(code.shortcut);
        unregisters.push(register({
          key,
          description: `Assign code: ${code.name}`,
          handler: () => {
            window.dispatchEvent(new CustomEvent('ql-assign-code', { detail: { codeId } }));
          },
          enabled: () => selection.active
        }));
      }
    }
    return () => unregisters.forEach(fn => fn());
  });

  async function handleCreateCode() {
    const name = newCodeName.trim();
    if (!name || !ui.activeProjectId) return;
    const color = nextColor(codes.map(c => c.color));
    await createCode(ui.activeProjectId, name, color);
    newCodeName = '';
    onchange();
  }

  async function handleSetShortcut(codeId: string, num: number | null) {
    if (num !== null) {
      const existing = codes.find(c => c.shortcut === num && c.id !== codeId);
      if (existing) {
        await updateCode(existing.id, { shortcut: null });
      }
    }
    await updateCode(codeId, { shortcut: num });
    onchange();
  }

  async function handleDeleteCode(id: string) {
    await deleteCode(id);
    onchange();
    showToast('Code deleted', 'info');
  }

  function startEditing(code: Code) {
    editingId = code.id;
    editingName = code.name;
  }

  async function finishEditing() {
    if (editingId && editingName.trim()) {
      await updateCode(editingId, { name: editingName.trim() });
      onchange();
    }
    editingId = null;
  }

  function segmentCount(codeId: string): number {
    return segments.filter(s => s.codeId === codeId).length;
  }

  async function handleMerge(targetId: string) {
    if (!mergeSourceId) return;
    const count = await mergeCodes(mergeSourceId, targetId);
    mergeSourceId = null;
    onchange();
    showToast(`Merged ${count} segment${count !== 1 ? 's' : ''}`, 'success');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && mergeSourceId) {
      mergeSourceId = null;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<aside class="panel" aria-label="Codebook">
  <div class="panel-header">
    <span class="panel-label">Codebook</span>
    <span class="panel-count">{codes.length}</span>
  </div>

  <form class="new-code-form" onsubmit={(e) => { e.preventDefault(); handleCreateCode(); }}>
    <input
      bind:value={newCodeName}
      placeholder="New code"
    />
  </form>

  <div class="code-list">
    {#each codes as code}
      <div class="code-item" class:merge-source={mergeSourceId === code.id}>
        <span class="code-swatch" style="background:{code.color}"></span>

        {#if mergeSourceId && mergeSourceId !== code.id}
          <button class="code-name merge-target" onclick={() => handleMerge(code.id)}>
            {code.name}
            <span class="merge-hint">merge here</span>
          </button>
        {:else if editingId === code.id}
          <input
            class="code-edit-input"
            bind:value={editingName}
            onblur={finishEditing}
            onkeydown={(e) => { if (e.key === 'Enter') finishEditing(); }}
            autofocus
          />
        {:else}
          <button
            class="code-name"
            onclick={() => { ui.filterCodeId = code.id; ui.panel = 'segments'; }}
            ondblclick={(e) => { e.stopPropagation(); startEditing(code); }}
          >
            {code.name}
          </button>
        {/if}

        <span class="seg-count">{segmentCount(code.id) || ''}</span>

        {#if !mergeSourceId}
          <select
            class="shortcut-select"
            value={code.shortcut ?? ''}
            onchange={(e) => {
              const val = (e.target as HTMLSelectElement).value;
              handleSetShortcut(code.id, val ? Number(val) : null);
            }}
          >
            <option value="">—</option>
            {#each [1,2,3,4,5,6,7,8,9] as n}
              <option value={n}>{n}</option>
            {/each}
          </select>

          <button
            class="merge-btn"
            onclick={() => { mergeSourceId = code.id; }}
            title="Merge into another code"
          >
            <IconMerge />
          </button>

          <button
            class="delete-btn"
            onclick={() => handleDeleteCode(code.id)}
            title="Delete code"
          >
            <IconX />
          </button>
        {:else if mergeSourceId === code.id}
          <button
            class="cancel-merge-btn"
            onclick={() => { mergeSourceId = null; }}
            title="Cancel merge"
          >
            <IconX />
          </button>
        {/if}
      </div>
    {/each}
  </div>

  <div class="panel-footer">
    <button class="action-btn" onclick={() => {
      const csv = exportSegmentsCsv(segments, documents, codes);
      downloadFile(csv, 'segments.csv', 'text/csv');
      showToast('Exported CSV', 'success');
    }}>
      <IconDownload />
      Export CSV
    </button>
    <button class="action-btn" class:needs-backup={needsBackup} onclick={async () => {
      if (!ui.activeProjectId) return;
      const project = await db.projects.get(ui.activeProjectId);
      if (!project) return;
      const allSegments = await listSegmentsByProject(ui.activeProjectId);
      const allMemos = await listMemosByProject(ui.activeProjectId);
      const json = exportProjectJson(project, documents, codes, allSegments, allMemos);
      downloadFile(json, `${project.name}.ogio-quali.json`, 'application/json');
      markBackedUp();
      showToast('Project exported', 'success');
    }}>
      <IconDownload />
      Backup Project
    </button>
    <button class="action-btn" onclick={async () => {
      if (!ui.activeProjectId) return;
      const project = await db.projects.get(ui.activeProjectId);
      if (!project) return;
      const allSegments = await listSegmentsByProject(ui.activeProjectId);
      const qdpx = exportProjectQdpx(project, documents, codes, allSegments);
      downloadQdpx(qdpx, project.name);
      showToast('Exported REFI-QDA (.qdpx)', 'success');
    }}>
      <IconDownload />
      Export REFI-QDA
    </button>
    <label class="action-btn import-label">
      <IconUpload />
      Restore Project
      <input type="file" accept=".json" class="hidden-input" onchange={async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        try {
          const json = await file.text();
          const projectId = await importProjectJson(json);
          ui.activeProjectId = projectId;
          ui.activeDocumentId = null;
          showToast('Project imported', 'success');
          onchange();
        } catch {
          showToast('Invalid backup file', 'error');
        }
      }} />
    </label>
  </div>
</aside>

<style>
  .panel {
    background: var(--theme-bg-elevated);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4) var(--space-4) var(--space-1);
  }

  .panel-label {
    font-size: var(--ui-font-xs);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--theme-text-muted);
  }

  .panel-count {
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    background: var(--theme-bg);
    border-radius: var(--radius-full);
    padding: 1px var(--space-2);
    line-height: 1.4;
  }

  .new-code-form {
    padding: var(--space-3) var(--space-3);
  }

  .new-code-form input {
    width: 100%;
  }

  .code-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 var(--space-1);
  }

  .code-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    margin: 1px 0;
    min-height: var(--target-min);
    transition: background var(--duration-fast) var(--ease-out);
  }

  .code-item:hover {
    background: var(--theme-bg-hover);
  }

  .code-swatch {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 5px currentColor;
  }

  .code-name {
    flex: 1;
    font-size: var(--ui-font-sm);
    text-align: left;
    padding: var(--space-1) 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--theme-text-secondary);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .code-item:hover .code-name {
    color: var(--theme-text);
  }

  .code-edit-input {
    flex: 1;
    font-size: var(--ui-font-sm);
    padding: var(--space-1) var(--space-2);
    min-width: 0;
    background: var(--theme-bg);
  }

  .seg-count {
    font-family: var(--font-mono);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    min-width: 1rem;
    text-align: right;
  }

  .shortcut-select {
    font-family: var(--font-mono);
    font-size: var(--ui-font-xs);
    background: var(--theme-bg);
    color: var(--theme-text-faint);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-sm);
    padding: 1px var(--space-1);
    width: calc(var(--ui-font-xs) * 3);
    cursor: pointer;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .shortcut-select:hover {
    border-color: var(--theme-text-faint);
  }

  .merge-btn {
    opacity: 0;
    color: var(--theme-text-faint);
    padding: var(--space-1);
    transition: all var(--duration-fast) var(--ease-out);
    flex-shrink: 0;
  }

  .code-item:hover .merge-btn {
    opacity: 1;
  }

  .merge-btn:hover {
    color: var(--theme-text-secondary);
  }

  .delete-btn {
    opacity: 0;
    color: var(--theme-text-faint);
    padding: var(--space-1);
    transition: all var(--duration-fast) var(--ease-out);
    flex-shrink: 0;
  }

  .code-item:hover .delete-btn {
    opacity: 1;
  }

  .delete-btn:hover {
    color: var(--theme-danger);
  }

  .merge-source {
    background: var(--theme-bg-hover);
    outline: 1px solid var(--theme-border);
    border-radius: var(--radius-sm);
  }

  .merge-target {
    cursor: pointer;
  }

  .merge-hint {
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    margin-left: var(--space-2);
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  .code-item:hover .merge-hint {
    opacity: 1;
  }

  .cancel-merge-btn {
    color: var(--theme-text-faint);
    padding: var(--space-1);
    transition: all var(--duration-fast) var(--ease-out);
    flex-shrink: 0;
  }

  .cancel-merge-btn:hover {
    color: var(--theme-danger);
  }

  .panel-footer {
    border-top: 1px solid var(--theme-border);
    padding: var(--space-3);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-2);
    font-size: var(--ui-font-xs);
    font-weight: var(--font-weight-normal);
    color: var(--theme-text-muted);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-sm);
    min-height: var(--target-min);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .action-btn:hover {
    background: var(--theme-bg-hover);
    color: var(--theme-text-secondary);
    border-color: var(--theme-text-faint);
  }

  .action-btn.needs-backup {
    border-color: var(--theme-warning, #e8a838);
    color: var(--theme-warning, #e8a838);
    animation: pulse-border 2s ease-in-out infinite;
  }

  @keyframes pulse-border {
    0%, 100% { border-color: var(--theme-warning, #e8a838); }
    50% { border-color: var(--theme-border); }
  }

  .import-label {
    display: flex;
    text-align: center;
    cursor: pointer;
  }

  .hidden-input {
    display: none;
  }
</style>
