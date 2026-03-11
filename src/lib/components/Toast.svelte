<script lang="ts">
  import { ui } from '$lib/state.svelte';
</script>

<div class="toast-region" role="status" aria-live="polite" aria-atomic="true">
  {#if ui.toast}
    <div class="toast" class:error={ui.toast.type === 'error'} class:success={ui.toast.type === 'success'}>
      <span class="toast-text">{ui.toast.message}</span>
    </div>
  {/if}
</div>

<style>
  .toast-region {
    position: fixed;
    bottom: var(--space-8);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    pointer-events: none;
  }

  .toast {
    pointer-events: auto;
    background: var(--theme-bg-elevated);
    color: var(--theme-text-secondary);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-lg);
    padding: var(--space-2) var(--space-5);
    font-size: var(--ui-font-sm);
    font-weight: var(--font-weight-normal);
    letter-spacing: 0.02em;
    box-shadow: var(--shadow-lg);
    animation: toastIn var(--duration-slow) var(--ease-out);
  }

  .toast.error {
    border-color: color-mix(in srgb, var(--theme-danger) 40%, transparent);
    color: var(--theme-danger);
  }

  .toast.success {
    border-color: color-mix(in srgb, var(--theme-success) 30%, transparent);
    color: var(--theme-success);
  }

  .toast-text {
    display: block;
  }

  @keyframes toastIn {
    0% {
      transform: translateY(12px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
