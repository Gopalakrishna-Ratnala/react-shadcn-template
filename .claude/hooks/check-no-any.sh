#!/bin/bash
# Enforces: NEVER use explicit `any` (03-coding-principles.md, 07-typescript.md)
# Checks Write content and Edit new_string for explicit `any` usage.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check .ts and .tsx files
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

# Skip test and story files — they may use `any` in mocks
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

# Check for explicit `any` patterns: `: any`, `as any`, `<any>`, excluding comment lines
VIOLATIONS=$(echo "$CONTENT" | grep -nE ':\s*any\b|as\s+any\b|<any>' | grep -vE '^\s*//' | grep -vE '^\s*\*' | grep -vE '^\s*/\*' || true)

if [[ -n "$VIOLATIONS" ]]; then
  echo "BLOCKED: Explicit 'any' type detected in $FILE_PATH." >&2
  echo "Violations:" >&2
  echo "$VIOLATIONS" >&2
  echo "" >&2
  echo "Rule: NEVER use explicit any. Use specific types or 'unknown'." >&2
  echo "Source: 03-coding-principles.md, 07-typescript.md" >&2
  exit 2
fi

exit 0
