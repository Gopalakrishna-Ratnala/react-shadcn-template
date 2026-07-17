#!/bin/bash
# Enforces: NEVER use raw numeric dimensions in styles (06-styling.md)
# Checks styles.ts for hardcoded px values and raw numeric dimensions.
# Also checks .tsx files for MUI component props with raw numeric dimensions.

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
    echo "Rule: Use theme.spacing(), theme.customSpacing, or other theme tokens instead of raw px values." >&2
    echo "Source: 06-styling.md" >&2
    exit 2
  fi
fi

# For .tsx files: check for MUI component props with raw numeric dimensions
# e.g., width={40}, height={40}, size={32}, gap={16}, margin={8}, padding={4}
if [[ "$FILE_PATH" == *.tsx ]]; then
  VIOLATIONS=$(echo "$CONTENT" | grep -nE '\b(width|height|size|minWidth|maxWidth|minHeight|maxHeight|margin|marginTop|marginBottom|marginLeft|marginRight|padding|paddingTop|paddingBottom|paddingLeft|paddingRight|gap|rowGap|columnGap)=\{[0-9]+\}' | grep -vE '^\s*//' | grep -vE '^\s*\*' | grep -vE '^\s*/\*' || true)
  if [[ -n "$VIOLATIONS" ]]; then
    echo "BLOCKED: Raw numeric dimension props found in $FILE_PATH." >&2
    echo "Violations:" >&2
    echo "$VIOLATIONS" >&2
    echo "" >&2
    echo "Rule: Create a styled component in styles.ts with theme.spacing() instead of raw numeric MUI props." >&2
    echo "Source: 06-styling.md" >&2
    exit 2
  fi
fi

exit 0
