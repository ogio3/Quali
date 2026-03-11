<script lang="ts">
  import { browser } from '$app/environment';
  import { IconMoon, IconSun, IconSettings } from './icons';

  type Density = 'default' | 'comfortable' | 'high';

  let theme = $state<'dark' | 'light'>(
    browser
      ? (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') ?? 'dark'
      : 'dark'
  );

  let density = $state<Density>(
    browser
      ? (document.documentElement.getAttribute('data-density') as Density) ?? 'default'
      : 'default'
  );

  let open = $state(false);
  let panelEl: HTMLDivElement | undefined = $state();

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ql-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f4f1ea' : '#1a1d24');
  }

  function setDensity(d: Density) {
    density = d;
    if (d === 'default') {
      document.documentElement.removeAttribute('data-density');
    } else {
      document.documentElement.setAttribute('data-density', d);
    }
    localStorage.setItem('ql-density', d);
  }

  // Close panel on outside click
  $effect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelEl && !panelEl.contains(e.target as Node)) {
        open = false;
      }
    }
    // Delay to avoid catching the opening click
    const timer = setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClick);
    };
  });

  // Close on Escape
  $effect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        open = false;
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  });

  const densityOptions: { value: Density; label: string; desc: string }[] = [
    { value: 'default', label: 'Default', desc: 'Standard density' },
    { value: 'comfortable', label: 'Comfortable', desc: 'Larger text & targets' },
    { value: 'high', label: 'High Visibility', desc: 'Maximum readability' },
  ];
</script>

<div class="settings-anchor" bind:this={panelEl}>
  {#if open}
    <div class="settings-panel" role="dialog" aria-label="Display settings">
      <!-- Theme -->
      <div class="setting-group">
        <span class="setting-label">Theme</span>
        <div class="theme-row">
          <button
            class="theme-option"
            class:active={theme === 'dark'}
            onclick={() => { if (theme !== 'dark') toggleTheme(); }}
            aria-pressed={theme === 'dark'}
          >
            <IconMoon />
            Dark
          </button>
          <button
            class="theme-option"
            class:active={theme === 'light'}
            onclick={() => { if (theme !== 'light') toggleTheme(); }}
            aria-pressed={theme === 'light'}
          >
            <IconSun />
            Light
          </button>
        </div>
      </div>

      <!-- Density -->
      <div class="setting-group">
        <span class="setting-label">Display</span>
        <div class="density-list">
          {#each densityOptions as opt}
            <button
              class="density-option"
              class:active={density === opt.value}
              onclick={() => setDensity(opt.value)}
              aria-pressed={density === opt.value}
            >
              <span class="density-name">{opt.label}</span>
              <span class="density-desc">{opt.desc}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <button
    class="settings-fab"
    onclick={() => open = !open}
    title="Display settings"
    aria-label="Display settings"
    aria-expanded={open}
  >
    <IconSettings />
  </button>
</div>

<style>
  .settings-anchor {
    position: fixed;
    bottom: var(--space-5);
    right: var(--space-5);
    z-index: 900;
  }

  .settings-fab {
    width: var(--target-min);
    height: var(--target-min);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-full);
    color: var(--theme-text-faint);
    cursor: pointer;
    transition: color var(--duration-base) var(--ease-out),
                border-color var(--duration-base) var(--ease-out),
                box-shadow var(--duration-base) var(--ease-out);
    box-shadow: var(--shadow-sm);
  }

  .settings-fab:hover {
    color: var(--theme-text-secondary);
    border-color: var(--theme-text-faint);
  }

  .settings-fab:active {
    transform: scale(0.95);
  }

  /* Panel */
  .settings-panel {
    position: absolute;
    bottom: calc(var(--target-min) + var(--space-2));
    right: 0;
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    min-width: calc(13rem * var(--ql-scale));
    box-shadow: var(--shadow-overlay);
    animation: panelIn var(--duration-base) var(--ease-out);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .setting-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .setting-label {
    font-size: var(--ui-font-xs);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--theme-text-muted);
  }

  /* Theme toggle row */
  .theme-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-1);
  }

  .theme-option {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-2);
    min-height: var(--target-min);
    border-radius: var(--radius-md);
    font-size: var(--ui-font-sm);
    color: var(--theme-text-muted);
    border: 1px solid var(--theme-border-subtle);
    transition: all var(--duration-fast) var(--ease-out);
    cursor: pointer;
  }

  .theme-option:hover {
    background: var(--theme-bg-hover);
    color: var(--theme-text-secondary);
  }

  .theme-option.active {
    background: var(--theme-bg-active);
    color: var(--theme-text);
    border-color: var(--theme-accent);
  }

  /* Density list */
  .density-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .density-option {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: var(--space-2) var(--space-3);
    min-height: var(--target-min);
    border-radius: var(--radius-md);
    border: 1px solid var(--theme-border-subtle);
    transition: all var(--duration-fast) var(--ease-out);
    cursor: pointer;
    text-align: left;
    width: 100%;
  }

  .density-option:hover {
    background: var(--theme-bg-hover);
  }

  .density-option.active {
    background: var(--theme-bg-active);
    border-color: var(--theme-accent);
  }

  .density-name {
    font-size: var(--ui-font-sm);
    font-weight: var(--font-weight-medium);
    color: var(--theme-text-secondary);
  }

  .density-option.active .density-name {
    color: var(--theme-text);
  }

  .density-desc {
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
  }

  .density-option.active .density-desc {
    color: var(--theme-text-muted);
  }

  @keyframes panelIn {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
