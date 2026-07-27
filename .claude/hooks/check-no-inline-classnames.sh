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
# Warns when a className attribute in a .tsx file contains two or more
# space-separated Tailwind tokens that are not wrapped in cn() or imported
# from a .styles.ts file.
# Rule: every multi-token className MUST be extracted to ComponentName.styles.ts
# Source: tailwind-shadcn-styling.md (GAP 1)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check .tsx files in src/
if [[ "$FILE_PATH" != */src/*.tsx && "$FILE_PATH" != */src/**/*.tsx ]]; then
  exit 0
fi
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

# Detect className="<two or more space-separated tokens>" that are plain string literals.
# This matches: className="token1 token2 ..." but NOT className={...} (dynamic expressions).
# A single token (no space) is allowed inline.
VIOLATIONS=$(echo "$CONTENT" | grep -nE 'className="[^"]*[[:space:]][^"]*"' | grep -vE '^\s*//' | grep -vE '^\s*\*' || true)

if [[ -n "$VIOLATIONS" ]]; then
  MSG="Inline multi-token className found in $FILE_PATH.
Violations:
$VIOLATIONS

Every className with more than one utility class MUST be extracted to the co-located ComponentName.styles.ts file as a named const. Only a single-token utility (e.g. className=\"sr-only\") or a cn() call whose base classes come from styles.ts is allowed inline. Source: tailwind-shadcn-styling.md"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
  # Warning only, exit 0 so the write is not blocked
fi

exit 0
