<svelte:head>
  <title>Accessibility — ogio Quali</title>
</svelte:head>

<article class="legal">
  <header class="legal-header">
    <h1>Accessibility</h1>
    <p class="effective">Last reviewed March 2026</p>
  </header>

  <section>
    <h2>Our commitment</h2>
    <p>
      ogio Quali is designed for all researchers. We aim for WCAG 2.2 Level AA
      conformance, with AAA where feasible. Accessibility is not an afterthought —
      it is a core design constraint.
    </p>
  </section>

  <section>
    <h2>Current status</h2>
    <div class="status-grid">
      <div class="status-item status-done">
        <span class="status-icon" aria-hidden="true"></span>
        <div>
          <strong>Keyboard navigation</strong>
          <p>All features accessible via keyboard. Shortcut keys 1–9 for code assignment.</p>
        </div>
      </div>
      <div class="status-item status-done">
        <span class="status-icon" aria-hidden="true"></span>
        <div>
          <strong>Color contrast</strong>
          <p>All text meets WCAG AA contrast ratios in both dark and light themes.</p>
        </div>
      </div>
      <div class="status-item status-done">
        <span class="status-icon" aria-hidden="true"></span>
        <div>
          <strong>Reduced motion</strong>
          <p>Respects <code>prefers-reduced-motion</code>. All animations are disabled when preferred.</p>
        </div>
      </div>
      <div class="status-item status-done">
        <span class="status-icon" aria-hidden="true"></span>
        <div>
          <strong>Semantic HTML</strong>
          <p>Landmark regions, heading hierarchy, ARIA labels on interactive elements.</p>
        </div>
      </div>
      <div class="status-item status-done">
        <span class="status-icon" aria-hidden="true"></span>
        <div>
          <strong>Dark and light themes</strong>
          <p>Follows <code>prefers-color-scheme</code> by default. Manual override available.</p>
        </div>
      </div>
      <div class="status-item status-wip">
        <span class="status-icon" aria-hidden="true"></span>
        <div>
          <strong>Screen reader optimization</strong>
          <p>ARIA live regions for coding actions. Testing with NVDA, VoiceOver, and JAWS.</p>
        </div>
      </div>
      <div class="status-item status-wip">
        <span class="status-icon" aria-hidden="true"></span>
        <div>
          <strong>High contrast mode</strong>
          <p><code>prefers-contrast</code> and <code>forced-colors</code> media query support.</p>
        </div>
      </div>
      <div class="status-item status-planned">
        <span class="status-icon" aria-hidden="true"></span>
        <div>
          <strong>Voice input</strong>
          <p>Code assignment via Web Speech API for motor-impaired researchers.</p>
        </div>
      </div>
    </div>
  </section>

  <section>
    <h2>Design for long reading sessions</h2>
    <p>
      Academic researchers read transcripts of 50,000+ characters for hours. Our
      typography system is designed for sustained reading comfort:
    </p>
    <ul>
      <li>Serif font (Source Serif 4) for document content — optimized for reading</li>
      <li>Generous line height (1.7) and comfortable font sizing</li>
      <li>Warm color temperature in both themes to reduce eye strain</li>
      <li>User-adjustable text density (default / comfortable / high)</li>
    </ul>
  </section>

  <section>
    <h2>Keyboard shortcuts</h2>
    <dl class="shortcut-list">
      <dt><kbd>1</kbd> – <kbd>9</kbd></dt>
      <dd>Quick-assign codes to selected text</dd>

      <dt><kbd>Cmd</kbd> + <kbd>Z</kbd></dt>
      <dd>Undo last action</dd>

      <dt><kbd>Cmd</kbd> + click</dt>
      <dd>Remove a code from a segment</dd>

      <dt><kbd>Escape</kbd></dt>
      <dd>Close overlay / cancel selection</dd>
    </dl>
  </section>

  <section>
    <h2>Standards</h2>
    <ul>
      <li><strong>WCAG 2.2</strong> — Level AA target, AAA where feasible</li>
      <li><strong>Section 508</strong> (US) — Federal accessibility requirements</li>
      <li><strong>EN 301 549</strong> (EU) — European ICT accessibility standard</li>
      <li><strong>JIS X 8341-3</strong> (Japan) — Web accessibility standard</li>
    </ul>
  </section>

  <section>
    <h2>Testing</h2>
    <p>
      We test with axe-core in our CI pipeline and perform manual testing with:
    </p>
    <ul>
      <li>VoiceOver (macOS/iOS)</li>
      <li>Keyboard-only navigation</li>
      <li>Browser zoom up to 200%</li>
      <li>Reduced motion preference</li>
    </ul>
  </section>

  <section>
    <h2>Report an issue</h2>
    <p>
      If you encounter an accessibility barrier, please
      <a href="https://github.com/ogio3/quali-lite/issues" class="link">open an issue</a>
      with the label <code>accessibility</code>. We treat accessibility bugs with the
      same priority as functional bugs.
    </p>
  </section>

  <footer class="legal-footer">
    <a href="/" class="link">Back to ogio Quali</a>
  </footer>
