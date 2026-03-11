<script lang="ts">
  import { selection } from '$lib/state.svelte';
  import type { Code } from '$lib/db';

  let { codes, onassign }: {
    codes: Code[];
    onassign: (codeId: string) => void;
  } = $props();

  let focusedIndex = $state(0);
  let overlayEl: HTMLDivElement | undefined = $state();

  let style = $derived.by(() => {
    if (!selection.anchorRect) return '';
    const rect = selection.anchorRect;
    const top = rect.bottom + window.scrollY + 10;
    const left = rect.left + window.scrollX;
    return `top:${top}px;left:${left}px`;
  });

  // Reset focus index when overlay opens
  $effect(() => {
    if (selection.active && codes.length > 0) {
      focusedIndex = 0;
    }
  });

  function handleOverlayKeydown(e: KeyboardEvent) {
    if (!selection.active || codes.length === 0) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        selection.active = false;
        window.getSelection()?.removeAllRanges();
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusedIndex = (focusedIndex + 1) % codes.length;
        focusButton();
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusedIndex = (focusedIndex - 1 + codes.length) % codes.length;
        focusButton();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (codes[focusedIndex]) onassign(codes[focusedIndex].id);
        break;
      case 'Tab':
        // Trap focus inside overlay
        e.preventDefault();
        focusedIndex = e.shiftKey
          ? (focusedIndex - 1 + codes.length) % codes.length
          : (focusedIndex + 1) % codes.length;
        focusButton();
        break;
    }
  }

  function focusButton() {
    const btns = overlayEl?.querySelectorAll('.code-btn');
    if (btns?.[focusedIndex]) (btns[focusedIndex] as HTMLElement).focus();
  }
</script>

{#if selection.active && codes.length > 0}
  <div
    class="overlay"
    style={style}
    bind:this={overlayEl}
    onkeydown={handleOverlayKeydown}
    role="listbox"
    tabindex="0"
    aria-label="Assign code to selection"
  >
    <div class="overlay-inner">
      {#each codes as code, i}
        <button
          class="code-btn"
          class:focused={focusedIndex === i}
          onclick={() => onassign(code.id)}
          title={code.shortcut ? `${code.name} [${code.shortcut}]` : code.name}
          role="option"
          aria-selected={focusedIndex === i}
        >
          <span class="code-swatch" style="background:{code.color}" aria-hidden="true"></span>
          <span class="code-label">{code.name}</span>
          {#if code.shortcut}
            <kbd class="code-key" aria-label="Shortcut {code.shortcut}">{code.shortcut}</kbd>
          {/if}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    z-index: 100;
    animation: overlayIn var(--duration-base) var(--ease-out);
  }

  .overlay-inner {
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-lg);
    padding: var(--space-1);
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: calc(11.25rem * var(--ql-scale));
    max-width: calc(16.25rem * var(--ql-scale));
    box-shadow: var(--shadow-overlay);
    backdrop-filter: blur(12px);
  }

  .code-btn {
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

  .code-btn:hover {
    background: var(--theme-bg-hover);
  }

  .code-btn:active {
    background: var(--theme-bg-active);
  }

  .code-btn.focused,
  .code-btn:focus-visible {
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

  .code-btn:hover .code-label {
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

  @keyframes overlayIn {
    from {
      opacity: 0;
      transform: translateY(4px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
