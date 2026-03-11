<script lang="ts">
  import { ui, selection, showToast } from '$lib/state.svelte';
  import { createCode, updateCode, deleteCode, db, listSegmentsByProject, type Code, type Segment, type Document } from '$lib/db';
  import { nextColor, CODE_COLORS } from '$lib/colors';
  import { register } from '$lib/keyboard';
  import { exportSegmentsCsv, exportCodebookJson, exportProjectJson, downloadFile } from '$lib/export';
  import { importProjectJson } from '$lib/import';

  let { codes, segments, documents, onchange }: {
    codes: Code[];
    segments: Segment[];
    documents: Document[];
    onchange: () => void;
  } = $props();

  let newCodeName = $state('');
  let editingId = $state<string | null>(null);
  let editingName = $state('');

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
            // Dispatch custom event that DocumentPane listens to
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
    // Clear existing shortcut with same number
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
</script>

<aside class="panel">
  <div class="panel-header">
    <span class="panel-title">Codebook</span>
    <span class="code-count">{codes.length}</span>
  </div>

  <form class="new-code-form" onsubmit={(e) => { e.preventDefault(); handleCreateCode(); }}>
    <input
      bind:value={newCodeName}
      placeholder="New code name"
    />
  </form>

  <div class="code-list">
    {#each codes as code}
      <div class="code-item">
        <span class="code-dot" style="background:{code.color}"></span>

        {#if editingId === code.id}
          <input
            class="code-edit-input"
            bind:value={editingName}
            onblur={finishEditing}
            onkeydown={(e) => { if (e.key === 'Enter') finishEditing(); }}
            autofocus
          />
        {:else}
          <button class="code-name" ondblclick={() => startEditing(code)}>
            {code.name}
          </button>
        {/if}

        <span class="seg-count">{segmentCount(code.id)}</span>

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
          class="delete-btn"
          onclick={() => handleDeleteCode(code.id)}
          title="Delete code"
        >&times;</button>
      </div>
    {/each}
  </div>

  <div class="panel-footer">
    <button class="export-btn" onclick={() => {
      const csv = exportSegmentsCsv(segments, documents, codes);
      downloadFile(csv, 'segments.csv', 'text/csv');
      showToast('Exported CSV', 'success');
    }}>Export CSV</button>
    <button class="export-btn" onclick={async () => {
      if (!ui.activeProjectId) return;
      const project = await db.projects.get(ui.activeProjectId);
      if (!project) return;
      const allSegments = await listSegmentsByProject(ui.activeProjectId);
      const json = exportProjectJson(project, documents, codes, allSegments);
      downloadFile(json, `${project.name}.quali-lite.json`, 'application/json');
      showToast('Project exported', 'success');
    }}>Export Project</button>
    <label class="export-btn import-label">
      Import Project
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
    background: var(--bg-elevated);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px 4px;
  }
  .panel-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }
  .code-count {
    font-size: 11px;
    color: var(--text-faint);
    background: var(--bg);
    border-radius: 10px;
    padding: 0 6px;
    line-height: 18px;
  }
  .new-code-form {
    padding: 8px 12px;
  }
  .new-code-form input {
    width: 100%;
  }
  .code-list {
    flex: 1;
    overflow-y: auto;
  }
  .code-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 12px;
    transition: background var(--transition);
  }
  .code-item:hover {
    background: var(--bg-hover);
  }
  .code-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .code-name {
    flex: 1;
    font-size: 13px;
    text-align: left;
    padding: 2px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .code-edit-input {
    flex: 1;
    font-size: 13px;
    padding: 2px 4px;
    min-width: 0;
  }
  .seg-count {
    font-size: 11px;
    color: var(--text-faint);
    min-width: 18px;
    text-align: center;
  }
  .shortcut-select {
    font-size: 11px;
    background: var(--bg);
    color: var(--text-muted);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 1px 2px;
    width: 32px;
  }
  .delete-btn {
    opacity: 0;
    color: var(--text-faint);
    font-size: 16px;
    padding: 0 2px;
    transition: opacity var(--transition);
  }
  .code-item:hover .delete-btn {
    opacity: 1;
  }
  .delete-btn:hover {
    color: var(--danger);
  }
  .panel-footer {
    border-top: 1px solid var(--border);
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .export-btn {
    width: 100%;
    padding: 6px;
    font-size: 12px;
    color: var(--text-muted);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    transition: all var(--transition);
  }
  .export-btn:hover {
    background: var(--bg-hover);
    color: var(--text);
  }
  .import-label {
    display: block;
    text-align: center;
    cursor: pointer;
  }
  .hidden-input {
    display: none;
  }
</style>
