#!/usr/bin/env bash
set -euo pipefail

if rg -n "^(<<<<<<<|=======|>>>>>>>)" -g'*' --hidden --glob '!node_modules' .; then
  echo "Conflict markers detected. Resolve merge conflicts before deploy."
  exit 1
fi

echo "No merge conflict markers found."
