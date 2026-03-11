<script lang="ts">
  import { ui } from '$lib/state.svelte';
</script>

{#if ui.toast}
  <div class="toast" class:error={ui.toast.type === 'error'} class:success={ui.toast.type === 'success'}>
    {ui.toast.message}
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: var(--bg-elevated);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 8px 20px;
    font-size: 13px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    animation: slideUp 200ms ease;
  }
  .toast.error {
    border-color: var(--danger);
    color: var(--danger);
  }
  .toast.success {
    border-color: var(--success);
    color: var(--success);
  }
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(8px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
</style>
