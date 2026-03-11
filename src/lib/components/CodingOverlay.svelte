<script lang="ts">
  import { selection } from '$lib/state.svelte';
  import type { Code } from '$lib/db';

  let { codes, onassign }: {
    codes: Code[];
    onassign: (codeId: string) => void;
  } = $props();

  let style = $derived.by(() => {
    if (!selection.anchorRect) return '';
    const rect = selection.anchorRect;
    const top = rect.bottom + window.scrollY + 8;
    const left = rect.left + window.scrollX;
    return `top:${top}px;left:${left}px`;
  });
</script>

{#if selection.active && codes.length > 0}
  <div class="overlay" style={style}>
    {#each codes as code}
      <button
        class="code-btn"
        onclick={() => onassign(code.id)}
        title={code.shortcut ? `${code.name} [${code.shortcut}]` : code.name}
      >
        <span class="code-dot" style="background:{code.color}"></span>
        <span class="code-label">{code.name}</span>
        {#if code.shortcut}
          <span class="code-key">{code.shortcut}</span>
        {/if}
      </button>
    {/each}
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    z-index: 100;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 160px;
    max-width: 240px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  .code-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    transition: background var(--transition);
    text-align: left;
    width: 100%;
  }
  .code-btn:hover {
    background: var(--bg-hover);
  }
  .code-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .code-label {
    flex: 1;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .code-key {
    font-size: 11px;
    color: var(--text-faint);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 0 5px;
    line-height: 18px;
  }
</style>