</article>

<style>
  .legal {
    max-width: 40rem;
    margin: 0 auto;
    padding: var(--space-12) var(--space-6);
    font-family: var(--font-reading);
    color: var(--theme-text-secondary);
    line-height: var(--leading-reading);
  }

  .legal-header {
    margin-bottom: var(--space-12);
  }

  .legal-header h1 {
    font-family: var(--font-body);
    font-size: calc(1.75rem * var(--ql-scale));
    font-weight: var(--font-weight-normal);
    letter-spacing: 0.04em;
    color: var(--theme-text);
    margin-bottom: var(--space-2);
  }

  .effective {
    font-size: var(--ui-font-sm);
    color: var(--theme-text-muted);
  }

  section {
    margin-bottom: var(--space-8);
  }

  h2 {
    font-family: var(--font-body);
    font-size: calc(1rem * var(--ql-scale));
    font-weight: var(--font-weight-medium);
    color: var(--theme-text);
    letter-spacing: 0.02em;
    margin-bottom: var(--space-3);
  }

  p {
    font-size: var(--doc-font-base);
    margin-bottom: var(--space-3);
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul {
    padding-left: var(--space-5);
    font-size: var(--doc-font-base);
  }

  li {
    margin-bottom: var(--space-1);
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.85em;
    background: var(--theme-bg-elevated);
    padding: 0.1em 0.3em;
    border-radius: var(--radius-sm);
  }

  .status-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .status-item {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--theme-border-subtle);
  }

  .status-item strong {
    display: block;
    font-size: var(--ui-font-sm);
    font-weight: var(--font-weight-medium);
    color: var(--theme-text);
    margin-bottom: var(--space-1);
  }

  .status-item p {
    font-size: var(--ui-font-xs);
    color: var(--theme-text-muted);
    margin: 0;
  }

  .status-icon {
    flex-shrink: 0;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    margin-top: 0.4rem;
  }

  .status-done .status-icon {
    background: oklch(0.72 0.15 145);
  }

  .status-wip .status-icon {
    background: oklch(0.75 0.15 75);
  }

  .status-planned .status-icon {
    background: var(--theme-text-faint);
  }

  .shortcut-list {
    font-size: var(--doc-font-base);
  }

  .shortcut-list dt {
    font-weight: var(--font-weight-normal);
    margin-top: var(--space-3);
  }

  .shortcut-list dd {
    margin-left: 0;
    color: var(--theme-text-muted);
    font-size: var(--ui-font-sm);
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

  .link {
    color: var(--theme-accent);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .link:hover {
    border-bottom-color: var(--theme-accent);
  }

  .legal-footer {
    margin-top: var(--space-12);
    padding-top: var(--space-6);
    border-top: 1px solid var(--theme-border-subtle);
    font-size: var(--ui-font-sm);
  }
</style>
