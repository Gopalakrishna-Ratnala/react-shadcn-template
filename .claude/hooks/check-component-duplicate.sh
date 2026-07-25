#!/bin/bash
# Enforces: Never create a new reusable component if one already exists (04-execution-flow.md)
# When a new component folder is created under shared/ or layout/, warns and lists
# existing component folder names so the agent can verify no duplicate is being made.
# Applies to: src/components/layout/** and src/components/shared/**
# Skips:      src/components/ui/** (vendored shadcn primitives)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" != */src/components/* ]]; then
  exit 0
fi

if [[ "$FILE_PATH" == */src/components/ui/* ]]; then
  exit 0
fi

if [[ "$FILE_PATH" == */src/components/layout/* ]]; then
  TIER="layout"
elif [[ "$FILE_PATH" == */src/components/shared/* ]]; then
  TIER="shared"
else
  exit 0
fi

COMP_DIR=$(dirname "$FILE_PATH")
RELATIVE=${COMP_DIR#*src/components/$TIER/}

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

BASE_DIR=$(dirname "$COMP_DIR")
OTHER_FOLDERS=$(find "$BASE_DIR" -maxdepth 1 -mindepth 1 -type d ! -name "$FOLDER_NAME" -exec basename {} \; 2>/dev/null)

if [[ -n "$OTHER_FOLDERS" ]]; then
  OTHER_LIST=$(echo "$OTHER_FOLDERS" | sed 's/^/  - /')
  MSG="Creating new component '$FOLDER_NAME' in components/$TIER/. Before adding it, confirm none of these existing components already satisfy the need:
$OTHER_LIST
Source: 04-execution-flow.md — 'NEVER create a new reusable component if one that satisfies the need already exists'"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
fi

exit 0
