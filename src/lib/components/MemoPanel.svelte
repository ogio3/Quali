<script lang="ts">
  import { ui, showToast } from '$lib/state.svelte';
  import { createMemo, updateMemo, deleteMemo, listMemosByProject, type Memo, type Code } from '$lib/db';
  import { IconPlus, IconX } from './icons';

  let { codes, onchange }: {
    codes: Code[];
    onchange: () => void;
  } = $props();

  let memos = $state<Memo[]>([]);
  let activeMemoId = $state<string | null>(null);
  let refreshKey = $state(0);

  let activeMemo = $derived(memos.find(m => m.id === activeMemoId) ?? null);

  $effect(() => {
    refreshKey;
    if (ui.activeProjectId) {
      listMemosByProject(ui.activeProjectId).then(m => memos = m);
    } else {
      memos = [];
    }
  });

  function codeNameForMemo(memo: Memo): string | null {
    if (!memo.codeId) return null;
    return codes.find(c => c.id === memo.codeId)?.name ?? null;
  }

  async function handleCreateMemo(codeId: string | null = null) {
    if (!ui.activeProjectId) return;
    const title = codeId
      ? `Memo: ${codes.find(c => c.id === codeId)?.name ?? 'Code'}`
      : `Memo ${memos.filter(m => !m.codeId).length + 1}`;
    const memo = await createMemo(ui.activeProjectId, codeId, title);
    activeMemoId = memo.id;
    refreshKey++;
  }

  async function handleDeleteMemo(id: string) {
    await deleteMemo(id);
    if (activeMemoId === id) activeMemoId = null;
    refreshKey++;
    showToast('Memo deleted', 'info');
  }

  let saveTimer: ReturnType<typeof setTimeout> | undefined;

  function handleContentChange(e: Event) {
    const value = (e.target as HTMLTextAreaElement).value;
    if (!activeMemoId) return;
    clearTimeout(saveTimer);
    const memoId = activeMemoId;
    saveTimer = setTimeout(async () => {
      await updateMemo(memoId, { content: value });
      refreshKey++;
    }, 500);
  }

  function handleTitleChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!activeMemoId) return;
    clearTimeout(saveTimer);
    const memoId = activeMemoId;
    saveTimer = setTimeout(async () => {
      await updateMemo(memoId, { title: value });
      refreshKey++;
    }, 500);
  }
</script>

<aside class="panel" aria-label="Memos">
  <div class="memo-list">
    <div class="memo-list-header">
      <span class="memo-label">Memos</span>
      <button class="icon-btn" onclick={() => handleCreateMemo()} title="New memo">
        <IconPlus />
      </button>
    </div>
    {#each memos as memo}
      <div
        class="memo-item"
        class:active={activeMemoId === memo.id}
        role="button"
        tabindex="0"
        onclick={() => activeMemoId = memo.id}
        onkeydown={(e) => { if (e.key === 'Enter') activeMemoId = memo.id; }}
      >
        <span class="memo-item-title">{memo.title}</span>
        {#if codeNameForMemo(memo)}
          <span class="memo-code-tag">{codeNameForMemo(memo)}</span>
        {/if}
        <button
          class="memo-delete"
          onclick={(e) => { e.stopPropagation(); handleDeleteMemo(memo.id); }}
          title="Delete memo"
        >
          <IconX />
        </button>
      </div>
    {/each}
    {#if memos.length === 0}
      <div class="memo-empty">No memos yet</div>
    {/if}
  </div>

  {#if activeMemo}
    <div class="memo-editor">
      <input
        class="memo-title-input"
        value={activeMemo.title}
        oninput={handleTitleChange}
        placeholder="Memo title"
      />
      <textarea
        class="memo-content"
        value={activeMemo.content}
        oninput={handleContentChange}
        placeholder="Write your analytic memo here..."
      ></textarea>
    </div>
  {:else}
    <div class="memo-placeholder">
      Select a memo or create a new one
    </div>
  {/if}
</aside>

<style>
  .panel {
    background: var(--theme-bg-elevated);
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .memo-list {
    border-bottom: 1px solid var(--theme-border);
    max-height: 40%;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .memo-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
  }

  .memo-label {
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

  .memo-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-2) var(--space-4);
    text-align: left;
    font-size: var(--ui-font-sm);
    color: var(--theme-text-muted);
    transition: all var(--duration-fast) var(--ease-out);
    position: relative;
  }

  .memo-item:hover {
    background: var(--theme-bg-hover);
    color: var(--theme-text-secondary);
  }

  .memo-item.active {
    background: var(--theme-bg-active);
    color: var(--theme-text);
  }

  .memo-item-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .memo-code-tag {
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    background: var(--theme-bg);
    padding: 1px var(--space-1);
    border-radius: var(--radius-sm);
    flex-shrink: 0;
  }

  .memo-delete {
    opacity: 0;
    color: var(--theme-text-faint);
    padding: var(--space-1);
    flex-shrink: 0;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .memo-item:hover .memo-delete {
    opacity: 1;
  }

  .memo-delete:hover {
    color: var(--theme-danger);
  }

  .memo-empty {
    padding: var(--space-4);
    text-align: center;
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
  }

  .memo-editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: var(--space-3);
    gap: var(--space-2);
  }

  .memo-title-input {
    font-size: var(--ui-font-sm);
    font-weight: var(--font-weight-medium);
    padding: var(--space-2);
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--theme-border);
    color: var(--theme-text);
  }

  .memo-title-input:focus {
    outline: none;
    border-color: var(--theme-accent);
  }

  .memo-content {
    flex: 1;
    font-family: var(--font-body);
    font-size: var(--ui-font-sm);
    line-height: 1.6;
    padding: var(--space-2);
    background: transparent;
    border: none;
    color: var(--theme-text);
    resize: none;
  }

  .memo-content:focus {
    outline: none;
  }

  .memo-content::placeholder {
    color: var(--theme-text-faint);
  }

  .memo-placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
  }
</style>
