#!/usr/bin/env bash
# Run every language test this machine can run. Missing tools are skipped, not failed.
set -u
cd "$(dirname "$0")/.."
T="${TMPDIR:-/tmp}"
export PYTHONDONTWRITEBYTECODE=1
fail=0

run()  { echo "== $1"; shift; if "$@"; then echo "   ok"; else echo "   FAILED"; fail=1; fi; }
skip() { echo "== $1"; echo "   skipped ($2)"; }

run "JavaScript, TypeScript, web (node --test)" node --test

if [ -x node_modules/.bin/tsx ]; then
  run "TSX + JSX React (tsx --test)" node_modules/.bin/tsx --test tsx/Calculator.test.tsx jsx/Calculator.test.jsx
else
  skip "TSX + JSX React" "run: npm install"
fi

if [ -x node_modules/.bin/tsc ]; then
  run "TypeScript types (tsc)" node_modules/.bin/tsc -p .
fi

if command -v python3 >/dev/null 2>&1; then
  run "Python" python3 -W error -m unittest discover -s py
else
  skip "Python" "python3 not installed: pkg install python"
fi

CC="$(command -v cc || command -v gcc || command -v clang || true)"
if [ -n "$CC" ]; then
  run "C" sh -c "'$CC' -std=c11 -Wall -Wextra -pedantic -o '$T/eit_c' c/test_eit.c && '$T/eit_c'"
else
  skip "C" "no C compiler: pkg install clang"
fi

CXX="$(command -v c++ || command -v g++ || command -v clang++ || true)"
if [ -n "$CXX" ]; then
  for t in test_arithmetic test_science; do
    run "C++ $t" sh -c "'$CXX' -std=c++17 -Wall -Wextra -pedantic -o '$T/eit_$t' cpp/$t.cpp && '$T/eit_$t'"
  done
else
  skip "C++" "no C++ compiler: pkg install clang"
fi

if [ "$fail" -eq 0 ]; then echo "ALL OK"; else echo "SOME FAILED"; fi
exit "$fail"
