#!/bin/bash
# Warns when a new .ts/.tsx file is written inside hooks/, components/,
# types/, constants/, services/, or store/ and no corresponding export
# line exists in the sibling index.ts.
# Rule: every new module must be barrel-exported (03-coding-principles.md)

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only trigger on Write (new files)
if [[ "$TOOL_NAME" != "Write" ]]; then
  exit 0
fi

# Only check .ts and .tsx files in src/
if [[ "$FILE_PATH" != */src/* ]]; then
  exit 0
fi
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

# Skip index files, test files, story files, and style files
BASENAME=$(basename "$FILE_PATH")
if [[ "$BASENAME" == "index.ts" || "$BASENAME" == "index.tsx" ]]; then
  exit 0
fi
if [[ "$FILE_PATH" == *.test.* || "$FILE_PATH" == *.stories.* || "$FILE_PATH" == *.styles.ts || "$FILE_PATH" == *.schema.ts ]]; then
  exit 0
fi

# Only check files directly inside the tracked directories
DIR=$(dirname "$FILE_PATH")
DIR_NAME=$(basename "$DIR")

TRACKED_DIRS="hooks components types constants services store"
MATCH=0
for D in $TRACKED_DIRS; do
  if [[ "$DIR_NAME" == "$D" || "$FILE_PATH" == *"/src/$D/"* ]]; then
    MATCH=1
    break
  fi
done

if [[ "$MATCH" == "0" ]]; then
  exit 0
fi

# Check that an index.ts exists alongside the file
INDEX_FILE="$DIR/index.ts"
if [[ ! -f "$INDEX_FILE" ]]; then
  MSG="No index.ts found alongside $FILE_PATH. Every directory in hooks/, components/, types/, constants/, services/, store/ MUST have an index.ts that barrel-exports all modules. Create $INDEX_FILE and add the appropriate export. Source: 03-coding-principles.md"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
  exit 0
fi

# Check that the file's name (without extension) is exported from index.ts
MODULE_NAME="${BASENAME%.*}"
MODULE_NAME="${MODULE_NAME%.*}"  # strip second extension for .test.ts etc (already filtered above)

if ! grep -qE "export.+['\"]\./${MODULE_NAME}['\"]|export.+from.*${MODULE_NAME}" "$INDEX_FILE"; then
  MSG="$FILE_PATH is not exported from $INDEX_FILE. Add a re-export for '$MODULE_NAME' to $INDEX_FILE, e.g.: export { $MODULE_NAME } from './$MODULE_NAME'; Source: 03-coding-principles.md"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
fi

exit 0
