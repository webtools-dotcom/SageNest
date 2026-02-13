#!/usr/bin/env bash
set -euo pipefail

pattern='^([<]{7}|[=]{7}|[>]{7})'

if command -v rg >/dev/null 2>&1; then
  if rg -n "$pattern" -g'*' --hidden --glob '!node_modules' --glob '!.git' .; then
    echo "Conflict markers detected. Resolve merge conflicts before deploy."
    exit 1
  fi
else
  if grep -R -nE "$pattern" . --exclude-dir=node_modules --exclude-dir=.git; then
    echo "Conflict markers detected. Resolve merge conflicts before deploy."
    exit 1
  fi
fi

echo "No merge conflict markers found."
