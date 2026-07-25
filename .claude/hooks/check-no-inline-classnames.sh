#!/bin/bash
# Warns when a className attribute in a .tsx file contains two or more
# space-separated Tailwind tokens that are not wrapped in cn() or imported
# from a .styles.ts file.
# Rule: every multi-token className MUST be extracted to ComponentName.styles.ts
# Source: tailwind-shadcn-styling.md (GAP 1)

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
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

if [[ "$TOOL_NAME" == "Write" ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
elif [[ "$TOOL_NAME" == "Edit" ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
else
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
