<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="error-page">
  <h1>{$page.status}</h1>
  <p>{$page.error?.message ?? 'Something went wrong'}</p>
  <a href="/">Back to Quali</a>
</div>

<style>
  .error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: var(--space-4, 1rem);
    color: var(--theme-text, #e6e1d6);
    background: var(--theme-bg, #0d1117);
    font-family: var(--font-ui, system-ui);
  }

  h1 {
    font-size: 3rem;
    font-weight: 300;
    opacity: 0.4;
  }

  p {
    font-size: 1rem;
    color: var(--theme-text-muted, #8b949e);
  }

  a {
    margin-top: var(--space-4, 1rem);
    font-size: 0.875rem;
    color: var(--theme-accent, #c4a265);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 200ms;
  }

  a:hover {
    border-bottom-color: currentColor;
  }
</style>
