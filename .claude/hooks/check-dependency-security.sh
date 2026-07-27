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
# Blocks git commit when npm audit reports any vulnerability.
# Enforces: dependency-security skill — zero vulnerabilities before every push.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only intercept Bash tool calls that include a git commit
if [[ "$TOOL_NAME" != "Bash" ]]; then
  exit 0
fi

if ! echo "$COMMAND" | grep -qE '^\s*git\s+commit'; then
  exit 0
fi

# Run audit and capture JSON output
AUDIT_OUTPUT=$(cd "$CLAUDE_PROJECT_DIR" && npm audit --json 2>/dev/null)
TOTAL=$(echo "$AUDIT_OUTPUT" | jq '.metadata.vulnerabilities | .critical + .high + .moderate + .low' 2>/dev/null || echo "0")

if [[ "$TOTAL" -eq 0 ]]; then
  exit 0
fi

# Extract counts per severity for the error message
CRITICAL=$(echo "$AUDIT_OUTPUT" | jq '.metadata.vulnerabilities.critical' 2>/dev/null || echo "0")
HIGH=$(echo "$AUDIT_OUTPUT" | jq '.metadata.vulnerabilities.high' 2>/dev/null || echo "0")
MODERATE=$(echo "$AUDIT_OUTPUT" | jq '.metadata.vulnerabilities.moderate' 2>/dev/null || echo "0")
LOW=$(echo "$AUDIT_OUTPUT" | jq '.metadata.vulnerabilities.low' 2>/dev/null || echo "0")

echo "BLOCKED: npm audit found $TOTAL vulnerability(ies) — commit rejected." >&2
echo "" >&2
echo "  Critical : $CRITICAL" >&2
echo "  High     : $HIGH" >&2
echo "  Moderate : $MODERATE" >&2
echo "  Low      : $LOW" >&2
echo "" >&2
echo "Run /dependency-security to audit, fix, and document all vulnerabilities before committing." >&2

exit 2
