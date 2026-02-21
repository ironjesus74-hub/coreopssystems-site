#!/data/data/com.termux/files/usr/bin/bash
# ATLAS Guard helpers for Termux
set -e

case "$1" in
  install-gh)
    pkg update -y
    pkg install gh -y
    echo "Now run: gh auth login"
    ;;
  runs)
    gh run list --limit 10
    ;;
  watch)
    RID=$(gh run list --limit 1 --json databaseId -q '.[0].databaseId')
    echo "Watching run: $RID"
    gh run watch "$RID"
    ;;
  logs)
    RID=$(gh run list --limit 1 --json databaseId -q '.[0].databaseId')
    gh run view "$RID" --log
    ;;
  *)
    echo "Usage:"
    echo "  ./termux_atlas.sh install-gh   # install GitHub CLI"
    echo "  ./termux_atlas.sh runs         # list recent runs"
    echo "  ./termux_atlas.sh watch        # watch latest run"
    echo "  ./termux_atlas.sh logs         # show latest run logs"
    exit 1
    ;;
esac
