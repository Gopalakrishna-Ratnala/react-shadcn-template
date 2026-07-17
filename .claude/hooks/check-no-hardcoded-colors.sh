#!/bin/bash
# Enforces: NEVER hardcode hex, rgb, rgba, hsl colors OR Tailwind palette colour classes
# (03-coding-principles.md, tailwind-shadcn-styling.md)
# Only checks *.styles.ts files and .tsx files.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
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

if [[ "$TOOL_NAME" == "Write" ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
elif [[ "$TOOL_NAME" == "Edit" ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
else
  exit 0
fi

# Check 1: hardcoded CSS color values — #hex, rgb(), rgba(), hsl(), hsla()
# Exclude import statements and comment lines
CSS_VIOLATIONS=$(echo "$CONTENT" | grep -nE '(#[0-9a-fA-F]{3,8}\b|rgba?\s*\(|hsla?\s*\()' | grep -vE '^\s*//' | grep -vE '^\s*\*' | grep -vE 'import\b' || true)

# Check 2: Tailwind palette colour classes — bg-<color>-<step>, text-<color>-<step>,
# border-<color>-<step>, ring-<color>-<step>, etc.
# Matches patterns like bg-blue-500, text-slate-700, border-gray-200
TAILWIND_VIOLATIONS=$(echo "$CONTENT" | grep -nE '\b(bg|text|border|ring|fill|stroke|from|to|via|placeholder|caret|accent|decoration|outline)-[a-z]+-[0-9]+\b' | grep -vE '^\s*//' | grep -vE '^\s*\*' || true)

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
