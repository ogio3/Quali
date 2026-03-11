<script lang="ts">
  import { ui, selection, showToast } from '$lib/state.svelte';
  import { getDocument, createSegment, deleteSegment, type Code, type Segment } from '$lib/db';
  import { buildHighlightedHtml, computeAbsoluteOffset } from '$lib/highlight';
  import CodingOverlay from './CodingOverlay.svelte';

  let { codes, segments, onchange }: {
    codes: Code[];
    segments: Segment[];
    onchange: () => void;
  } = $props();

  let content = $state('');
  let docName = $state('');
  let contentEl: HTMLDivElement | undefined = $state();
  let undoStack = $state<string[]>([]);

  let codeMap = $derived(new Map(codes.map(c => [c.id, c])));
  let highlightedHtml = $derived(buildHighlightedHtml(content, segments, codeMap));

  $effect(() => {
    if (ui.activeDocumentId) {
      getDocument(ui.activeDocumentId).then(doc => {
        if (doc) {
          content = doc.content;
          docName = doc.name;
        }
      });
      undoStack = [];
    }
  });

  // Listen for keyboard shortcut code assignment
  $effect(() => {
    function handleQuickAssign(e: Event) {
      const codeId = (e as CustomEvent).detail?.codeId;
      if (codeId && selection.active) {
        handleAssignCode(codeId);
      }
    }
    window.addEventListener('ql-assign-code', handleQuickAssign);
    return () => window.removeEventListener('ql-assign-code', handleQuickAssign);
  });

  // Undo with Ctrl/Cmd+Z
  $effect(() => {
    function handleUndo(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        const lastId = undoStack.pop();
        if (lastId) {
          e.preventDefault();
          deleteSegment(lastId).then(() => {
            showToast('Undone', 'info');
            onchange();
          });
        }
      }
    }
    window.addEventListener('keydown', handleUndo);
    return () => window.removeEventListener('keydown', handleUndo);
  });

  function handleMouseUp() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !contentEl) {
      selection.active = false;
      return;
    }

    const range = sel.getRangeAt(0);
    const text = sel.toString().trim();
    if (!text) {
      selection.active = false;
      return;
    }

    const offsets = computeAbsoluteOffset(range, contentEl);
    if (!offsets) {
      selection.active = false;
      return;
    }

    const rect = range.getBoundingClientRect();
    selection.start = offsets.start;
    selection.end = offsets.end;
    selection.text = text;
    selection.anchorRect = rect;
    selection.active = true;
  }

  async function handleAssignCode(codeId: string) {
    if (!ui.activeProjectId || !ui.activeDocumentId) return;
    const seg = await createSegment(
      ui.activeProjectId,
      ui.activeDocumentId,
      codeId,
      selection.start,
      selection.end,
      selection.text
    );
    undoStack.push(seg.id);
    selection.active = false;
    window.getSelection()?.removeAllRanges();
    onchange();
  }

  async function handleSegmentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const segEl = target.closest('[data-segment-id]') as HTMLElement | null;
    if (!segEl) return;

    const segmentId = segEl.dataset.segmentId;
    if (!segmentId) return;

    // Right-click or Ctrl+click to delete
    if (e.ctrlKey || e.metaKey) {
      await deleteSegment(segmentId);
      showToast('Code removed', 'info');
      onchange();
    }
  }
</script>

<main class="document-pane">
  <div class="doc-header">
    <h2 class="doc-title">{docName}</h2>
  </div>

  <div class="doc-content-wrapper">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="doc-content"
      bind:this={contentEl}
      onmouseup={handleMouseUp}
      onclick={handleSegmentClick}
    >
      {@html highlightedHtml}
    </div>
  </div>

  {#if selection.active}
    <CodingOverlay {codes} onassign={handleAssignCode} />
  {/if}
</main>

<style>
  .document-pane {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }
  .doc-header {
    padding: 16px 32px 8px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .doc-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
  }
  .doc-content-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 24px 32px;
  }
  .doc-content {
    font-size: 15px;
    line-height: 1.85;
    max-width: 720px;
    color: var(--text);
    word-wrap: break-word;
    user-select: text;
    -webkit-user-select: text;
  }
  .doc-content :global(.ql-segment:hover) {
    filter: brightness(1.2);
  }
</style>
