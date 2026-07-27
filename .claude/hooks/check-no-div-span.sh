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
# Enforces: NEVER use <div> or <span> in component JSX (03-coding-principles.md)
# Catches: <div>, <span> — layout shortcuts with no semantic meaning
# Semantic HTML (<p>, <h1>-<h6>, <section>, <ul>, <li>, etc.) is ALLOWED when
# no shadcn/ui or Radix primitive satisfies the semantic need.
# Only checks .tsx production files (not tests/stories).
# Skips comment lines (// and /* */ style).

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check .tsx files
if [[ "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

# Skip test files, story files, and config files
if [[ "$FILE_PATH" == *.test.* || "$FILE_PATH" == *.stories.* || "$FILE_PATH" == */test/* ]]; then
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
