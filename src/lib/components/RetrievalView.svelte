<script lang="ts">
  import { ui } from '$lib/state.svelte';
  import { listSegmentsByCode, type Code, type Document, type Segment } from '$lib/db';
  import { IconArrowLeft } from './icons';

  let { codes, documents, onchange }: {
    codes: Code[];
    documents: Document[];
    onchange: () => void;
  } = $props();

  let segments = $state<Segment[]>([]);
  let loading = $state(false);

  let activeCode = $derived(codes.find(c => c.id === ui.filterCodeId) ?? null);

  let docMap = $derived(new Map(documents.map(d => [d.id, d])));

  // Group segments by document
  let groupedSegments = $derived.by(() => {
    const groups: { doc: Document; segments: Segment[] }[] = [];
    const map = new Map<string, Segment[]>();

    for (const seg of segments) {
      let arr = map.get(seg.documentId);
      if (!arr) {
        arr = [];
        map.set(seg.documentId, arr);
      }
      arr.push(seg);
    }

    for (const [docId, segs] of map) {
      const doc = docMap.get(docId);
      if (doc) {
        // Sort by offset within document
        segs.sort((a, b) => a.startOffset - b.startOffset);
        groups.push({ doc, segments: segs });
      }
    }

    // Sort groups by document name
    groups.sort((a, b) => a.doc.name.localeCompare(b.doc.name));
    return groups;
  });

  // Load segments when filterCodeId changes
  $effect(() => {
    const codeId = ui.filterCodeId;
    if (codeId) {
      loading = true;
      listSegmentsByCode(codeId).then(s => {
        segments = s;
        loading = false;
      });
    } else {
      segments = [];
    }
  });

  function goBack() {
    ui.filterCodeId = null;
    ui.panel = 'codebook';
  }

  function navigateToSegment(seg: Segment) {
    ui.activeDocumentId = seg.documentId;
    // Dispatch after a tick so DocumentPane loads the document first
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('ql-scroll-to-segment', {
          detail: { startOffset: seg.startOffset, endOffset: seg.endOffset }
        }));
      }, 100);
    });
  }

  function truncateText(text: string, maxLen: number = 200): string {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen) + '\u2026';
  }
</script>

<aside class="panel" aria-label="Code Retrieval">
  <div class="retrieval-header">
    <button class="back-btn" onclick={goBack} title="Back to codebook">
      <IconArrowLeft size="14" />
    </button>
    {#if activeCode}
      <span class="code-swatch" style="background:{activeCode.color}"></span>
      <span class="code-label">{activeCode.name}</span>
      <span class="seg-total">{segments.length}</span>
    {/if}
  </div>

  <div class="segment-list">
    {#if loading}
      <div class="empty-msg">Loading\u2026</div>
    {:else if segments.length === 0}
      <div class="empty-msg">No segments coded yet</div>
    {:else}
      {#each groupedSegments as group}
        <div class="doc-group">
          <div class="doc-group-header">
            <span class="doc-name">{group.doc.name}</span>
            <span class="doc-seg-count">{group.segments.length}</span>
          </div>
          {#each group.segments as seg}
            <button
              class="segment-card"
              style="border-left-color:{activeCode?.color ?? 'var(--theme-border)'}"
              onclick={() => navigateToSegment(seg)}
            >
              <span class="segment-text">{truncateText(seg.text)}</span>
            </button>
          {/each}
        </div>
      {/each}
    {/if}
  </div>
</aside>

<style>
  .panel {
    background: var(--theme-bg-elevated);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    animation: retrieval-enter var(--duration-base) var(--ease-out);
  }

  @keyframes retrieval-enter {
    from {
      opacity: 0;
      transform: translateX(8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .retrieval-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4);
    flex-shrink: 0;
  }

  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-sm);
    color: var(--theme-text-muted);
    transition: all var(--duration-fast) var(--ease-out);
    flex-shrink: 0;
  }

  .back-btn:hover {
    color: var(--theme-text);
    background: var(--theme-bg-hover);
  }

  .code-swatch {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 5px currentColor;
  }

  .code-label {
    font-size: var(--ui-font-sm);
    font-weight: var(--font-weight-medium);
    color: var(--theme-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .seg-total {
    font-family: var(--font-mono);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    background: var(--theme-bg);
    border-radius: var(--radius-full, 9999px);
    padding: 1px var(--space-2);
    line-height: 1.4;
    flex-shrink: 0;
  }

  .segment-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 var(--space-3) var(--space-3);
  }

  .empty-msg {
    padding: var(--space-6) var(--space-4);
    text-align: center;
    font-size: var(--ui-font-sm);
    color: var(--theme-text-faint);
  }

  .doc-group {
    margin-bottom: var(--space-3);
  }

  .doc-group-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-2);
    margin-bottom: var(--space-1);
  }

  .doc-name {
    font-size: var(--ui-font-xs);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--theme-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .doc-seg-count {
    font-family: var(--font-mono);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
  }

  .segment-card {
    display: block;
    width: 100%;
    text-align: left;
    padding: var(--space-3);
    margin-bottom: 2px;
    border-left: 3px solid var(--theme-border);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    background: transparent;
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .segment-card:hover {
    background: var(--theme-bg-hover);
  }

  .segment-card:active {
    background: var(--theme-bg-active);
  }

  .segment-text {
    font-family: var(--font-body);
    font-size: var(--ui-font-sm);
    line-height: 1.5;
    color: var(--theme-text-secondary);
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
