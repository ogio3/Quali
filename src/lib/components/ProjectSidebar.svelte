<script lang="ts">
  import { ui, showToast } from '$lib/state.svelte';
  import { createProject, deleteProject, createDocument, getDocument, updateDocumentName, type Project, type Document } from '$lib/db';
  import { parseFile } from '$lib/import';
  import { IconPlus, IconX, IconClipboard, IconDownload } from './icons';

  let { projects, documents, onchange }: {
    projects: Project[];
    documents: Document[];
    onchange: () => void;
  } = $props();

  let newProjectName = $state('');
  let showNewProject = $state(false);
  let dragover = $state(false);
  let editingDocId = $state<string | null>(null);
  let editingDocName = $state('');

  async function handleCreateProject() {
    const name = newProjectName.trim();
    if (!name) return;
    const p = await createProject(name);
    ui.activeProjectId = p.id;
    ui.activeDocumentId = null;
    newProjectName = '';
    showNewProject = false;
    onchange();
  }

  function selectProject(id: string) {
    ui.activeProjectId = id;
    ui.activeDocumentId = null;
    onchange();
  }

  function selectDocument(id: string) {
    ui.activeDocumentId = id;
    onchange();
  }

  async function handleDeleteProject(id: string) {
    await deleteProject(id);
    if (ui.activeProjectId === id) {
      ui.activeProjectId = null;
      ui.activeDocumentId = null;
    }
    onchange();
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragover = false;
    if (!ui.activeProjectId || !e.dataTransfer?.files.length) return;

    for (const file of e.dataTransfer.files) {
      try {
        const { name, content } = await parseFile(file);
        const doc = await createDocument(ui.activeProjectId, name, content);
        ui.activeDocumentId = doc.id;
        showToast(`Imported: ${name}`, 'success');
      } catch {
        showToast(`Failed to import: ${file.name}`, 'error');
      }
    }
    onchange();
  }

  function startEditingDoc(doc: Document) {
    editingDocId = doc.id;
    editingDocName = doc.name;
  }

  async function finishEditingDoc() {
    if (editingDocId && editingDocName.trim()) {
      await updateDocumentName(editingDocId, editingDocName.trim());
      onchange();
    }
    editingDocId = null;
  }

  async function handlePasteDocument() {
    if (!ui.activeProjectId) return;
    try {
      const raw = await navigator.clipboard.readText();
      const text = raw.normalize('NFC');
      if (!text.trim()) {
        showToast('Clipboard is empty', 'error');
        return;
      }
      const doc = await createDocument(ui.activeProjectId, `Document ${documents.length + 1}`, text);
      ui.activeDocumentId = doc.id;
      showToast('Pasted from clipboard', 'success');
      onchange();
    } catch {
      showToast('Failed to read clipboard', 'error');
    }
  }
</script>

<nav
  class="sidebar"
  aria-label="Projects and documents"
  ondragover={(e) => { e.preventDefault(); dragover = true; }}
  ondragleave={() => dragover = false}
  ondrop={handleDrop}
  class:dragover
