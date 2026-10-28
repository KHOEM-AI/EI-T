import { Rational as R } from "./rational.mjs";

const ONE = new R(1);
const ZERO = new R(0);
const MAX_EXP = 10000;
const toR = (v) => (v instanceof R ? v : R.parse(v));

export function powInt(x, n) {
  const base = toR(x);
  if (!Number.isInteger(n) || Math.abs(n) > MAX_EXP) throw new RangeError("EXPONENT_LIMIT");
  if (base.cmp(ZERO) === 0 && n <= 0) throw new RangeError("UNDEFINED_POWER");
  const e = BigInt(Math.abs(n));
  const p = new R(base.n ** e, base.d ** e);
  return n < 0 ? ONE.div(p) : p;
}

// log_base(x) ជា Rational ពិតប្រាកដ ឬ null
export function logExact(base, x) {
  const b = toR(base);
  const v = toR(x);
  if (b.cmp(ZERO) <= 0 || b.cmp(ONE) === 0 || v.cmp(ZERO) <= 0) throw new RangeError("LOG_DOMAIN");
  if (v.cmp(ONE) === 0) return new R(0);
  // ស្វែង p/q ដែល b^p = v^q (q ≤ 64, |p| ≤ 256)
  for (let q = 1; q <= 64; q++) {
    for (let p = -256; p <= 256; p++) {
      if (p === 0) continue;
      try {
        if (powInt(b, p).cmp(powInt(v, q)) === 0) return new R(p, q);
      } catch { /* ព្រំដែន */ }
    }
  }
  return null;
}
