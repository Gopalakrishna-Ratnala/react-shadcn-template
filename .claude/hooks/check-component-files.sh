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
# After writing to a component directory, checks all 6 required files exist.
# Applies to: src/components/layout/** and src/components/shared/**
# Skips:      src/components/ui/** (vendored shadcn primitives — no contract required)
# Required:   ComponentName.tsx, ComponentName.styles.ts, types.ts,
#             ComponentName.stories.tsx, ComponentName.test.tsx, index.ts

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check files inside src/components/
if [[ "$FILE_PATH" != */src/components/* ]]; then
  exit 0
fi

# Skip vendored shadcn primitives in ui/
if [[ "$FILE_PATH" == */src/components/ui/* ]]; then
  exit 0
fi

# Only check layout/ and shared/ tiers
if [[ "$FILE_PATH" != */src/components/layout/* && "$FILE_PATH" != */src/components/shared/* ]]; then
  exit 0
fi

# Extract the component directory (the folder directly containing the component files)
COMP_DIR=$(dirname "$FILE_PATH")

# The relative path after layout/ or shared/
if [[ "$FILE_PATH" == */src/components/layout/* ]]; then
  RELATIVE=${COMP_DIR#*src/components/layout/}
elif [[ "$FILE_PATH" == */src/components/shared/* ]]; then
  RELATIVE=${COMP_DIR#*src/components/shared/}
fi

# Skip if we're nested deeper than one folder (e.g. a subfolder inside the component)
if [[ "$RELATIVE" == */* ]]; then
  exit 0
fi

# Get the component name (PascalCase) from the folder name (camelCase)
FOLDER_NAME=$(basename "$COMP_DIR")
COMP_NAME="$(echo "${FOLDER_NAME:0:1}" | tr '[:lower:]' '[:upper:]')${FOLDER_NAME:1}"

# Check required files
MISSING=""
for REQUIRED_FILE in "${COMP_NAME}.tsx" "${COMP_NAME}.styles.ts" "types.ts" "${COMP_NAME}.stories.tsx" "${COMP_NAME}.test.tsx" "index.ts"; do
  if [[ ! -f "$COMP_DIR/$REQUIRED_FILE" ]]; then
    WRITING_FILE=$(basename "$FILE_PATH")
    if [[ "$WRITING_FILE" != "$REQUIRED_FILE" ]]; then
      MISSING="$MISSING  - $REQUIRED_FILE\n"
    fi
  fi
done

if [[ -n "$MISSING" ]]; then
  echo "WARNING: Component '$FOLDER_NAME' is missing required files:" >&2
  echo -e "$MISSING" >&2
  echo "Required: ${COMP_NAME}.tsx, ${COMP_NAME}.styles.ts, types.ts, ${COMP_NAME}.stories.tsx, ${COMP_NAME}.test.tsx, index.ts" >&2
  echo "Source: 02-project-structure.md" >&2
fi

exit 0
