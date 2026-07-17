#!/bin/bash
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
