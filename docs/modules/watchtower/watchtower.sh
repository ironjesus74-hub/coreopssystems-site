#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# Watchtower v1 (demo)
# Safe uptime checks for endpoints you own or have permission to monitor.

APP="watchtower"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CFG="${WATCHTOWER_CONFIG:-$DIR/watchtower.conf}"
LOG="${WATCHTOWER_LOG:-$DIR/watchtower.log}"
STATE="${WATCHTOWER_STATE:-$DIR/watchtower_state.tsv}"

ts(){ date +"%Y-%m-%d %H:%M:%S"; }

need(){
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing dependency: $1"
    echo "Install in Termux: pkg install $1 -y"
    exit 1
  }
}

notify(){
  local title="$1" msg="$2"
  echo "[$(ts)] $title — $msg" | tee -a "$LOG" >/dev/null
  if command -v termux-notification >/dev/null 2>&1; then
    termux-notification --title "$title" --content "$msg" >/dev/null 2>&1 || true
  fi
}

init_cfg(){
  if [ -f "$CFG" ]; then
    echo "Config already exists: $CFG"
    exit 0
  fi
  cat > "$CFG" <<'CONF'
# Watchtower config (pipe-delimited)
# name|url|expect|timeout
# expect:
#   - set to 200 for strict
#   - set to 0 to accept any 2xx/3xx
#
# Examples:
# My Site|https://example.com|0|8
# API Health|https://example.com/health|200|6

INTERVAL=60
RETRIES=1
QUIET_HOURS=0-0   # 0-0 disables quiet hours (use "23-7" to suppress notifications overnight)

TARGET=My Site|https://example.com|0|8
CONF
  echo "Wrote: $CFG"
  echo "Edit it, then run: ./watchtower.sh check"
}

load_kv(){
  # Read simple KEY=VALUE pairs from CFG (INTERVAL/RETRIES/QUIET_HOURS)
  INTERVAL=60
  RETRIES=1
  QUIET_HOURS="0-0"

  while IFS= read -r line; do
    line="${line%%#*}"
    line="$(echo "$line" | tr -d '\r')"
    [ -z "$line" ] && continue

    if [[ "$line" == INTERVAL=* ]]; then INTERVAL="${line#INTERVAL=}"; fi
    if [[ "$line" == RETRIES=* ]]; then RETRIES="${line#RETRIES=}"; fi
    if [[ "$line" == QUIET_HOURS=* ]]; then QUIET_HOURS="${line#QUIET_HOURS=}"; fi
  done < "$CFG"
}

in_quiet(){
  # QUIET_HOURS like "23-7"
  local q="$QUIET_HOURS"
  local start="${q%-*}" end="${q#*-}"
  local h
  h="$(date +%H | sed 's/^0//')"
  h="${h:-0}"

  # disabled
  if [ "$start" = "0" ] && [ "$end" = "0" ]; then
    return 1
  fi

  # normal range
  if [ "$start" -lt "$end" ]; then
    [ "$h" -ge "$start" ] && [ "$h" -lt "$end" ] && return 0 || return 1
  fi

  # wraps midnight
  [ "$h" -ge "$start" ] || [ "$h" -lt "$end" ]
}

check_one(){
  local name="$1" url="$2" expect="$3" timeout="$4"

  local best_code="" best_ms="" ok="0"

  for attempt in $(seq 1 "$((RETRIES+1))"); do
    local start_ns end_ns dur_ms code
    start_ns="$(date +%s%N 2>/dev/null || true)"

    code="$(curl -L -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" || echo 000)"

    end_ns="$(date +%s%N 2>/dev/null || true)"
    if [[ -n "$start_ns" && -n "$end_ns" && "$start_ns" =~ ^[0-9]+$ && "$end_ns" =~ ^[0-9]+$ ]]; then
      dur_ms="$(( (end_ns - start_ns) / 1000000 ))"
    else
      dur_ms="?"
    fi

    best_code="$code"
    best_ms="$dur_ms"

    if [ "$expect" = "0" ]; then
      # accept 2xx/3xx
      if [[ "$code" =~ ^[23][0-9][0-9]$ ]]; then ok="1"; break; fi
    else
      if [ "$code" = "$expect" ]; then ok="1"; break; fi
    fi
    sleep 1
  done

  echo "$name|$url|$expect|$timeout|$best_code|$best_ms|$ok"
}

