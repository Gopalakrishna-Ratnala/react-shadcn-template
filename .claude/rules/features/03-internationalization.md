---
description: Internationalization (i18n) — runtime-only locale loading, no bundled translation strings, loadLocale pattern. Active when project supports multiple languages.
paths: ["src/**/*.ts", "src/**/*.tsx", "public/locales/**/*.json"]
---

# Internationalization (i18n)

## Rules

- Always store locale translation files in `public/locales/<locale>.json` — never import locale data as TypeScript/JS modules
- Never `import` translation strings into the JS bundle — this forces every user to download strings they will never read
- Always load locale files at runtime with `fetch()` — never bundle them statically
- Always type the return value of `loadLocale()` explicitly — never return untyped locale objects
- Always define the set of supported locales as a union type in `src/types/i18n.types.ts`
- Always handle fetch errors in `loadLocale()` — never let a missing locale file silently return undefined

## Directory Structure

```text
public/
  locales/
    en.json         # English strings
    es.json         # Spanish strings
    fr.json         # French strings (add locales as needed)
src/
  utils/
    i18n.ts         # loadLocale() helper
  types/
    i18n.types.ts   # Locale union type and TranslationMap
```

## Types

```ts
// src/types/i18n.types.ts
export type Locale = "en" | "es" | "fr"; // extend as needed

export interface TranslationMap {
  [key: string]: string;
}
```

## loadLocale Pattern

```ts
// src/utils/i18n.ts
import type { Locale, TranslationMap } from "@/types/i18n.types";

export const loadLocale = async (locale: Locale): Promise<TranslationMap> => {
  const response = await fetch(`/locales/${locale}.json`);
  if (!response.ok) throw new Error(`Failed to load locale: ${locale}`);
  return response.json() as Promise<TranslationMap>;
};
```

## Usage in a Hook

```ts
// src/hooks/useLocale.ts
import { useState, useEffect } from "react";
import { loadLocale } from "@/utils/i18n";
import type { Locale, TranslationMap } from "@/types/i18n.types";

export const useLocale = (locale: Locale) => {
  const [translations, setTranslations] = useState<TranslationMap>({});
  const [localeError, setLocaleError] = useState<string | null>(null);

  useEffect(() => {
    loadLocale(locale)
      .then(setTranslations)
      .catch((error: unknown) => {
        setLocaleError(error instanceof Error ? error.message : "Failed to load locale");
      });
  }, [locale]);

  return { translations, localeError };
};
```

## Locale File Shape

```json
// public/locales/en.json
{
  "auth.login.title": "Sign in to your account",
  "auth.login.submit": "Sign in",
  "auth.login.email": "Email address",
  "auth.login.password": "Password"
}
```
