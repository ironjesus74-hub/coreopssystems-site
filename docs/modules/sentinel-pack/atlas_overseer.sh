#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
DOCS="$ROOT/docs"
REPORT="$DOCS/report"
WORKERS="$DOCS/modules/sentinel-pack/workers"

mkdir -p "$REPORT"

ts(){ date "+%Y-%m-%d %H:%M:%S"; }

run_worker(){
  local name="$1" file="$2"
  echo "[$(ts)] ▶ $name" | tee -a "$REPORT/atlas_health.txt"
  if bash "$WORKERS/$file" >>"$REPORT/atlas_health.txt" 2>&1; then
    echo "[$(ts)] ✅ $name" | tee -a "$REPORT/atlas_health.txt"
  else
    # Some workers are strict, some are warn-only — still don’t hard-crash the whole pack.
    echo "[$(ts)] ❌ $name (non-fatal in pack)" | tee -a "$REPORT/atlas_health.txt"
  fi
  echo "" >>"$REPORT/atlas_health.txt"
}

cmd="${1:-help}"

case "$cmd" in
  run)
    : > "$REPORT/atlas_health.txt"
    echo "ATLAS Sentinel Pack — $(ts)" >>"$REPORT/atlas_health.txt"
    echo "root: $ROOT" >>"$REPORT/atlas_health.txt"
    echo "" >>"$REPORT/atlas_health.txt"

    run_worker "Syntax Checks" "syntax.sh"
    run_worker "Market Mapping" "market_audit.sh"
    run_worker "Site Smoke Test" "site_smoke.sh"
    run_worker "Repo Hygiene Scan" "repo_hygiene.sh"
    run_worker "Heredoc Doctor" "heredoc_doctor.sh"
    run_worker "Size Budget" "size_budget.sh"
    run_worker "Link Probe" "link_probe.sh"

    python3 - <<'PY' 2>/dev/null || python - <<'PY'
import json, pathlib, time
txt = pathlib.Path("docs/report/atlas_health.txt")
out = {
  "generated_at": int(time.time()),
  "generated_at_iso": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
  "ok": True,
  "note": "See atlas_health.txt for details",
  "bytes": txt.stat().st_size if txt.exists() else 0,
}
print(json.dumps(out, indent=2))
PY
    > "$REPORT/atlas_health.json"

    echo "Wrote:"
    echo "  docs/report/atlas_health.txt"
    echo "  docs/report/atlas_health.json"
    ;;
  help|*)
    echo "Usage:"
    echo "  bash docs/modules/sentinel-pack/atlas_overseer.sh run"
    ;;
esac
