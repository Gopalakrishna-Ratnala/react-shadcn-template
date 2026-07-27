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

# Check token completeness: every token declared in theme-template.css must also
# be present in the candidate file (compares --token-name declarations, not
# values - the source of truth for "what's required" is always the template
# file itself, so this stays correct automatically if the template ever changes).
THEMES_DIR=$(dirname "$HISTORY_DIR")
TEMPLATE_FILE="$THEMES_DIR/theme-template.css"

if [[ -f "$TEMPLATE_FILE" && -f "$FILE_PATH" ]]; then
  REQUIRED_TOKENS=$(grep -oE '^[[:space:]]*--[a-z0-9-]+:' "$TEMPLATE_FILE" | sed 's/^[[:space:]]*//;s/:$//' | sort -u)
  MISSING=""
  while IFS= read -r token; do
    [[ -z "$token" ]] && continue
    if ! grep -qE "^[[:space:]]*${token}:" "$FILE_PATH"; then
      MISSING="$MISSING $token"
    fi
  done <<< "$REQUIRED_TOKENS"

  if [[ -n "$MISSING" ]]; then
    MISSING_TRIMMED=$(echo "$MISSING" | xargs)
    MSG="Theme candidate '$FILENAME' is missing required tokens (present in theme-template.css but not in this candidate): $MISSING_TRIMMED. Every token must be filled in before this is a complete, valid candidate - never a partial file. Source: styling/shadcn/03-theme-versioning.md"
    jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
  fi
fi

exit 0
