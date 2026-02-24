#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

echo "== Heredoc doctor (warn-only) =="

python3 - <<'PY' 2>/dev/null || python - <<'PY'
import pathlib, re, sys

root = pathlib.Path(".")
sh_files = [p for p in root.rglob("*.sh") if ".git" not in p.parts]

def scan(file):
    s = file.read_text(errors="ignore").splitlines()
    # crude: find delimiters after <<
    delims = []
    for i,line in enumerate(s):
        m = re.search(r'<<-?\s*(["\']?)([A-Za-z0-9_]+)\1', line)
        if m:
            delims.append((i+1, m.group(2)))
    # for each delimiter, ensure a standalone closing line exists somewhere after it
    problems = []
    for ln, d in delims:
        found = False
        for j in range(ln, len(s)):
            if s[j].strip() == d:
                found = True
                break
        if not found:
            problems.append((ln,d))
    return problems

warns = 0
for f in sh_files:
    probs = scan(f)
    if probs:
        warns += 1
        print(f"[WARN] {f}")
        for ln,d in probs[:6]:
            print(f"  line {ln}: heredoc delimiter '{d}' has no closing line later")

if warns == 0:
    print("No obvious heredoc issues detected ✅")
else:
    print(f"Warnings: {warns} file(s) have suspicious heredoc patterns (review manually).")
PY

echo "Done"
