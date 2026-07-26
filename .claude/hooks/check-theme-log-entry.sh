#!/bin/bash
# Enforces: every theme candidate file must have a matching THEME-LOG.json entry
# (styling/shadcn/03-theme-versioning.md). Warns (does not block) if a new .css file
# is written under src/styles/themes/history/ with no corresponding log entry, or if
# its filename doesn't match the documented naming convention.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" != */src/styles/themes/history/*.css ]]; then
  exit 0
fi

FILENAME=$(basename "$FILE_PATH")
HISTORY_DIR=$(dirname "$FILE_PATH")
LOG_FILE="$HISTORY_DIR/THEME-LOG.json"

# Check naming convention: YYYY-MM-DD_<slug>_v<N>-<descriptor>.css
if ! [[ "$FILENAME" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}_[a-z0-9-]+_v[0-9]+-[a-z0-9-]+\.css$ ]]; then
  MSG="Theme candidate file '$FILENAME' doesn't match the required naming convention: YYYY-MM-DD_<round-or-feature-slug>_v<N>-<short-descriptor>.css (e.g. 2026-07-24_initial-design_v3-bold-tech.css). Source: styling/shadcn/03-theme-versioning.md"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
  exit 0
fi

if [[ ! -f "$LOG_FILE" ]]; then
  MSG="Theme candidate '$FILENAME' was created but $LOG_FILE doesn't exist. Every candidate must have a matching entry in THEME-LOG.json. Source: styling/shadcn/03-theme-versioning.md"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
  exit 0
fi

HAS_ENTRY=$(jq --arg f "$FILENAME" '[.[] | select(.file == $f)] | length' "$LOG_FILE" 2>/dev/null)

if [[ "$HAS_ENTRY" == "0" ]]; then
  MSG="Theme candidate '$FILENAME' was created but has no matching entry in THEME-LOG.json. Add one with status \"candidate\" before moving on. Source: styling/shadcn/03-theme-versioning.md"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
fi

exit 0