>
  <div class="sidebar-section">
    <div class="section-header">
      <span class="section-label">Projects</span>
      <button class="icon-btn" onclick={() => showNewProject = !showNewProject} title="New project">
        <IconPlus />
      </button>
    </div>

    {#if showNewProject}
      <form class="inline-form" onsubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
        <input
          bind:value={newProjectName}
          placeholder="Project name"
          autofocus
        />
      </form>
    {/if}

    <div class="item-list">
      {#each projects as project}
        <div
          class="item"
          class:active={ui.activeProjectId === project.id}
          role="button"
          tabindex="0"
          onclick={() => selectProject(project.id)}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectProject(project.id); }}
        >
          <span class="item-label truncate">{project.name}</span>
          <button
            class="item-action"
            onclick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
            title="Delete project"
          >
            <IconX />
          </button>
        </div>
      {/each}
    </div>
  </div>

  {#if ui.activeProjectId}
    <div class="sidebar-divider"></div>
    <div class="sidebar-section">
      <div class="section-header">
        <span class="section-label">Documents</span>
        <button class="icon-btn" onclick={handlePasteDocument} title="Paste from clipboard">
          <IconClipboard />
        </button>
      </div>
      <div class="item-list">
        {#each documents as doc}
          <button
            class="item"
            class:active={ui.activeDocumentId === doc.id}
            onclick={() => selectDocument(doc.id)}
          >
            {#if editingDocId === doc.id}
              <!-- svelte-ignore a11y_autofocus -->
              <input
                class="inline-rename"
                bind:value={editingDocName}
                onblur={finishEditingDoc}
                onkeydown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); finishEditingDoc(); }
                  if (e.key === 'Escape') { editingDocId = null; }
                }}
                onclick={(e) => e.stopPropagation()}
                autofocus
              />
            {:else}
              <span
                class="item-label truncate"
                ondblclick={(e) => { e.stopPropagation(); startEditingDoc(doc); }}
              >{doc.name}</span>
            {/if}
          </button>
        {/each}
        {#if documents.length === 0}
          <div class="drop-hint">
            <IconDownload size="1.25em" class="drop-hint-icon" />
            <span>Drop files here</span>
            <span class="drop-hint-sub">.txt .md .docx</span>
            <label class="import-file-btn">
              <span>or browse files</span>
              <input
                type="file"
                accept=".txt,.md,.docx"
                multiple
                class="sr-only"
                onchange={async (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (!files || !ui.activeProjectId) return;
                  for (const file of files) {
                    try {
                      const { name, content } = await parseFile(file);
                      const doc = await createDocument(ui.activeProjectId, name, content);
                      ui.activeDocumentId = doc.id;
                      showToast(`Imported: ${name}`, 'success');
                    } catch {
                      showToast(`Failed to import: ${file.name}`, 'error');
                    }
                  }
                  onchange();
                }}
              />
            </label>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<style>
  .sidebar {
    background: var(--theme-bg-elevated);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    transition: background 200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .sidebar.dragover {
    background: var(--theme-bg-hover);
  }

  .sidebar-section {
    padding: var(--space-4) 0 var(--space-2);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-4);
    margin-bottom: var(--space-2);
  }

  .section-label {
    font-size: var(--ui-font-xs);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--theme-text-muted);
  }

  .icon-btn {
    width: var(--target-min);
    height: var(--target-min);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--theme-text-faint);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .icon-btn:hover {
    background: var(--theme-bg-hover);
    color: var(--theme-text-secondary);
  }

  .inline-form {
    padding: 0 var(--space-3) var(--space-2);
  }

  .inline-form input {
    width: 100%;
  }

  .item-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--space-2) var(--space-4);
    text-align: left;
    font-size: var(--ui-font-sm);
    color: var(--theme-text-muted);
    transition: all var(--duration-fast) var(--ease-out);
    border-radius: 0;
    cursor: pointer;
    min-height: var(--target-min);
  }

  .item:hover {
    background: var(--theme-bg-hover);
    color: var(--theme-text-secondary);
  }

  .item.active {
    background: var(--theme-bg-active);
    color: var(--theme-text);
  }

  .item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--theme-accent);
  }

  .item {
    position: relative;
  }

  .item-label {
    flex: 1;
    min-width: 0;
  }

  .item-action {
    opacity: 0;
    color: var(--theme-text-faint);
    padding: var(--space-1);
    transition: all var(--duration-fast) var(--ease-out);
    flex-shrink: 0;
  }

  .item:hover .item-action {
    opacity: 1;
  }

  .item-action:hover {
    color: var(--theme-danger);
  }

  .sidebar-divider {
    height: 1px;
    background: var(--theme-border);
    margin: var(--space-1) var(--space-4);
  }

  .drop-hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-6) var(--space-4);
    color: var(--theme-text-muted);
    font-size: var(--ui-font-xs);
    font-weight: var(--font-weight-normal);
  }

  .drop-hint :global(.drop-hint-icon) {
    opacity: 0.3;
    font-size: 1.25rem;
  }

  .drop-hint-sub {
    font-size: var(--ui-font-xs);
    opacity: 0.6;
  }

  .import-file-btn {
    margin-top: var(--space-1);
    font-size: var(--ui-font-xs);
    color: var(--theme-accent);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity var(--duration-base) var(--ease-out);
  }

  .import-file-btn:hover {
    opacity: 1;
  }

  .inline-rename {
    flex: 1;
    min-width: 0;
    font-size: var(--ui-font-sm);
    padding: 0 var(--space-1);
    border: 1px solid var(--theme-accent);
    border-radius: var(--radius-sm);
    background: var(--theme-bg);
    color: var(--theme-text);
    outline: none;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
