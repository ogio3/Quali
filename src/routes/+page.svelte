<script lang="ts">
  import { ui } from '$lib/state.svelte';
  import { listProjects, listDocuments, listCodes, listSegmentsByDocument, listSegmentsByProject, type Project, type Document, type Code, type Segment } from '$lib/db';
  import ProjectSidebar from '$lib/components/ProjectSidebar.svelte';
  import DocumentPane from '$lib/components/DocumentPane.svelte';
  import CodebookPanel from '$lib/components/CodebookPanel.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';

  let projects = $state<Project[]>([]);
  let documents = $state<Document[]>([]);
  let codes = $state<Code[]>([]);
  let segments = $state<Segment[]>([]);

  let refreshKey = $state(0);

  function refresh() {
    refreshKey++;
  }

  $effect(() => {
    // Track refreshKey to re-run
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
</script>

<div class="app-layout">
  <ProjectSidebar {projects} {documents} onchange={refresh} />

  {#if ui.activeDocumentId}
    <DocumentPane {codes} {segments} onchange={refresh} />
  {:else}
    <EmptyState />
  {/if}

  {#if ui.activeProjectId}
    <CodebookPanel {codes} {segments} {documents} onchange={refresh} />
  {/if}
</div>

<style>
  .app-layout {
    display: grid;
    grid-template-columns: 240px 1fr 280px;
    height: 100vh;
    overflow: hidden;
  }
</style>
