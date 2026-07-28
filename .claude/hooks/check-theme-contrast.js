#!/usr/bin/env node
// Enforces: every background/foreground token pair in a theme candidate meets
// WCAG AA contrast (4.5:1 for normal text) before it ever reaches a client for
// review - styling/shadcn/03-theme-versioning.md.
// Runs on Write/Edit to src/styles/themes/**/*.css, excluding theme-template.css
// (which intentionally holds placeholder values, not real colors to check).
// PostToolUse, warning only - does not block, since a designer may have a
// deliberate reason for a specific low-contrast pairing (e.g. a decorative,
// non-text-bearing surface) that a script can't fully judge.

import { wcagContrast } from "culori";

const AA_NORMAL_TEXT_THRESHOLD = 4.5;

// Every semantic background/foreground pair this project's theme defines
// (core/03-coding-principles.md's token list, theme-template.css).
const PAIRS = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["accent", "accent-foreground"],
  ["muted", "muted-foreground"],
  ["destructive", "destructive-foreground"],
  ["success", "success-foreground"],
  ["warning", "warning-foreground"],
  ["info", "info-foreground"],
  ["sidebar", "sidebar-foreground"],
  ["sidebar-primary", "sidebar-primary-foreground"],
  ["sidebar-accent", "sidebar-accent-foreground"],
];

function extractBlock(css, selector) {
  // Matches a flat selector block (no nested braces expected inside a
  // :root/.dark token-declaration block in this project's theme files).
  const re = new RegExp(
    selector.replace(".", "\\.") + "\\s*\\{([^}]*)\\}",
    "s",
  );
  const match = css.match(re);
  return match ? match[1] : null;
}

function extractTokens(blockContent) {
  const tokens = {};
  if (!blockContent) return tokens;
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(blockContent)) !== null) {
    tokens[m[1]] = m[2].trim();
  }
  return tokens;
}

function checkMode(tokens, modeLabel) {
  const failures = [];
  for (const [bg, fg] of PAIRS) {
    const bgValue = tokens[bg];
    const fgValue = tokens[fg];
    if (!bgValue || !fgValue) continue; // token-completeness is a separate check
    let ratio;
    try {
      ratio = wcagContrast(bgValue, fgValue);
    } catch (error) {
      // Unparseable color value (e.g. a color-mix() expression, a var()
      // reference) - not this check's job to validate color syntax, skip.
      continue;
    }
    if (ratio === undefined || Number.isNaN(ratio)) continue;
    if (ratio < AA_NORMAL_TEXT_THRESHOLD) {
      failures.push(
        `${modeLabel}: --${bg}/--${fg} is ${ratio.toFixed(2)}:1 (needs at least ${AA_NORMAL_TEXT_THRESHOLD}:1 for WCAG AA normal text)`,
      );
    }
  }
  return failures;
}

function main() {
  let input = "";
  process.stdin.on("data", (chunk) => (input += chunk));
  process.stdin.on("end", () => {
    let payload;
    try {
      payload = JSON.parse(input);
    } catch {
      process.exit(0);
    }

    const filePath = payload?.tool_input?.file_path || "";
    if (!/src\/styles\/themes\/.*\.css$/.test(filePath)) process.exit(0);
    if (filePath.endsWith("theme-template.css")) process.exit(0);

    const content =
      payload?.tool_input?.content ??
      payload?.tool_input?.new_string ??
      (Array.isArray(payload?.tool_input?.edits)
        ? payload.tool_input.edits.map((e) => e.new_string).join("\n")
        : "");
    if (!content) process.exit(0);

    const rootTokens = extractTokens(extractBlock(content, ":root"));
    const darkTokens = extractTokens(extractBlock(content, ".dark"));

    const failures = [
      ...checkMode(rootTokens, "light"),
      ...checkMode(darkTokens, "dark"),
    ];

    if (failures.length > 0) {
      const message =
        `Contrast check flagged ${failures.length} token pair(s) in ${filePath} below WCAG AA (4.5:1 for normal text):\n` +
        failures.map((f) => `  - ${f}`).join("\n") +
        "\nThis doesn't block the candidate - a low-contrast pairing may be intentional " +
        "for a decorative/non-text surface - but confirm this is deliberate before this " +
        "candidate goes to a client. Source: styling/shadcn/03-theme-versioning.md";
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: "PostToolUse",
            additionalContext: message,
          },
        }) + "\n",
      );
    }
    process.exit(0);
  });
}

main();
