#!/bin/bash
# Enforces: NEVER use raw numeric dimensions in styles (styling/shadcn/01-tailwind-shadcn-styling.md)
# Checks styles.ts for hardcoded px values and raw numeric dimensions.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check styles.ts and .tsx in src/
if [[ "$FILE_PATH" != */src/* ]]; then
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

# For styles.ts files: check for raw px strings like "16px", "14px", "1rem"
if [[ "$FILE_PATH" == *styles.ts ]]; then
  VIOLATIONS=$(echo "$CONTENT" | grep -nE '"[0-9]+px"' | grep -vE '^\s*//' || true)
  if [[ -n "$VIOLATIONS" ]]; then
    echo "BLOCKED: Raw px dimension strings found in $FILE_PATH." >&2
    echo "Violations:" >&2
    echo "$VIOLATIONS" >&2
    echo "" >&2
    echo "Rule: Use theme spacing tokens (e.g. Tailwind spacing scale) instead of raw px values." >&2
    echo "Source: styling/shadcn/01-tailwind-shadcn-styling.md" >&2
    exit 2
  fi
fi

exit 0
