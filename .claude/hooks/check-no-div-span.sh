#!/bin/bash
# Enforces: NEVER use <div> or <span> in component JSX (03-coding-principles.md)
# Catches: <div>, <span> — layout shortcuts with no semantic meaning
# Semantic HTML (<p>, <h1>-<h6>, <section>, <ul>, <li>, etc.) is ALLOWED when
# no shadcn/ui or Radix primitive satisfies the semantic need.
# Only checks .tsx production files (not tests/stories).
# Skips comment lines (// and /* */ style).

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check .tsx files
if [[ "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

# Skip test files, story files, and config files
if [[ "$FILE_PATH" == *.test.* || "$FILE_PATH" == *.stories.* || "$FILE_PATH" == */test/* ]]; then
  exit 0
fi

if [[ "$TOOL_NAME" == "Write" ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
elif [[ "$TOOL_NAME" == "Edit" ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
else
  exit 0
fi

# Check for forbidden layout elements, excluding comment lines
VIOLATIONS=$(echo "$CONTENT" | grep -nE '<div\b|<span\b' | grep -vE '^\s*//' | grep -vE '^\s*\*' | grep -vE '^\s*/\*' || true)

if [[ -n "$VIOLATIONS" ]]; then
  echo "BLOCKED: Forbidden HTML element(s) found in $FILE_PATH." >&2
  echo "Violations:" >&2
  echo "$VIOLATIONS" >&2
  echo "" >&2
  echo "Rule: NEVER use <div> or <span> — they carry no semantic meaning and are always a layout shortcut." >&2
  echo "Replace with a shadcn/ui or Radix primitive, or a semantic HTML element (<section>, <ul>, <article>, etc.)." >&2
  echo "Source: 03-coding-principles.md" >&2
  exit 2
fi

exit 0
