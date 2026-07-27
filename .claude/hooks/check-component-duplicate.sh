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
# Enforces: Never create a new reusable component if one already exists (04-execution-flow.md)
# When a new component folder is created under layout/, shared/, blocks/, or a page's
# feature-scoped components/ folder, warns and lists existing sibling component folder
# names so the agent can verify no duplicate is being made.
# Applies to: src/components/{layout,shared,blocks}/** and src/pages/*/components/**
# Skips:      src/components/ui/** (vendored shadcn primitives)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" != */src/components/* && "$FILE_PATH" != */src/pages/*/components/* ]]; then
  exit 0
fi

if [[ "$FILE_PATH" == */src/components/ui/* ]]; then
  exit 0
fi

if [[ "$FILE_PATH" == */src/components/layout/* ]]; then
  TIER="layout"
  BASE_DIR="${FILE_PATH%%/src/components/layout/*}/src/components/layout"
elif [[ "$FILE_PATH" == */src/components/shared/* ]]; then
  TIER="shared"
  BASE_DIR="${FILE_PATH%%/src/components/shared/*}/src/components/shared"
elif [[ "$FILE_PATH" == */src/components/blocks/* ]]; then
  TIER="blocks"
  BASE_DIR="${FILE_PATH%%/src/components/blocks/*}/src/components/blocks"
elif [[ "$FILE_PATH" == */src/pages/*/components/* ]]; then
  # Extract the page name for a clearer message, and the page-scoped components/ dir
  PAGES_PREFIX="${FILE_PATH%%/src/pages/*/components/*}/src/pages"
  REST="${FILE_PATH#*/src/pages/}"
  PAGE_NAME="${REST%%/components/*}"
  TIER="pages/$PAGE_NAME/components (feature-scoped)"
  BASE_DIR="$PAGES_PREFIX/$PAGE_NAME/components"
else
  exit 0
fi

COMP_DIR=$(dirname "$FILE_PATH")
RELATIVE=${COMP_DIR#"$BASE_DIR"/}

# Only trigger on the first file written into a new component folder
if [[ "$RELATIVE" == */* ]]; then
  exit 0
fi

FOLDER_NAME=$(basename "$COMP_DIR")

# If the folder already existed before this write, this isn't a new component — skip
EXISTING_COUNT=$(find "$COMP_DIR" -maxdepth 1 -type f ! -name "$(basename "$FILE_PATH")" 2>/dev/null | wc -l | tr -d ' ')
if [[ "$EXISTING_COUNT" -gt 0 ]]; then
  exit 0
fi

OTHER_FOLDERS=$(find "$BASE_DIR" -maxdepth 1 -mindepth 1 -type d ! -name "$FOLDER_NAME" -exec basename {} \; 2>/dev/null)

if [[ -n "$OTHER_FOLDERS" ]]; then
  OTHER_LIST=$(echo "$OTHER_FOLDERS" | sed 's/^/  - /')
  MSG="Creating new component '$FOLDER_NAME' in $TIER. Before adding it, confirm none of these existing components already satisfy the need:
$OTHER_LIST
Also check components/shared/ and components/blocks/ for anything close, per the Promotion Rule in 02-project-structure.md.
Source: 04-execution-flow.md — 'NEVER create a new reusable component if one that satisfies the need already exists'"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
fi

exit 0
