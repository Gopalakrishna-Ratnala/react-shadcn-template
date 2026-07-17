#!/bin/bash
# Enforces: Run tsc --noEmit and confirm zero TypeScript errors (04-execution-flow.md)
# Runs after Write/Edit on .ts/.tsx files. Warning only — does not block.
# Debounced: only runs if 30+ seconds have passed since last check to avoid
# slowing down rapid sequential edits.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check .ts and .tsx files in src/
if [[ "$FILE_PATH" != */src/*.ts && "$FILE_PATH" != */src/*.tsx ]]; then
  exit 0
fi

# Skip test and story files to avoid slowing down test writing
if [[ "$FILE_PATH" == *.test.* || "$FILE_PATH" == *.stories.* || "$FILE_PATH" == */test/* ]]; then
  exit 0
fi

# Find the project root (where tsconfig.json lives)
PROJECT_DIR=$(echo "$FILE_PATH" | sed 's|/src/.*|/|')

if [[ ! -f "${PROJECT_DIR}tsconfig.json" ]]; then
  exit 0
fi

# Debounce: skip if last check was less than 30 seconds ago
STAMP_FILE="/tmp/.claude-tsc-last-run-$(echo "$PROJECT_DIR" | md5sum 2>/dev/null | cut -d' ' -f1 || echo "$PROJECT_DIR" | md5 2>/dev/null)"
if [[ -f "$STAMP_FILE" ]]; then
  LAST_RUN=$(cat "$STAMP_FILE" 2>/dev/null || echo 0)
  NOW=$(date +%s)
  ELAPSED=$((NOW - LAST_RUN))
  if [[ $ELAPSED -lt 30 ]]; then
    exit 0
  fi
fi

# Update timestamp
date +%s > "$STAMP_FILE" 2>/dev/null

# Run tsc --noEmit from the project directory
TSC_OUTPUT=$(cd "$PROJECT_DIR" && npx tsc --noEmit 2>&1)
TSC_EXIT=$?

if [[ $TSC_EXIT -ne 0 ]]; then
  # Count errors
  ERROR_COUNT=$(echo "$TSC_OUTPUT" | grep -c "error TS" || true)
  echo "WARNING: TypeScript type check found $ERROR_COUNT error(s)." >&2
  # Show first 15 lines of errors to avoid flooding
  echo "$TSC_OUTPUT" | grep "error TS" | head -15 >&2
  if [[ $ERROR_COUNT -gt 15 ]]; then
    echo "... and $((ERROR_COUNT - 15)) more error(s). Run 'tsc --noEmit' to see all." >&2
  fi
  echo "" >&2
  echo "Source: 04-execution-flow.md (step 8)" >&2
  # Exit 0 — warning only, does not block the write
fi

exit 0
