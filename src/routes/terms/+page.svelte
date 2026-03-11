<svelte:head>
  <title>Terms — ogio Quali</title>
</svelte:head>

<article class="legal">
  <header class="legal-header">
    <h1>Terms of Use</h1>
    <p class="effective">Effective March 2026</p>
  </header>

  <section>
    <h2>The short version</h2>
    <p>
      ogio Quali is free, open-source software under the
      <a href="https://opensource.org/licenses/MIT" class="link">MIT License</a>.
      Your data is yours. We make no warranties. Use it at your own risk.
    </p>
  </section>

  <section>
    <h2>License</h2>
    <p>
      ogio Quali is distributed under the MIT License. You are free to use, copy,
      modify, merge, publish, distribute, sublicense, and/or sell copies of the
      software, subject to the license terms. The full license text is available in
      the <a href="https://github.com/ogio3/quali-lite/blob/main/LICENSE" class="link">repository</a>.
    </p>
  </section>

  <section>
    <h2>Your data</h2>
    <p>
      You retain all rights, title, and interest in your data. The tool claims no
      ownership over your research data, codebooks, analytical outputs, or any
      content you create. Your intellectual property is entirely your own.
    </p>
  </section>

  <section>
    <h2>No warranty</h2>
    <p>
      The software is provided "as is", without warranty of any kind, express or
      implied. To the maximum extent permitted by applicable law, the developers
      shall not be liable for any claim, damages, or other liability arising from
      the use of the software.
    </p>
    <p>
      This includes, but is not limited to, data loss, research delays, or
      interruptions caused by software defects or browser storage limitations.
    </p>
  </section>

  <section>
    <h2>Data responsibility</h2>
    <p>
      ogio Quali stores data exclusively in your browser's local storage (IndexedDB).
      We do not operate servers or cloud storage. Therefore:
    </p>
    <ul>
      <li>Backup is 100% your responsibility</li>
      <li>Clearing browser data will delete your projects</li>
      <li>We cannot recover lost data under any circumstances</li>
    </ul>
    <p>
      We strongly recommend regular backups using the built-in export feature.
    </p>
  </section>

  <section>
    <h2>Institutional use</h2>
    <p>
      ogio Quali operates locally and does not conflict with institutional data
      governance policies. University IT departments may evaluate the tool without
      security review concerns, as no data leaves the device and no network
      infrastructure is required.
    </p>
  </section>

  <section>
    <h2>Export and interoperability</h2>
    <p>
      ogio Quali supports data export in JSON format. We are committed to open data
      formats and plan to support the REFI-QDA standard (.qdpx) for interoperability
      with NVivo, ATLAS.ti, and MAXQDA.
    </p>
    <p>
      You are never locked in. Your data can always be exported.
    </p>
  </section>

  <section>
    <h2>Changes to these terms</h2>
    <p>
      We may update these terms to reflect changes in the software. Updates will
      be posted on this page with a revised effective date.
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
