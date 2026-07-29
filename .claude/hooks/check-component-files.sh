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
# Enforces: Missing any file = incomplete component (02-project-structure.md)
# After writing to a component directory, checks all 5 required files exist.
# Storybook is fixed OFF for this template (see features/README.md) - no
# .stories.tsx is required or checked.
# Applies to: src/components/{layout,shared,blocks}/** and src/pages/*/components/**
# Skips:      src/components/ui/** (vendored shadcn primitives — no contract required)
# Required:   ComponentName.tsx, ComponentName.styles.ts, types.ts,
#             ComponentName.test.tsx, index.ts

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" != */src/components/* && "$FILE_PATH" != */src/pages/*/components/* ]]; then
  exit 0
fi

# Skip vendored shadcn primitives in ui/
if [[ "$FILE_PATH" == */src/components/ui/* ]]; then
  exit 0
fi

# Determine the tier's base directory so the "how deep is this file" check
# below works generically instead of hardcoding two branches (mirrors
# check-component-duplicate.sh's tier derivation).
if [[ "$FILE_PATH" == */src/components/layout/* ]]; then
  BASE_DIR="${FILE_PATH%%/src/components/layout/*}/src/components/layout"
elif [[ "$FILE_PATH" == */src/components/shared/* ]]; then
  BASE_DIR="${FILE_PATH%%/src/components/shared/*}/src/components/shared"
elif [[ "$FILE_PATH" == */src/components/blocks/* ]]; then
  BASE_DIR="${FILE_PATH%%/src/components/blocks/*}/src/components/blocks"
elif [[ "$FILE_PATH" == */src/pages/*/components/* ]]; then
  PAGES_PREFIX="${FILE_PATH%%/src/pages/*/components/*}/src/pages"
  REST="${FILE_PATH#*/src/pages/}"
  PAGE_NAME="${REST%%/components/*}"
  BASE_DIR="$PAGES_PREFIX/$PAGE_NAME/components"
else
  exit 0
fi

# Extract the component directory (the folder directly containing the component files)
COMP_DIR=$(dirname "$FILE_PATH")
RELATIVE=${COMP_DIR#"$BASE_DIR"/}

# Skip if we're nested deeper than one folder (e.g. a subfolder inside the component)
if [[ "$RELATIVE" == */* ]]; then
  exit 0
fi

# Get the component name (PascalCase) from the folder name (camelCase)
FOLDER_NAME=$(basename "$COMP_DIR")
COMP_NAME="$(echo "${FOLDER_NAME:0:1}" | tr '[:lower:]' '[:upper:]')${FOLDER_NAME:1}"

# Check required files (5-file contract - no Storybook in this template)
MISSING=""
for REQUIRED_FILE in "${COMP_NAME}.tsx" "${COMP_NAME}.styles.ts" "types.ts" "${COMP_NAME}.test.tsx" "index.ts"; do
  if [[ ! -f "$COMP_DIR/$REQUIRED_FILE" ]]; then
    WRITING_FILE=$(basename "$FILE_PATH")
    if [[ "$WRITING_FILE" != "$REQUIRED_FILE" ]]; then
      MISSING="$MISSING  - $REQUIRED_FILE\n"
    fi
  fi
done

if [[ -n "$MISSING" ]]; then
  MISSING_TRIMMED=$(echo -e "$MISSING")
  MSG="Component '$FOLDER_NAME' is missing required files:
$MISSING_TRIMMED
Required: ${COMP_NAME}.tsx, ${COMP_NAME}.styles.ts, types.ts, ${COMP_NAME}.test.tsx, index.ts
Source: 02-project-structure.md"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
fi

exit 0
