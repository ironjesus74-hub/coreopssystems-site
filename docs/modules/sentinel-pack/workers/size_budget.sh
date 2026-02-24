#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

echo "== Size budget (warn-only) =="
# list biggest 15 files under docs/
find docs -type f -printf "%s %p\n" 2>/dev/null | sort -nr | head -n 15 | awk '{
  sz=$1; $1=""; sub(/^ /,"");
  mb=sz/1024/1024;
  printf("%.2fMB  %s\n", mb, $0);
}'
