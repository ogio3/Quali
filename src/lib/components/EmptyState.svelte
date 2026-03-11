<script lang="ts">
  import { IconShield } from './icons';
  import CiteButton from './CiteButton.svelte';
</script>

<div class="empty">
  <div class="empty-content">
    <div class="brand">
      <h1 class="brand-name">ogio Quali</h1>
      <p class="brand-tagline">Qualitative coding in your browser</p>
    </div>

    <div class="trust-line">
      <IconShield />
      <span>Your data never leaves your browser</span>
    </div>

    <div class="steps">
      <div class="step">
        <span class="step-num">1</span>
        <span class="step-text">Create a project in the sidebar</span>
      </div>
      <div class="step">
        <span class="step-num">2</span>
        <span class="step-text">Drop text files to import documents</span>
      </div>
      <div class="step">
        <span class="step-num">3</span>
        <span class="step-text">Select text and assign codes</span>
      </div>
    </div>

    <div class="shortcuts">
      <div class="shortcut-item">
        <kbd>1</kbd><span class="shortcut-sep">–</span><kbd>9</kbd>
        <span class="shortcut-label">Quick assign</span>
      </div>
      <div class="shortcut-item">
        <kbd>⌘</kbd><kbd>Z</kbd>
        <span class="shortcut-label">Undo</span>
      </div>
      <div class="shortcut-item">
        <kbd>⌘</kbd><span class="shortcut-sep">+</span><span class="shortcut-label">click to remove</span>
      </div>
    </div>

    <div class="colophon">
      Free forever · Open source · No tracking
    </div>

    <nav class="legal-links" aria-label="Legal">
      <a href="/privacy">Privacy</a>
      <span class="legal-sep">·</span>
      <a href="/terms">Terms</a>
      <span class="legal-sep">·</span>
      <a href="/accessibility">Accessibility</a>
      <span class="legal-sep">·</span>
      <CiteButton />
    </nav>
  </div>
</div>

<style>
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: var(--space-12);
  }

  .empty-content {
    text-align: center;
    max-width: 24rem;
  }

  .brand {
    margin-bottom: var(--space-10);
  }

  .brand-name {
    font-family: var(--font-body);
    font-size: calc(1.75rem * var(--ql-scale));
    font-weight: var(--font-weight-normal);
    letter-spacing: 0.04em;
    color: var(--theme-text);
    margin-bottom: var(--space-2);
  }

  .brand-tagline {
    font-size: var(--ui-font-md);
    font-weight: var(--font-weight-normal);
    color: var(--theme-text-secondary);
    letter-spacing: 0.02em;
  }

  .trust-line {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--ui-font-sm);
    color: var(--theme-text-muted);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-full);
    margin-bottom: var(--space-10);
  }

  .steps {
    text-align: left;
    margin: 0 auto var(--space-8);
    max-width: 18rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .step {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--theme-border);
  }

  .step:last-child {
    border-bottom: none;
  }

  .step-num {
    font-family: var(--font-body);
    font-size: var(--ui-font-lg);
    color: var(--theme-accent);
    width: 1.25rem;
    text-align: center;
    flex-shrink: 0;
  }

  .step-text {
    font-size: var(--ui-font-base);
    color: var(--theme-text-secondary);
    letter-spacing: 0.01em;
  }

  .shortcuts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-10);
  }

  .shortcut-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-muted);
  }

  .shortcut-sep {
    color: var(--theme-text-muted);
    opacity: 0.5;
  }

  .shortcut-label {
    margin-left: var(--space-2);
    font-weight: var(--font-weight-normal);
  }

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.25rem;
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-sm);
    padding: 0 var(--space-1);
    font-family: var(--font-mono);
    font-size: var(--ui-font-xs);
    line-height: 1;
    color: var(--theme-text-muted);
  }

  .colophon {
    font-size: var(--ui-font-xs);
    font-weight: var(--font-weight-normal);
    letter-spacing: 0.08em;
    color: var(--theme-text-faint);
  }

  .legal-links {
    margin-top: var(--space-3);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
  }

  .legal-links a {
    color: var(--theme-text-faint);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .legal-links a:hover {
    color: var(--theme-text-muted);
  }

  .legal-sep {
    margin: 0 var(--space-1);
    opacity: 0.5;
  }
</style>