state_get_fail(){
  local name="$1"
  [ -f "$STATE" ] || { echo "0"; return; }
  awk -F'\t' -v n="$name" '$1==n{print $6;found=1} END{if(!found)print 0}' "$STATE" 2>/dev/null || echo "0"
}

state_set(){
  local name="$1" code="$2" ms="$3" ok="$4" when="$5" fail="$6"
  touch "$STATE"

  # rewrite atomically
  local tmp="${STATE}.tmp.$$"
  awk -F'\t' -v n="$name" 'BEGIN{OFS="\t"} $1!=n{print $0}' "$STATE" > "$tmp" 2>/dev/null || true
  printf "%s\t%s\t%s\t%s\t%s\t%s\n" "$name" "$code" "$ms" "$ok" "$when" "$fail" >> "$tmp"
  mv "$tmp" "$STATE"
}

run_check(){
  need curl
  [ -f "$CFG" ] || { echo "Missing config: $CFG"; echo "Run: ./watchtower.sh init"; exit 1; }

  load_kv

  local any_fail=0
  while IFS= read -r line; do
    line="${line%%#*}"
    line="$(echo "$line" | tr -d '\r')"
    [ -z "$line" ] && continue

    if [[ "$line" == TARGET=* ]]; then
      local spec="${line#TARGET=}"
      IFS='|' read -r name url expect timeout <<< "$spec"

      name="${name:-unnamed}"
      url="${url:-}"
      expect="${expect:-0}"
      timeout="${timeout:-8}"

      [ -z "$url" ] && continue

      local res code ms ok now fail
      res="$(check_one "$name" "$url" "$expect" "$timeout")"
      IFS='|' read -r _n _u _e _t code ms ok <<< "$res"

      now="$(ts)"
      fail="$(state_get_fail "$name")"

      if [ "$ok" = "1" ]; then
        fail="0"
        echo "[$now] OK   $name ($code, ${ms}ms)" | tee -a "$LOG" >/dev/null
      else
        fail="$((fail + 1))"
        any_fail=1
        echo "[$now] FAIL $name ($code, ${ms}ms) streak=$fail" | tee -a "$LOG" >/dev/null
        if ! in_quiet; then
          notify "Watchtower alert" "$name is failing ($code) streak=$fail"
        fi
      fi

      state_set "$name" "$code" "$ms" "$ok" "$now" "$fail"
    fi
  done < "$CFG"

  return "$any_fail"
}

cmd="${1:-help}"
case "$cmd" in
  init) init_cfg ;;
  check) run_check ;;
  run)
    [ -f "$CFG" ] || { echo "Run: ./watchtower.sh init"; exit 1; }
    load_kv
    echo "Watchtower running. Interval=${INTERVAL}s  Retries=${RETRIES}  Quiet=${QUIET_HOURS}"
    while true; do
      run_check || true
      sleep "$INTERVAL"
    done
    ;;
  status)
    if [ ! -f "$STATE" ]; then
      echo "No state yet. Run: ./watchtower.sh check"
      exit 0
    fi
    echo "name | code | ms | ok | last | fail"
    awk -F'\t' '{printf "%s | %s | %s | %s | %s | %s\n",$1,$2,$3,$4,$5,$6}' "$STATE"
    ;;
  tail) tail -n 60 "$LOG" ;;
  help|*)
    cat <<HELP
Watchtower v1 (demo)
Usage:
  ./watchtower.sh init     # create config
  ./watchtower.sh check    # run one check pass
  ./watchtower.sh run      # loop forever (interval)
  ./watchtower.sh status   # show latest state
  ./watchtower.sh tail     # last 60 log lines

Config: $CFG
Log:    $LOG
State:  $STATE

Tip (Android): install Termux:API for notifications:
  pkg install termux-api -y
HELP
    ;;
esac
