<script lang="ts">
  import { onMount } from 'svelte';
  import { dispatch } from '$lib/keyboard';
  import { dataTrust, showToast } from '$lib/state.svelte';
  import { db } from '$lib/db';
  import Toast from '$lib/components/Toast.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import '../app.css';

  let { children } = $props();
  let dbReady = $state(true);

  function handleKeydown(e: KeyboardEvent) {
    dispatch(e);
  }

  onMount(() => {
    // Verify IndexedDB is available
    db.open().catch(() => {
      dbReady = false;
      showToast('Storage unavailable. Try a regular browser window.', 'error');
    });

    // Request persistent storage (fire-and-forget)
    if (navigator.storage?.persist) {
      navigator.storage.persist();
    }

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (dataTrust.changesSinceBackup > 0) {
        e.preventDefault();
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<a href="#main-content" class="skip-link">Skip to content</a>

<Toast />
{#if dbReady}
  {@render children()}
{:else}
  <div class="db-error">
    <h1>Storage Unavailable</h1>
    <p>Quali needs browser storage (IndexedDB) to work.</p>
    <p>This often happens in private/incognito browsing mode.</p>
    <p>Please try a regular browser window.</p>
  </div>
{/if}
<ThemeToggle />

<style>
  .skip-link {
    position: absolute;
    top: -100%;
    left: 16px;
    z-index: 9999;
    background: var(--theme-bg-elevated);
    color: var(--theme-text);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-md);
    padding: 8px 16px;
    font-size: 13px;
    font-family: var(--font-ui);
    text-decoration: none;
    transition: top 150ms ease;
  }

  .skip-link:focus {
    top: 12px;
  }

  .db-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 0.5rem;
    text-align: center;
    color: var(--theme-text-muted);
    font-family: var(--font-ui);
    padding: 2rem;
  }

  .db-error h1 {
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--theme-text);
    margin-bottom: 0.5rem;
  }

  .db-error p {
    font-size: 0.875rem;
    line-height: 1.6;
  }
</style>
