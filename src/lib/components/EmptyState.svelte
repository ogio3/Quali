<div class="empty">
  <div class="empty-content">
    <h2>Quali-Lite</h2>
    <p>Qualitative coding in your browser.</p>
    <p class="subtle">Your data never leaves your browser.</p>
    <div class="instructions">
      <div class="step">Create a project in the sidebar</div>
      <div class="step">Drop text files to import documents</div>
      <div class="step">Select text and assign codes</div>
    </div>
    <div class="shortcuts">
      <kbd>1</kbd>–<kbd>9</kbd> Quick assign &nbsp;
      <kbd>⌘</kbd><kbd>Z</kbd> Undo
    </div>
  </div>
</div>

<style>
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
  }
  .empty-content {
    text-align: center;
    max-width: 360px;
  }
  h2 {
    font-size: 24px;
    font-weight: 300;
    letter-spacing: 0.04em;
    color: var(--text);
    margin-bottom: 8px;
  }
  p {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }
  .subtle {
    font-size: 12px;
    color: var(--text-faint);
    margin-bottom: 32px;
  }
  .instructions {
    text-align: left;
    margin: 0 auto 24px;
    max-width: 280px;
  }
  .step {
    font-size: 13px;
    color: var(--text-muted);
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
  }
  .step:last-child {
    border-bottom: none;
  }
  .shortcuts {
    font-size: 12px;
    color: var(--text-faint);
  }
  kbd {
    display: inline-block;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1px 5px;
    font-family: var(--font-mono);
    font-size: 11px;
    line-height: 18px;
  }
</style>
