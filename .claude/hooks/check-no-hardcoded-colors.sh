#!/bin/bash

# Guard: every check below depends on jq to parse the tool-call JSON from
# stdin. Without jq, each jq call below would fail, producing an empty
# variable, which every hook's early-exit logic then silently treats as
# "nothing to check" - exit 0, zero indication anything was skipped. Found
# via a real teammate test-report run (jq missing on their machine caused
# every jq-dependent hook, i.e. nearly all of them, to silently no-op for
# the entire session). Fail loudly and block instead, so this is impossible
# to miss.
if ! command -v jq >/dev/null 2>&1; then
  echo "BLOCKED: jq is required for the hooks in this repo to function and was not found on PATH. Install it (macOS: brew install jq | Debian/Ubuntu: apt-get install jq | Windows: choco install jq or scoop install jq), then restart your Claude Code session. Source: README.md" >&2
  printf '%s\n' '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"BLOCKED: jq is required for the hooks in this repo to function and was not found on PATH. Install it and restart your session. Source: README.md"}}'
  exit 2
fi
# Enforces: NEVER hardcode hex, rgb, rgba, hsl colors OR Tailwind palette colour classes
# (03-coding-principles.md, tailwind-shadcn-styling.md)
# Only checks *.styles.ts files and .tsx files.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check styles.ts and .tsx files in src/
if [[ "$FILE_PATH" != */src/* ]]; then
  exit 0
fi

if [[ "$FILE_PATH" != *.styles.ts && "$FILE_PATH" != *styles.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

# Skip test files, story files, and theme files
if [[ "$FILE_PATH" == *.test.* || "$FILE_PATH" == *.stories.* || "$FILE_PATH" == */test/* || "$FILE_PATH" == */theme/* ]]; then
  exit 0
fi

# Extract content by inspecting the actual JSON shape, not by matching an exact
# tool name. The previous version only handled TOOL_NAME == "Write" or "Edit",
# which silently let every other content-writing tool (MultiEdit's `edits` array
# being the most common) bypass this hook entirely with no check and no warning -
# a real, confirmed gap (found via a real teammate's test-report run, then
# reproduced directly). This checks for known content-bearing fields directly:
# `content` (Write-shaped), `new_string` (Edit-shaped), or `edits[].new_string`
# (MultiEdit-shaped) - whichever is present, regardless of what the tool is named.
CONTENT=$(echo "$INPUT" | jq -r '
  if .tool_input.content != null then .tool_input.content
  elif .tool_input.new_string != null then .tool_input.new_string
  elif .tool_input.edits != null then [.tool_input.edits[].new_string] | join("\n")
  else empty
  end
')
if [[ -z "$CONTENT" ]]; then
  exit 0
fi

# Check 1: hardcoded CSS color values — #hex, rgb(), rgba(), hsl(), hsla()
# Exclude import statements and comment lines
CSS_VIOLATIONS=$(echo "$CONTENT" | grep -nE '(#[0-9a-fA-F]{3,8}\b|rgba?\s*\(|hsla?\s*\()' | grep -vE '^\s*//' | grep -vE '^\s*\*' | grep -vE 'import\b' || true)

# Check 2: Tailwind palette colour classes — bg-<color>-<step>, text-<color>-<step>,
# border-<color>-<step>, ring-<color>-<step>, etc.
# Matches patterns like bg-blue-500, text-slate-700, border-gray-200.
# Excludes this project's own approved semantic chart tokens (bg-chart-1..5,
# text-chart-1..5, etc. — see 01-tailwind-shadcn-styling.md's token table),
# which share the same "<prefix>-<word>-<number>" shape as a real palette
# class but are legitimate semantic tokens, not hardcoded colors.
TAILWIND_VIOLATIONS=$(echo "$CONTENT" | grep -nE '\b(bg|text|border|ring|fill|stroke|from|to|via|placeholder|caret|accent|decoration|outline)-[a-z]+-[0-9]+\b' | grep -vE '^\s*//' | grep -vE '^\s*\*' | grep -vE '\-chart-[0-9]+\b' || true)

VIOLATIONS=""
if [[ -n "$CSS_VIOLATIONS" ]]; then
  VIOLATIONS="$CSS_VIOLATIONS"
fi
if [[ -n "$TAILWIND_VIOLATIONS" ]]; then
  VIOLATIONS="$VIOLATIONS
$TAILWIND_VIOLATIONS"
fi

if [[ -n "$VIOLATIONS" ]]; then
  echo "BLOCKED: Hardcoded color values found in $FILE_PATH." >&2
  echo "Violations:" >&2
  echo "$VIOLATIONS" >&2
  echo "" >&2
  echo "Rule: NEVER hardcode CSS colors (#hex, rgb, rgba, hsl) or Tailwind palette classes" >&2
  echo "(e.g. bg-blue-500, text-slate-700). Use shadcn/ui semantic tokens instead:" >&2
  echo "bg-primary, text-foreground, bg-muted, text-muted-foreground, border-border, etc." >&2
  echo "Source: 03-coding-principles.md, tailwind-shadcn-styling.md" >&2
  exit 2
fi

exit 0
