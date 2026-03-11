<script lang="ts">
  import { ui, showToast } from '$lib/state.svelte';
  import { createProject, deleteProject, createDocument, getDocument, type Project, type Document } from '$lib/db';
  import { parseFile } from '$lib/import';

  let { projects, documents, onchange }: {
    projects: Project[];
    documents: Document[];
    onchange: () => void;
  } = $props();

  let newProjectName = $state('');
  let showNewProject = $state(false);
  let dragover = $state(false);

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

  async function handlePasteDocument() {
    if (!ui.activeProjectId) return;
    try {
      const text = await navigator.clipboard.readText();
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

<aside
  class="sidebar"
  ondragover={(e) => { e.preventDefault(); dragover = true; }}
  ondragleave={() => dragover = false}
  ondrop={handleDrop}
  class:dragover
>
  <div class="sidebar-header">
    <span class="sidebar-title">Projects</span>
    <button class="icon-btn" onclick={() => showNewProject = !showNewProject} title="New project">+</button>
  </div>

  {#if showNewProject}
    <form class="new-project-form" onsubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
      <input
        bind:value={newProjectName}
        placeholder="Project name"
        autofocus
      />
    </form>
  {/if}

  <div class="project-list">
    {#each projects as project}
      <div
        class="project-item"
        class:active={ui.activeProjectId === project.id}
        role="button"
        tabindex="0"
        onclick={() => selectProject(project.id)}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectProject(project.id); }}
      >
        <span class="truncate">{project.name}</span>
        <button
          class="delete-btn"
          onclick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
          title="Delete project"
        >&times;</button>
      </div>
    {/each}
  </div>

  {#if ui.activeProjectId}
    <div class="sidebar-divider"></div>
    <div class="sidebar-header">
      <span class="sidebar-title">Documents</span>
      <button class="icon-btn" onclick={handlePasteDocument} title="Paste from clipboard">&#x2398;</button>
    </div>
    <div class="doc-list">
      {#each documents as doc}
        <button
          class="doc-item"
          class:active={ui.activeDocumentId === doc.id}
          onclick={() => selectDocument(doc.id)}
        >
          <span class="truncate">{doc.name}</span>
        </button>
      {/each}
      {#if documents.length === 0}
        <div class="hint">Drop .txt, .md, or .docx files here</div>
      {/if}
    </div>
  {/if}
</aside>

<style>
  .sidebar {
    background: var(--bg-elevated);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 12px 0;
    transition: background var(--transition);
  }
  .sidebar.dragover {
    background: var(--bg-active);
  }
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 16px;
    margin-bottom: 4px;
  }
  .sidebar-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }
  .icon-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    font-size: 16px;
    transition: all var(--transition);
  }
  .icon-btn:hover {
    background: var(--bg-hover);
    color: var(--text);
  }
  .new-project-form {
    padding: 4px 12px 8px;
  }
  .new-project-form input {
    width: 100%;
  }
  .project-list, .doc-list {
    flex: 1;
  }
  .project-item, .doc-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 6px 16px;
    text-align: left;
    transition: background var(--transition);
    font-size: 13px;
  }
  .project-item:hover, .doc-item:hover {
    background: var(--bg-hover);
  }
  .project-item.active, .doc-item.active {
    background: var(--bg-active);
    color: var(--text);
  }
  .delete-btn {
    opacity: 0;
    color: var(--text-faint);
    font-size: 16px;
    padding: 0 4px;
    transition: opacity var(--transition);
  }
  .project-item:hover .delete-btn {
    opacity: 1;
  }
  .delete-btn:hover {
    color: var(--danger);
  }
  .sidebar-divider {
    height: 1px;
    background: var(--border);
    margin: 8px 16px;
  }
  .hint {
    padding: 12px 16px;
    font-size: 12px;
    color: var(--text-faint);
    text-align: center;
    line-height: 1.5;
  }
</style>
