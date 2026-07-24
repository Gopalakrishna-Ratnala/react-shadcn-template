#!/bin/bash
# Enforces: NEVER use raw numeric dimensions in styles (styling/shadcn/01-tailwind-shadcn-styling.md)
# Checks styles.ts for hardcoded px values and raw numeric dimensions.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check styles.ts and .tsx in src/
if [[ "$FILE_PATH" != */src/* ]]; then
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
