<script lang="ts">
  let showPopup = $state(false);
  let copied = $state('');

  const year = new Date().getFullYear();

  const apa = `Oginome, T. (${year}). ogio Quali (Version 0.1.0) [Computer software]. https://ogio.dev/quali`;

  const bibtex = `@software{ogio_quali_${year},
  author = {Oginome, Tomohito},
  title = {ogio Quali},
  year = {${year}},
  version = {0.1.0},
  url = {https://ogio.dev/quali},
  note = {Open-source, client-side qualitative data analysis tool}
}`;

  const methods = `Transcripts were coded and analyzed using ogio Quali (Version 0.1.0; Oginome, ${year}), a free and open-source qualitative data analysis tool. To ensure strict confidentiality of IRB-approved data, all analysis was performed entirely offline on the researcher's local machine, leveraging the software's client-side architecture.`;

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    copied = label;
    setTimeout(() => { if (copied === label) copied = ''; }, 2000);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') showPopup = false;
  }
</script>

<svelte:window onkeydown={showPopup ? handleKeydown : undefined} />

<div class="cite-wrapper">
  <button class="cite-trigger" onclick={() => showPopup = !showPopup}>
    Cite this tool
  </button>

  {#if showPopup}
    <div class="cite-backdrop" onclick={() => showPopup = false} role="presentation"></div>
    <div class="cite-popup" role="dialog" aria-label="Citation formats">
      <h3 class="cite-heading">Citation</h3>

      <div class="cite-section">
        <div class="cite-label">
          <span>APA 7th</span>
          <button class="cite-copy" onclick={() => copy(apa, 'apa')}>
            {copied === 'apa' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre class="cite-block">{apa}</pre>
      </div>

      <div class="cite-section">
        <div class="cite-label">
          <span>BibTeX</span>
          <button class="cite-copy" onclick={() => copy(bibtex, 'bibtex')}>
            {copied === 'bibtex' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre class="cite-block">{bibtex}</pre>
      </div>

      <div class="cite-section">
        <div class="cite-label">
          <span>Methods section</span>
          <button class="cite-copy" onclick={() => copy(methods, 'methods')}>
            {copied === 'methods' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre class="cite-block cite-methods">{methods}</pre>
      </div>
    </div>
  {/if}
</div>

<style>
  .cite-wrapper {
    position: relative;
    display: inline-block;
  }

  .cite-trigger {
    font-size: var(--ui-font-xs);
    color: var(--theme-text-faint);
    cursor: pointer;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .cite-trigger:hover {
    color: var(--theme-text-muted);
  }

  .cite-backdrop {
    position: fixed;
    inset: 0;
    z-index: 99;
  }

  .cite-popup {
    position: absolute;
    bottom: calc(100% + var(--space-2));
    left: 50%;
    transform: translateX(-50%);
    width: min(28rem, 90vw);
    background: var(--theme-bg-elevated);
    border: 1px solid var(--theme-border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    z-index: 100;
    box-shadow: 0 8px 32px oklch(0% 0 0 / 0.3);
  }

  .cite-heading {
    font-family: var(--font-body);
    font-size: var(--ui-font-base);
    font-weight: var(--font-weight-medium);
    color: var(--theme-text);
    margin-bottom: var(--space-4);
  }

  .cite-section {
    margin-bottom: var(--space-4);
  }

  .cite-section:last-child {
    margin-bottom: 0;
  }

  .cite-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-1);
    font-size: var(--ui-font-xs);
    color: var(--theme-text-muted);
    font-weight: var(--font-weight-medium);
  }

  .cite-copy {
    font-size: var(--ui-font-xs);
    color: var(--theme-accent);
    cursor: pointer;
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  .cite-copy:hover {
    opacity: 0.8;
  }

  .cite-block {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    line-height: 1.5;
    color: var(--theme-text-secondary);
    background: var(--theme-bg);
    border: 1px solid var(--theme-border-subtle);
    border-radius: var(--radius-sm);
    padding: var(--space-3);
    white-space: pre-wrap;
    word-break: break-word;
    overflow: hidden;
    margin: 0;
  }

  .cite-methods {
    font-family: var(--font-reading);
    font-size: var(--ui-font-xs);
    font-style: italic;
  }
</style>
