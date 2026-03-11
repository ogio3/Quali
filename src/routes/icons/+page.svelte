<script lang="ts">
  const modules = import.meta.glob('$lib/components/icons/Icon*.svelte', { eager: true }) as Record<string, { default: typeof import('svelte').SvelteComponent }>;

  const icons = Object.entries(modules).map(([path, mod]) => ({
    name: path.split('/').pop()!.replace('.svelte', ''),
    component: mod.default,
  }));

  let copied = $state('');

  function copyImport(name: string) {
    const text = `import { ${name} } from '$lib/components/icons';`;
    navigator.clipboard.writeText(text);
    copied = name;
    setTimeout(() => { if (copied === name) copied = ''; }, 1500);
  }
</script>

<svelte:head>
  <title>Icons — ogio Design System</title>
</svelte:head>

<div class="catalog">
  <header class="catalog-header">
    <h1>ogio Icons</h1>
    <p class="spec">16×16 · stroke 1.5 · round · currentColor</p>
    <p class="count">{icons.length} icons</p>
  </header>

  <div class="grid">
    {#each icons as { name, component }}
      <button
        class="icon-card"
        class:copied={copied === name}
        onclick={() => copyImport(name)}
        title="Copy import"
      >
        <div class="icon-preview">
          <svelte:component this={component} size="24" />
        </div>
        <span class="icon-name">{name.replace('Icon', '')}</span>
        {#if copied === name}
          <span class="icon-copied">Copied</span>
        {/if}
      </button>
    {/each}
  </div>

  <footer class="catalog-footer">
    <code>import {'{ IconName }'} from '$lib/components/icons';</code>
  </footer>
</div>

<style>
  .catalog {
    max-width: 48rem;
    margin: 0 auto;
    padding: var(--space-8) var(--space-6);
  }

  .catalog-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }

  .catalog-header h1 {
    font-family: var(--font-body);
    font-size: calc(1.5rem * var(--ql-scale));
    font-weight: var(--font-weight-normal);
    color: var(--theme-text);
    letter-spacing: 0.04em;
    margin-bottom: var(--space-2);
  }

  .spec {
    font-family: var(--font-mono);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    letter-spacing: 0.05em;
  }

  .count {
    font-size: var(--ui-font-xs);
    color: var(--theme-text-muted);
    margin-top: var(--space-1);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    gap: var(--space-2);
  }

  .icon-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4) var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid var(--theme-border-subtle);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    position: relative;
  }

  .icon-card:hover {
    background: var(--theme-bg-hover);
    border-color: var(--theme-border);
  }

  .icon-card.copied {
    border-color: var(--theme-accent);
  }

  .icon-preview {
    color: var(--theme-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
  }

  .icon-card:hover .icon-preview {
    color: var(--theme-text);
  }

  .icon-name {
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    text-align: center;
    word-break: break-all;
  }

  .icon-copied {
    position: absolute;
    top: var(--space-1);
    right: var(--space-1);
    font-size: 0.6rem;
    color: var(--theme-accent);
    font-weight: var(--font-weight-medium);
  }

  .catalog-footer {
    margin-top: var(--space-8);
    text-align: center;
  }

  .catalog-footer code {
    font-family: var(--font-mono);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-muted);
    background: var(--theme-bg-elevated);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    border: 1px solid var(--theme-border-subtle);
  }
</style>
