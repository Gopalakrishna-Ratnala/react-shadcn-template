---
description: Accessibility requirements — aria-labels, keyboard navigation, semantic elements, focus management. Loaded when editing component files.
paths: ["src/**/*.tsx"]
---

# Accessibility Requirements

## Preferred Semantic Elements

Use the element that best describes the content's role. Never reach for a generic wrapper when a semantic element fits.

| Element | When to use |
| --- | --- |
| `<main>` | The primary content area of the page — one per page |
| `<nav>` | A set of navigation links (primary nav, breadcrumbs, pagination) |
| `<header>` | Introductory content or a group of navigational aids for a section or page |
| `<footer>` | Footer of a section or page (copyright, links, secondary nav) |
| `<section>` | A thematically distinct section of content — pair with a heading |
| `<article>` | Self-contained content that makes sense independently (post, card, product) |
| `<aside>` | Content tangentially related to the surrounding content (sidebar, callout) |
| `<h1>`–`<h6>` | Document outline headings — one `<h1>` per page, nest levels in order |
| `<p>` | A paragraph of prose text |
| `<ul>` / `<ol>` | Unordered or ordered lists — always wrap items in `<li>` |
| `<li>` | A list item — only inside `<ul>`, `<ol>`, or `<menu>` |
| `<figure>` / `<figcaption>` | Self-contained media (image, diagram, code block) with an optional caption |
| `<img>` | Images — always provide a descriptive `alt`; use `alt=""` only for decorative images |
| `<em>` | Stress emphasis (affects meaning when read aloud) |
| `<strong>` | Strong importance (warns of serious consequences or highlights key terms) |
| `<small>` | Side comments (fine print, legal, attribution) |
| `<mark>` | Highlighted or search-matched text |
| `<time>` | Machine-readable dates and times — provide a `datetime` attribute |
| `<abbr>` | Abbreviations — pair with a `title` attribute for the expansion |
| `<code>` | Inline code snippets |
| `<kbd>` | Keyboard input |
| `<address>` | Contact information for the nearest `<article>` or `<body>` ancestor |

**Never use `<div>` or `<span>`** — they are layout shortcuts with no semantic meaning and are blocked by the `check-no-div-span.sh` hook.

---

## Non-negotiable Accessibility Rules

- All images need descriptive `alt`
- All icon-only buttons need `aria-label`
- Interactive controls must be keyboard accessible
- Inputs must have labels and error associations
- Focus order must be logical
- Semantic elements must be used
- Links opening new tabs must include proper `rel`
- Modals/dialogs must trap and restore focus correctly

## Forbidden Accessibility Failures

- clickable non-semantic layout elements
- missing labels
- hidden meaning conveyed only by color
- empty alt text unless truly decorative and approved by context
- keyboard-inaccessible custom interactions

## Examples

### Icon-only button (correct)

```tsx
<button aria-label="Close dialog" onClick={onClose}>
  <CloseIcon />
</button>
```

### Form input with error association (correct)

```tsx
<input
  id="email"
  aria-invalid={Boolean(error)}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <p id="email-error" role="alert">{error.message}</p>}
```

> When using a form library's `Controller` wrapper, apply the same `aria-invalid` and `aria-describedby` props to the rendered input element.

### Image with descriptive alt (correct)

```tsx
<img src={logoSrc} alt="Company logo — Acme Corp" />
```

### Link opening new tab (correct)

```tsx
<a href={url} target="_blank" rel="noopener noreferrer">
  View documentation
</a>
```
