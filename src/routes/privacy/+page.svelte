<svelte:head>
  <title>Privacy — ogio Quali</title>
</svelte:head>

<article class="legal">
  <header class="legal-header">
    <h1>Privacy</h1>
    <p class="effective">Effective March 2026</p>
  </header>

  <section>
    <h2>The short version</h2>
    <p>
      ogio Quali runs entirely in your browser. Your data never leaves your device.
      We have no servers, no accounts, no analytics. There is nothing to collect.
    </p>
  </section>

  <section>
    <h2>Zero telemetry policy</h2>
    <p>
      We do not collect usage statistics, crash reports, IP addresses, or any
      identifiable information. No Google Analytics, no Sentry, no hidden trackers.
      You can verify this yourself by inspecting the
      <a href="https://github.com/ogio3/Quali" class="link">source code</a>
      or monitoring network traffic in your browser's DevTools.
    </p>
  </section>

  <section>
    <h2>Data architecture</h2>
    <p>
      All research data — projects, documents, codes, and coded segments — is stored
      in your browser's IndexedDB. The software operates entirely client-side as a
      Progressive Web App (PWA). It functions fully offline, with no external network
      requests.
    </p>
    <p>
      We are not a data controller or data processor under GDPR (Art. 28). You are
      the sole controller of your data. Because data never crosses a network boundary,
      cross-border data transfer requirements (GDPR Chapter V) do not apply.
    </p>
  </section>

  <section>
    <h2>Legal position</h2>
    <p>
      Because all data remains exclusively on your device, the developer is neither
      a "data controller" nor a "data processor" under any major data protection
      framework. The software is a tool — like a pen or a calculator. You, the
      researcher, are the sole controller of your data.
    </p>
    <p>
      Per EDPB Guidelines 07/2020 (paragraph 85), a provider of standard software
      that does not access user data is not a processor.
    </p>
  </section>

  <section>
    <h2>Regulatory compliance by jurisdiction</h2>

    <h3>European Union / EEA</h3>
    <dl class="compliance-list">
      <dt>GDPR</dt>
      <dd>The developer does not process personal data (Art. 4(2)). Data minimization
        (Art. 5) is achieved by design. No cross-border data transfer occurs (Art. 44–49).
        Privacy by Design (Art. 25 / Recital 78) is inherent to the local-first architecture.
        No cookie consent banner required — IndexedDB storage is strictly necessary for
        service delivery (ePrivacy Directive Art. 5(3)). Schrems II transfer mechanisms
        (SCC) are not required as no data leaves your device.</dd>

      <dt>ePrivacy Directive (2002/58/EC)</dt>
      <dd>Local storage (IndexedDB) used by ogio Quali falls under the "strictly
        necessary" exemption — it is the core function of the tool, not tracking.</dd>

      <dt>DMA / DSA</dt>
      <dd>Not applicable. ogio Quali is not an intermediary service or gatekeeper.</dd>

      <dt>Germany (BDSG), France (CNIL), Nordic countries</dt>
      <dd>National implementations follow GDPR. CNIL cookie guidelines confirm that
        local storage essential for service delivery is consent-exempt.</dd>
    </dl>

    <h3>United States</h3>
    <dl class="compliance-list">
      <dt>FERPA</dt>
      <dd>No student education records are transmitted to third parties. Using a
        local tool does not constitute "disclosure" under FERPA.</dd>

      <dt>HIPAA</dt>
      <dd>ogio Quali is not a covered entity or business associate. No protected
        health information is received by the developer.</dd>

      <dt>COPPA</dt>
      <dd>Not applicable — no data is collected from any user, including children.</dd>

      <dt>State privacy laws (CCPA/CPRA, VCDPA, CPA, CTDPA, TDPSA, OCPA, etc.)</dt>
      <dd>Under CCPA Civil Code § 1798.140(c), "collection" means acquiring or
        accessing personal information. Data remains in your browser — the developer
        never acquires or accesses it.</dd>
    </dl>

    <h3>China</h3>
    <dl class="compliance-list">
      <dt>PIPL (Art. 73) / CSL / DSL</dt>
      <dd>The developer is not a "Personal Information Handler" (个人信息处理者) as
        defined in PIPL Art. 73 — we do not determine the purpose or means of
        processing your data. No CAC security assessment or standard contract is
        required as no cross-border data transfer occurs. No ICP license needed as
        we do not host servers in China.</dd>
    </dl>

    <h3>Japan</h3>
    <dl class="compliance-list">
      <dt>APPI (2022 amendment, Art. 16)</dt>
      <dd>The developer is not a "Personal Information Handling Business Operator"
        (個人情報取扱事業者) as we do not maintain or manage any database containing
        your personal data. No third-party provision (第三者提供) occurs.</dd>
    </dl>

    <h3>South Korea</h3>
    <dl class="compliance-list">
      <dt>PIPA (2023 amendment, Art. 2(5))</dt>
      <dd>The developer is not a "Personal Information Controller" (개인정보처리자).
        Korea's strict consent requirements do not apply as no data collection exists.</dd>
    </dl>

    <h3>Other jurisdictions</h3>
    <dl class="compliance-list">
      <dt>Brazil — LGPD (Art. 5(VI))</dt>
      <dd>Developer is not a controller (controlador). Local processing only.</dd>

      <dt>India — DPDP Act 2023 (Art. 2(i))</dt>
      <dd>Developer is not a "Data Fiduciary." No determination of purpose or means.</dd>

      <dt>Canada — PIPEDA / Quebec Law 25</dt>
      <dd>No collection occurs. Local storage for core functionality requires no consent.</dd>

      <dt>Australia — Privacy Act 1988 / APP 3</dt>
      <dd>No personal information enters the developer's possession or control.</dd>

      <dt>Russia — Federal Law 152-FZ (Art. 18(5))</dt>
      <dd>Data localization obligation applies only to "operators" who "collect" personal data.
        No collection = no localization requirement.</dd>

      <dt>Singapore (PDPA), Thailand (PDPA), Philippines (DPA), Indonesia (PDP Law 2022)</dt>
      <dd>In all ASEAN frameworks, the developer falls outside the definition of
        controller/handler as no data is collected or accessed.</dd>

      <dt>UAE (PDPL), Saudi Arabia (PDPL), South Africa (POPIA)</dt>
      <dd>Same principle: client-side processing excludes the developer from
        controller/operator definitions in all these frameworks.</dd>
    </dl>
  </section>

  <section>
    <h2>Web hosting</h2>
    <p>
      ogio Quali is served as static files. When you first load the page, the
      hosting provider may process your IP address in standard server access logs.
      After initial load, the Service Worker caches all assets locally and no
      further network requests are made. The developer does not operate the hosting
      infrastructure and does not have access to these logs.
    </p>
  </section>

  <section>
    <h2>Browser sync warning</h2>
    <p>
      Some browsers (e.g., Chrome with Sync enabled) may synchronize local data
      to cloud services. This is controlled by your browser settings, not by ogio
      Quali. If you handle sensitive research data, we recommend verifying your
      browser's sync settings or using the tool in a separate browser profile.
    </p>
  </section>

  <section>
    <h2>Supply chain security</h2>
    <p>
      ogio Quali uses a minimal set of open-source dependencies. We enforce
      Content Security Policy headers (<code>default-src 'self'</code>) that
      prevent any external network requests at the browser level — even if a
      compromised dependency attempted to exfiltrate data, the browser would block
      the request. You can audit our full dependency tree in the open-source
      repository.
    </p>
  </section>

  <section>
    <h2>Verification</h2>
    <p>
      You can independently verify our zero-telemetry claim:
    </p>
    <ol>
      <li>Open DevTools → Network tab while using the tool</li>
      <li>Disconnect from the internet — all features continue to work</li>
      <li>Audit the open-source code on GitHub</li>
    </ol>
  </section>

  <section>
    <h2>IRB submissions</h2>
    <p>
      For ethics committee (IRB/REB) submissions, you may use this statement:
    </p>
    <blockquote>
      Qualitative data analysis will be conducted using ogio Quali, an open-source,
      client-side application. ogio Quali processes all data locally on the
      researcher's device. The software architecture physically prevents data
      exfiltration, as it contains no telemetry, no cloud synchronization, and makes
      no external network requests (verifiable via open-source code audit). The use
      of this software does not introduce third-party data processors.
    </blockquote>
  </section>

  <section>
    <h2>Data backup responsibility</h2>
    <p>
      Because ogio Quali does not perform cloud synchronization, data backup is
      your responsibility. We recommend regular exports using the built-in backup
      feature (JSON format). Follow the 3-2-1 backup rule: 3 copies, 2 different
      media, 1 offsite.
    </p>
  </section>

  <section>
    <h2>Changes to this policy</h2>
    <p>
      If we ever change this architecture (unlikely — local-first is a core principle),
      we will update this page and note the change in the release notes. Our commitment:
      ogio Quali will never add telemetry, tracking, or cloud data collection.
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

  h3 {
    font-family: var(--font-body);
    font-size: var(--ui-font-sm);
    font-weight: var(--font-weight-medium);
    color: var(--theme-text);
    letter-spacing: 0.03em;
    text-transform: uppercase;
    margin-top: var(--space-6);
    margin-bottom: var(--space-2);
  }

  p {
    font-size: var(--doc-font-base);
    margin-bottom: var(--space-3);
  }

  p:last-child {
    margin-bottom: 0;
  }

  ol {
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

  .compliance-list {
    font-size: var(--doc-font-base);
  }

  dt {
    font-weight: var(--font-weight-medium);
    color: var(--theme-text);
    margin-top: var(--space-3);
  }

  dd {
    margin-left: 0;
    padding-left: var(--space-4);
    border-left: 2px solid var(--theme-border-subtle);
    margin-top: var(--space-1);
  }

  blockquote {
    border-left: 2px solid var(--theme-accent);
    padding-left: var(--space-4);
    margin: var(--space-4) 0;
    font-size: var(--ui-font-sm);
    color: var(--theme-text-muted);
    font-style: italic;
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
