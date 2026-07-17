---
description: Security practices — XSS prevention, token storage, input sanitization, secrets policy, forbidden patterns. Always loaded.
---

# Security

## Rules

- Never use `dangerouslySetInnerHTML` — if HTML rendering is truly required, sanitize first with DOMPurify
- Never store authentication tokens in `localStorage` without a documented decision — prefer `httpOnly` cookies set by the server
- Never log sensitive data (tokens, passwords, PII) to the console
- Never expose secret environment variables to the client bundle — only `VITE_` prefixed variables reach the browser; secrets belong on the server
- Never construct API paths, queries, or commands by concatenating raw user input
- Always validate user input at system boundaries (form schema, service layer) before using in logic or sending to an API
- Always set `rel="noopener noreferrer"` on links that open in a new tab
- Never use `eval()` or `new Function()` with user-supplied strings

## XSS Prevention

```tsx
// WRONG — renders arbitrary HTML from user/API content
<p dangerouslySetInnerHTML={{ __html: userContent }} />

// CORRECT — render as text; React escapes it automatically
<p>{userContent}</p>

// CORRECT — if HTML rendering is genuinely unavoidable, sanitize first
import DOMPurify from "dompurify";
<p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

## Token Storage

```ts
// WRONG — localStorage is readable by any JS on the page (XSS risk)
localStorage.setItem("access_token", token);

// PREFERRED — httpOnly cookie set by the server (not accessible to JS at all)
// Document any deviation from this in an ADR or code comment explaining the trade-off

// ACCEPTABLE — non-sensitive UI preferences only
localStorage.setItem("theme", "dark");
localStorage.setItem("locale", "en");
```

## Input Validation at Boundaries

```ts
// WRONG — raw user input used directly in a service call
export const fetchUser = (id: string) =>
  apiClient.get(`${API_ENDPOINTS.USER_PROFILE}/${id}`);
```

```ts
// CORRECT — validate shape before use (Zod shown; Yup equivalent is fine)
import { z } from "zod";
import { API_ENDPOINTS } from "@/constants";

const userIdSchema = z.string().uuid("Invalid user ID");

export const fetchUser = (id: string) => {
  userIdSchema.parse(id);
  return apiClient.get(`${API_ENDPOINTS.USER_PROFILE}/${id}`);
};
```

## Secrets Policy

```env
# .env.example — safe to commit (no real values)
VITE_API_BASE_URL=https://api.example.com

# WRONG — secret belongs on the server, never in a VITE_ variable
VITE_STRIPE_SECRET_KEY=sk_live_...   # ❌ visible to every browser user

# CORRECT — publishable/public keys only in VITE_ variables
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...   # ✅ designed to be public
```

## External Links

```tsx
// Always include rel on target="_blank" links
<a href={url} target="_blank" rel="noopener noreferrer">
  View documentation
</a>
```
