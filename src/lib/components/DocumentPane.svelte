<script lang="ts">
  import { ui, selection, showToast, trackChange } from '$lib/state.svelte';
  import { getDocument, createSegment, deleteSegment, type Code, type Segment } from '$lib/db';
  import { contentToHtml, computeAbsoluteOffset, computeHighlightRects, hitTestSegment, type HighlightRect } from '$lib/highlight';
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
  let highlightRects = $state<HighlightRect[]>([]);
  let hoveredSegmentId = $state<string | null>(null);

  let scrollFlashSegmentId = $state<string | null>(null);
  let scrollHighlightTimer: ReturnType<typeof setTimeout> | undefined;

  let codeMap = $derived(new Map(codes.map(c => [c.id, c])));
  let plainHtml = $derived(contentToHtml(content));

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

  // Recompute highlight rects when segments, codes, or content change
  $effect(() => {
    // Track dependencies
    segments;
    codeMap;
    content;

    // Wait for DOM to render the plain text
    requestAnimationFrame(() => {
      if (contentEl) {
        highlightRects = computeHighlightRects(contentEl, segments, codeMap);
      }
    });
  });

  // Recompute on resize
  $effect(() => {
    if (!contentEl) return;
    const ro = new ResizeObserver(() => {
      if (contentEl) {
        highlightRects = computeHighlightRects(contentEl, segments, codeMap);
      }
    });
    ro.observe(contentEl);
    return () => ro.disconnect();
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

  // Listen for scroll-to-segment events from RetrievalView
  $effect(() => {
    function handleScrollToSegment(e: Event) {
      const { startOffset, endOffset } = (e as CustomEvent).detail;
      if (!contentEl) return;

      // Find the text node and position for the given offset
      const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT);
      let charCount = 0;
      let targetNode: Text | null = null;
      let nodeOffset = 0;

      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        const len = node.textContent?.length ?? 0;
        if (charCount + len > startOffset) {
          targetNode = node;
          nodeOffset = startOffset - charCount;
          break;
        }
        charCount += len;
      }

      if (targetNode) {
        // Create a range to get the position
        const range = document.createRange();
        range.setStart(targetNode, Math.min(nodeOffset, targetNode.textContent?.length ?? 0));
        range.setEnd(targetNode, Math.min(nodeOffset, targetNode.textContent?.length ?? 0));
        const rect = range.getBoundingClientRect();
        const scrollContainer = contentEl.closest('.doc-scroll');

        if (scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const scrollTop = scrollContainer.scrollTop;
          const targetY = rect.top - containerRect.top + scrollTop - containerRect.height / 3;
          scrollContainer.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }

        range.detach();
      }

      // Flash highlight — find the matching segment by offset
      const matchSeg = segments.find(s => s.startOffset === startOffset && s.endOffset === endOffset);
      if (matchSeg) {
        clearTimeout(scrollHighlightTimer);
        scrollFlashSegmentId = matchSeg.id;
        scrollHighlightTimer = setTimeout(() => {
          scrollFlashSegmentId = null;
        }, 2000);
      }
    }

    window.addEventListener('ql-scroll-to-segment', handleScrollToSegment);
    return () => window.removeEventListener('ql-scroll-to-segment', handleScrollToSegment);
  });

  // Escape to dismiss selection
  $effect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && selection.active) {
        e.preventDefault();
        selection.active = false;
        window.getSelection()?.removeAllRanges();
      }
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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
            trackChange();
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
    trackChange();
  }

  function handleOverlayClick(e: MouseEvent) {
    if (!contentEl) return;
    const containerRect = contentEl.getBoundingClientRect();
    const segmentId = hitTestSegment(e.clientX, e.clientY, containerRect, highlightRects);
    if (!segmentId) return;

    if (e.ctrlKey || e.metaKey) {
      deleteSegment(segmentId).then(() => {
        showToast('Code removed', 'info');
        onchange();
      });
    }
  }

  function handleOverlayMouseMove(e: MouseEvent) {
    if (!contentEl) return;
    const containerRect = contentEl.getBoundingClientRect();
    hoveredSegmentId = hitTestSegment(e.clientX, e.clientY, containerRect, highlightRects);
  }

  function handleOverlayMouseLeave() {
    hoveredSegmentId = null;
  }
</script>

<div class="document-pane" role="region" aria-label={docName || 'Document'}>
  <header class="doc-header">
    <h2 class="doc-title">{docName}</h2>
  </header>

  <div class="doc-scroll">
    <div class="doc-reading-area">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="doc-content"
        bind:this={contentEl}
        onmouseup={handleMouseUp}
      >
        {@html plainHtml}
      </div>

      <!-- Highlight overlay layer — no DOM pollution -->
      <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
      <div
        class="highlight-layer"
        onclick={handleOverlayClick}
        onmousemove={handleOverlayMouseMove}
        onmouseleave={handleOverlayMouseLeave}
      >
        {#each highlightRects as rect}
          <div
            class="hl-rect"
            class:hovered={hoveredSegmentId === rect.segmentId}
            class:scroll-flash={scrollFlashSegmentId === rect.segmentId}
            style="top:{rect.top}px;left:{rect.left}px;width:{rect.width}px;height:{rect.height}px;background:{rect.color}33;border-bottom:1.5px solid {rect.color}80"
            title="{rect.codeName} — Cmd+click to remove"
          ></div>
        {/each}
      </div>
    </div>
  </div>

  {#if selection.active}
    <CodingOverlay {codes} onassign={handleAssignCode} />
  {/if}
</div>

<style>
  .document-pane {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    background: var(--theme-bg);
  }

  .doc-header {
    padding: var(--space-5) var(--space-12) var(--space-4);
    flex-shrink: 0;
  }

  .doc-title {
    font-family: var(--font-ui);
    font-size: var(--ui-font-xs);
    font-weight: var(--font-weight-normal);
    letter-spacing: 0.06em;
    color: var(--theme-text-faint);
    text-transform: uppercase;
  }

  .doc-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0 var(--space-12) var(--space-10);
  }

  .doc-reading-area {
    max-width: var(--doc-content-width, 65ch);
    margin: 0 auto;
    position: relative;
  }

  .doc-content {
    font-family: var(--font-body);
    font-size: var(--doc-font-size, 18px);
    font-weight: var(--doc-font-weight, 370);
    line-height: var(--doc-line-height, 1.7);
    letter-spacing: var(--doc-letter-spacing, 0.01em);
    color: var(--theme-text);
    word-wrap: break-word;
    user-select: text;
    -webkit-user-select: text;
    font-feature-settings: 'kern' 1, 'liga' 1, 'onum' 1;
    line-break: strict;
    overflow-wrap: anywhere;
  }

  .highlight-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .highlight-layer:has(.hl-rect) {
    pointer-events: auto;
  }

  .hl-rect {
    position: absolute;
    border-radius: 2px;
    pointer-events: auto;
    cursor: pointer;
    transition: filter var(--duration-fast) var(--ease-out),
                opacity var(--duration-fast) var(--ease-out);
  }

  .hl-rect.hovered {
    filter: brightness(1.3);
  }

  .hl-rect.scroll-flash {
    animation: segment-flash 2s ease-out;
  }

  @keyframes segment-flash {
    0% { filter: brightness(2.5); }
    30% { filter: brightness(1.8); }
    100% { filter: brightness(1); }
  }
</style>
