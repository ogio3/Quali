<svelte:head>
  <title>ogio Quali</title>
</svelte:head>

<script lang="ts">
  import { ui, selection, showToast, trackChange } from '$lib/state.svelte';
  import { listProjects, listDocuments, listCodes, listSegmentsByDocument, listSegmentsByProject, createCode, createSegment, type Project, type Document, type Code, type Segment } from '$lib/db';
  import { register } from '$lib/keyboard';
  import { nextColor } from '$lib/colors';
  import ProjectSidebar from '$lib/components/ProjectSidebar.svelte';
  import DocumentPane from '$lib/components/DocumentPane.svelte';
  import CodebookPanel from '$lib/components/CodebookPanel.svelte';
  import MemoPanel from '$lib/components/MemoPanel.svelte';
  import RetrievalView from '$lib/components/RetrievalView.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';

  let projects = $state<Project[]>([]);
  let documents = $state<Document[]>([]);
  let codes = $state<Code[]>([]);
  let segments = $state<Segment[]>([]);

  let refreshKey = $state(0);

  function refresh() {
    refreshKey++;
  }

  $effect(() => {
    refreshKey;
    listProjects().then(p => projects = p);
  });

  $effect(() => {
    refreshKey;
    if (ui.activeProjectId) {
      listDocuments(ui.activeProjectId).then(d => documents = d);
      listCodes(ui.activeProjectId).then(c => codes = c);
    } else {
      documents = [];
      codes = [];
    }
  });

  $effect(() => {
    refreshKey;
    if (ui.activeDocumentId) {
      listSegmentsByDocument(ui.activeDocumentId).then(s => segments = s);
    } else {
      segments = [];
    }
  });

  // Register Cmd+K / Ctrl+K shortcut for command palette
  $effect(() => {
    const unregister = register({
      key: 'k',
      modifiers: ['meta'],
      description: 'Command palette',
      handler: () => { ui.commandPaletteOpen = !ui.commandPaletteOpen; },
      enabled: () => !!ui.activeProjectId
    });
    return unregister;
  });

  async function handlePaletteAssign(codeId: string) {
    if (selection.active && ui.activeProjectId && ui.activeDocumentId) {
      // Dispatch the same custom event that DocumentPane listens for
      window.dispatchEvent(new CustomEvent('ql-assign-code', { detail: { codeId } }));
    } else {
      // No selection — navigate to retrieval view for this code
      ui.filterCodeId = codeId;
      ui.panel = 'segments';
    }
  }

  async function handlePaletteCreate(name: string) {
    if (!ui.activeProjectId) return;
    const color = nextColor(codes.map(c => c.color));
    const code = await createCode(ui.activeProjectId, name, color);
    refresh();
    trackChange();
    showToast(`Created "${name}"`, 'success');

    // If text is selected, immediately assign the new code
    if (selection.active && ui.activeDocumentId) {
      await createSegment(
        ui.activeProjectId,
        ui.activeDocumentId,
        code.id,
        selection.start,
        selection.end,
        selection.text
      );
      selection.active = false;
      window.getSelection()?.removeAllRanges();
      refresh();
      trackChange();
    }
  }
</script>

<div class="app-layout">
  <ProjectSidebar {projects} {documents} onchange={refresh} />

  <main id="main-content" class="main-area" aria-label="Document viewer">
    {#if ui.activeDocumentId}
      <DocumentPane {codes} {segments} onchange={refresh} />
    {:else}
      <EmptyState />
    {/if}
  </main>

  {#if ui.activeProjectId}
    <div class="right-panel">
      <div class="panel-tabs">
        <button
          class="panel-tab"
          class:active={ui.panel === 'codebook' || ui.panel === 'segments'}
          onclick={() => { ui.filterCodeId = null; ui.panel = 'codebook'; }}
        >Codebook</button>
        <button
          class="panel-tab"
          class:active={ui.panel === 'memos'}
          onclick={() => ui.panel = 'memos'}
        >Memos</button>
      </div>
      {#if ui.panel === 'segments' && ui.filterCodeId}
        <RetrievalView {codes} {documents} onchange={refresh} />
      {:else if ui.panel === 'memos'}
        <MemoPanel {codes} onchange={refresh} />
      {:else}
        <CodebookPanel {codes} {segments} {documents} onchange={refresh} />
      {/if}
    </div>
  {/if}
</div>

<CommandPalette {codes} onassign={handlePaletteAssign} oncreate={handlePaletteCreate} />

<style>
  .app-layout {
    display: grid;
    grid-template-columns: calc(13.75rem * var(--ql-scale)) 1fr calc(16.25rem * var(--ql-scale));
    height: 100vh;
    overflow: hidden;
  }

  .main-area {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-left: 1px solid var(--theme-border-subtle);
    border-right: 1px solid var(--theme-border-subtle);
  }

  .right-panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .panel-tabs {
    display: flex;
    border-bottom: 1px solid var(--theme-border);
    background: var(--theme-bg-elevated);
    flex-shrink: 0;
  }

  .panel-tab {
    flex: 1;
    padding: var(--space-2) var(--space-3);
    font-size: var(--ui-font-xs);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--theme-text-faint);
    border-bottom: 2px solid transparent;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .panel-tab:hover {
    color: var(--theme-text-muted);
  }

  .panel-tab.active {
    color: var(--theme-text-secondary);
    border-bottom-color: var(--theme-accent);
  }
</style>
