<script lang="ts">
  import { onMount } from 'svelte';
  import { dispatch } from '$lib/keyboard';
  import { dataTrust } from '$lib/state.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import '../app.css';

  let { children } = $props();

  function handleKeydown(e: KeyboardEvent) {
    dispatch(e);
  }

  onMount(() => {
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
{@render children()}
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
</style>
