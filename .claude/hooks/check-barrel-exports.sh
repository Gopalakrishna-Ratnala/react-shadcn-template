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

# Skip vendored shadcn primitives entirely — ui/ is never manually edited and has
# no barrel file by shadcn CLI convention (each primitive is imported by direct path)
if [[ "$FILE_PATH" == */src/components/ui/* ]]; then
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

# Check that the file's name (without its final extension) is exported from index.ts.
# Only strip the final .ts/.tsx extension - do NOT also strip a second "extension"
# like .types/.constants/.mapper, since those are meaningful parts of the module
# name, not a double file-type suffix. (.test./.stories./.styles./.schema. files
# are already filtered out above, so there's no legitimate double-extension case
# left here that would need a second strip - a second strip only mangles real
# names like "common.types.ts" -> "common" instead of the correct "common.types".)
MODULE_NAME="${BASENAME%.*}"

if ! grep -qE "export.+['\"]\./${MODULE_NAME}['\"]|export.+from.*${MODULE_NAME}" <(tr '\n' ' ' < "$INDEX_FILE"); then
  MSG="$FILE_PATH is not exported from $INDEX_FILE. Add a re-export to $INDEX_FILE for the actual named export(s) this file defines, from './$MODULE_NAME' — e.g. export { MyThing } from './$MODULE_NAME'; or, for a types-only file, export type { MyType } from './$MODULE_NAME';. Source: 03-coding-principles.md"
  jq -n --arg msg "$MSG" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $msg}}'
fi

exit 0
