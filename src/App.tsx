function App() {
  return (
    <main className="ph-root">
      <article className="ph-card">
        <header className="ph-header">
          <figure className="ph-logo" aria-hidden="true">
            ⬡
          </figure>
          <strong className="ph-title">AI Ready React Template</strong>
          <em className="ph-tagline">Your project starts here</em>
        </header>

        <section className="ph-section" aria-label="Files to replace or delete">
          <strong className="ph-section-heading">
            🔧 Replace or delete before starting
          </strong>
          <ul className="ph-delete-list">
            <li className="ph-replace-item">
              <code>src/App.tsx</code>
              <em>
                — replace this content with your root component and providers
              </em>
            </li>
            <li className="ph-delete-item">
              <code>src/index.css</code>
              <em>— replace with your UI library's global reset</em>
            </li>
            <li className="ph-delete-item">
              <code>.claude/rules/styling/mui/</code>
              <em>— if using shadcn/ui + Tailwind (keep only one strategy)</em>
            </li>
            <li className="ph-delete-item">
              <code>.claude/rules/styling/shadcn/</code>
              <em>— if using MUI (keep only one strategy)</em>
            </li>
            <li className="ph-delete-item">
              <code>.claude/rules/forms/rhf-zod.md</code>
              <em>— if using Yup instead of Zod</em>
            </li>
          </ul>
        </section>

        <section className="ph-section" aria-label="Getting started steps">
          <strong className="ph-section-heading">
            ✅ Then follow these steps
          </strong>
          <ul className="ph-step-list">
            <li className="ph-step">
              <strong className="ph-step-num">1</strong>
              <section className="ph-step-body">
                <strong className="ph-step-title">Choose your libraries</strong>
                <em className="ph-step-desc">
                  Keep one file per strategy folder in{" "}
                  <code>.claude/rules/</code>, delete the rest
                </em>
              </section>
            </li>
            <li className="ph-step">
              <strong className="ph-step-num">2</strong>
              <section className="ph-step-body">
                <strong className="ph-step-title">Install dependencies</strong>
                <em className="ph-step-desc">
                  UI library, state management, HTTP client, form library,
                  testing
                </em>
              </section>
            </li>
            <li className="ph-step">
              <strong className="ph-step-num">3</strong>
              <section className="ph-step-body">
                <strong className="ph-step-title">Replace this file</strong>
                <em className="ph-step-desc">
                  Build your root component and set up providers in{" "}
                  <code>src/App.tsx</code>
                </em>
              </section>
            </li>
          </ul>
        </section>

        <footer className="ph-footer">
          Read <code>CLAUDE.md</code> for the full bootstrap checklist
        </footer>
      </article>
    </main>
  );
}

export default App;
