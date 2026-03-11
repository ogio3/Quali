<script lang="ts">
  import { ui, selection } from '$lib/state.svelte';
  import { IconSearch } from './icons';
  import type { Code } from '$lib/db';

  let { codes, onassign, oncreate }: {
    codes: Code[];
    onassign: (codeId: string) => void;
    oncreate: (name: string) => void;
  } = $props();

  let query = $state('');
  let focusedIndex = $state(0);
  let inputEl: HTMLInputElement | undefined = $state();
  let listEl: HTMLDivElement | undefined = $state();

  let filtered = $derived.by(() => {
    if (!query.trim()) return codes;
    const q = query.trim().toLowerCase();
    return codes.filter(c => c.name.toLowerCase().includes(q));
  });

  // Whether to show the "Create" fallback row
  let showCreate = $derived(query.trim().length > 0 && filtered.length === 0);

  // Total selectable items (filtered codes + optional create row)
  let itemCount = $derived(filtered.length + (showCreate ? 1 : 0));

  // Reset state when palette opens
  $effect(() => {
    if (ui.commandPaletteOpen) {
      query = '';
      focusedIndex = 0;
      // Auto-focus input after mount
      requestAnimationFrame(() => inputEl?.focus());
    }
  });

  // Keep focused index in bounds when filtered list changes
  $effect(() => {
    if (focusedIndex >= itemCount && itemCount > 0) {
      focusedIndex = itemCount - 1;
    }
  });

  // Scroll focused item into view
  $effect(() => {
    if (!listEl) return;
    const el = listEl.querySelector(`[data-index="${focusedIndex}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  });

  function close() {
    ui.commandPaletteOpen = false;
  }

  function select(index: number) {
    if (index < filtered.length) {
      onassign(filtered[index].id);
    } else if (showCreate) {
      oncreate(query.trim());
    }
    close();
  }

  function handleKeydown(e: KeyboardEvent) {
    // Cmd+K / Ctrl+K to close from within the input
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      close();
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (itemCount > 0) focusedIndex = (focusedIndex + 1) % itemCount;
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (itemCount > 0) focusedIndex = (focusedIndex - 1 + itemCount) % itemCount;
        break;
      case 'Enter':
        e.preventDefault();
        if (itemCount > 0) select(focusedIndex);
        break;
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }
</script>

{#if ui.commandPaletteOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="palette-backdrop" onclick={handleBackdropClick}>
    <div class="palette" role="combobox" aria-expanded="true" aria-haspopup="listbox" aria-controls="palette-results">
      <div class="palette-input-row">
        <IconSearch size="14" class="palette-search-icon" />
        <input
          bind:this={inputEl}
          bind:value={query}
          onkeydown={handleKeydown}
          type="text"
          class="palette-input"
          placeholder={selection.active ? 'Assign code to selection...' : 'Search codes...'}
          aria-label="Search codes"
          autocomplete="off"
          spellcheck="false"
        />
        <kbd class="palette-hint">{navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl'}K</kbd>
      </div>

      <div class="palette-results" id="palette-results" bind:this={listEl} role="listbox">
        {#each filtered as code, i}
          <button
            class="palette-item"
            class:focused={focusedIndex === i}
            data-index={i}
            onclick={() => { select(i); }}
            role="option"
            aria-selected={focusedIndex === i}
          >
            <span class="code-swatch" style="background:{code.color}" aria-hidden="true"></span>
            <span class="code-label">{code.name}</span>
            {#if code.shortcut}
              <kbd class="code-key">{code.shortcut}</kbd>
            {/if}
          </button>
        {/each}

        {#if showCreate}
          <button
            class="palette-item create-item"
            class:focused={focusedIndex === filtered.length}
            data-index={filtered.length}
            onclick={() => { select(filtered.length); }}
            role="option"
            aria-selected={focusedIndex === filtered.length}
          >
            <span class="create-plus" aria-hidden="true">+</span>
            <span class="code-label">Create &ldquo;{query.trim()}&rdquo;</span>
          </button>
        {/if}

        {#if !showCreate && filtered.length === 0}
          <div class="palette-empty">No codes yet</div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .palette-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 20vh;
    animation: backdropIn var(--duration-fast) var(--ease-out);
  }

  .palette {
    width: min(640px, calc(100vw - var(--space-8)));
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-overlay);
    backdrop-filter: blur(12px);
    overflow: hidden;
    animation: paletteIn var(--duration-base) var(--ease-out);
  }

  .palette-input-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--theme-border-subtle);
  }

  .palette-input-row :global(.palette-search-icon) {
    color: var(--theme-text-faint);
    flex-shrink: 0;
  }

  .palette-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: var(--font-ui);
    font-size: var(--ui-font-sm);
    color: var(--theme-text);
    caret-color: var(--theme-accent);
  }

  .palette-input::placeholder {
    color: var(--theme-text-faint);
  }

  .palette-hint {
    font-family: var(--font-mono);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    background: var(--theme-bg);
    border: 1px solid var(--theme-border);
    border-radius: 3px;
    padding: 1px var(--space-1);
    line-height: 1.4;
    flex-shrink: 0;
  }

  .palette-results {
    max-height: calc(var(--target-min) * 8 + var(--space-2));
    overflow-y: auto;
    padding: var(--space-1);
  }

  .palette-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    transition: background var(--duration-fast) var(--ease-out);
    text-align: left;
    width: 100%;
    min-height: var(--target-min);
  }

  .palette-item:hover {
    background: var(--theme-bg-hover);
  }

  .palette-item:active {
    background: var(--theme-bg-active);
  }

  .palette-item.focused {
    background: var(--theme-bg-hover);
    outline: none;
    box-shadow: inset 0 0 0 1px var(--theme-accent);
  }

  .code-swatch {
    width: calc(0.5rem * var(--ql-scale));
    height: calc(0.5rem * var(--ql-scale));
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 6px currentColor;
  }

  .code-label {
    flex: 1;
    font-size: var(--ui-font-sm);
    color: var(--theme-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .palette-item:hover .code-label,
  .palette-item.focused .code-label {
    color: var(--theme-text);
  }

  .code-key {
    font-family: var(--font-mono);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    background: var(--theme-bg);
    border: 1px solid var(--theme-border);
    border-radius: 3px;
    padding: 1px var(--space-1);
    line-height: 1.4;
    flex-shrink: 0;
  }

  .create-plus {
    width: calc(0.5rem * var(--ql-scale));
    text-align: center;
    font-size: var(--ui-font-sm);
    color: var(--theme-accent);
    flex-shrink: 0;
    font-weight: 600;
  }

  .create-item .code-label {
    color: var(--theme-accent);
  }

  .palette-empty {
    padding: var(--space-4) var(--space-3);
    text-align: center;
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
  }

  @keyframes backdropIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes paletteIn {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
