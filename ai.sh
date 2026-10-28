#!/usr/bin/env bash
# EI-T: exact math/number API. Starts only EI-T (default :3100).
# Usage: ./ai.sh [run|stop|restart|status]
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PORT="${PORT:-3100}"
export HOST="${HOST:-127.0.0.1}"
RUN="$DIR/.run"
PIDF="$RUN/ei-t.pid"
LOG="$RUN/ei-t.log"
mkdir -p "$RUN"

healthy() { curl -fs "http://$HOST:$PORT/health" >/dev/null 2>&1; }
ours() { [ -f "$PIDF" ] && kill -0 "$(cat "$PIDF")" 2>/dev/null; }

start() {
  if healthy; then echo "  ✔ EI-T API       :$PORT (already running)"; return 0; fi
  cd "$DIR" || exit 1
  nohup node src/server.mjs >>"$LOG" 2>&1 &
  echo $! >"$PIDF"
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    sleep 0.5
    if healthy; then echo "  ✔ EI-T API       :$PORT"; return 0; fi
  done
  echo "  ✘ EI-T API failed to start. See: $LOG" >&2
  return 1
}

stop() {
  if ours; then
    kill "$(cat "$PIDF")" 2>/dev/null
    rm -f "$PIDF"
    echo "  ■ EI-T API stopped"
  elif healthy; then
    echo "  ! :$PORT is in use by a process this script did not start" >&2
  else
    echo "  - EI-T API not running"
  fi
}

case "${1:-run}" in
  run) start ;;
  stop) stop ;;
  restart) stop; sleep 1; start ;;
  status) if healthy; then echo "  ✔ EI-T API       :$PORT"; else echo "  ✘ EI-T API not running"; fi ;;
  *) echo "Usage: $0 [run|stop|restart|status]" >&2; exit 2 ;;
esac
