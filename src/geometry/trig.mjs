import { Rational as R } from "../numbers/rational.mjs";
import { normalizeDegrees } from "./angles.mjs";

const ZERO = new R(0);
const MAX_DIGITS = 30;
const PI_APPROX = R.parse("3.14159265358979323846264338327950288419716939937510");
const toR = (v) => (v instanceof R ? v : R.parse(v));

// បង្រួមមុំចូលជ្រុងយោង 0°..90° ជាមួយសញ្ញា
function reduce(deg) {
  const a = normalizeDegrees(toR(deg));
  if (a.cmp(new R(90)) <= 0) return { ref: a, sinSign: 1, cosSign: 1 };
  if (a.cmp(new R(180)) <= 0) return { ref: new R(180).sub(a), sinSign: 1, cosSign: -1 };
  if (a.cmp(new R(270)) <= 0) return { ref: a.sub(new R(180)), sinSign: -1, cosSign: -1 };
  return { ref: new R(360).sub(a), sinSign: -1, cosSign: 1 };
}

// តម្លៃពិតប្រាកដ = coeff × √radicand
const E = (n, d, r) => ({ coeff: new R(n, d), radicand: new R(r) });
const SIN = {
  "0": E(0n, 1n, 1n), "30": E(1n, 2n, 1n), "45": E(1n, 2n, 2n),
  "60": E(1n, 2n, 3n), "90": E(1n, 1n, 1n),
};
const COS = { "0": SIN["90"], "30": SIN["60"], "45": SIN["45"], "60": SIN["30"], "90": SIN["0"] };
const TAN = { "0": E(0n, 1n, 1n), "30": E(1n, 3n, 3n), "45": E(1n, 1n, 1n), "60": E(1n, 1n, 3n) };

export function trigExact(fn, deg) {
  if (!["sin", "cos", "tan"].includes(fn)) throw new RangeError("UNKNOWN_FUNCTION");
  const { ref, sinSign, cosSign } = reduce(deg);
  const key = ref.toFraction();
  let base;
  let sign;
  if (fn === "sin") { base = SIN[key]; sign = sinSign; }
  else if (fn === "cos") { base = COS[key]; sign = cosSign; }
  else {
    if (key === "90") throw new RangeError("TAN_UNDEFINED");
    base = TAN[key];
    sign = sinSign * cosSign;
  }
  if (!base) return null;
  return { coeff: sign < 0 ? base.coeff.neg() : base.coeff, radicand: base.radicand };
}

export function exactToString(e) {
  const { coeff, radicand } = e;
  if (coeff.cmp(ZERO) === 0) return "0";
  if (radicand.cmp(new R(1)) === 0) return coeff.toFraction();
  const neg = coeff.n < 0n;
  const an = neg ? -coeff.n : coeff.n;
  const root = `${an === 1n ? "" : an}√${radicand.n}`;
  return (neg ? "-" : "") + root + (coeff.d === 1n ? "" : `/${coeff.d}`);
}

function sinTaylor(x, eps) {
  let term = x;
  let sum = x;
  let n = 1n;
  while (term.abs().cmp(eps) >= 0) {
    const k = 2n * n;
    term = term.mul(x).mul(x).neg().div(new R(k * (k + 1n)));
    sum = sum.add(term);
    n++;
  }
  return sum;
}

function cosTaylor(x, eps) {
  let term = new R(1);
  let sum = new R(1);
  let n = 1n;
  while (term.abs().cmp(eps) >= 0) {
    const k = 2n * n;
    term = term.mul(x).mul(x).neg().div(new R((k - 1n) * k));
    sum = sum.add(term);
    n++;
  }
  return sum;
}

function parts(deg, digits) {
  if (!Number.isInteger(digits) || digits < 0 || digits > MAX_DIGITS) {
    throw new RangeError("PRECISION_LIMIT");
  }
  const eps = new R(1n, 10n ** BigInt(digits + 10));
  const { ref, sinSign, cosSign } = reduce(deg);
  const x = ref.mul(PI_APPROX).div(new R(180));
  const refZero = ref.cmp(ZERO) === 0;
  const refRight = ref.cmp(new R(90)) === 0;
  const s = refZero ? ZERO : sinTaylor(x, eps);
  const c = refRight ? ZERO : cosTaylor(x, eps);
  return {
    sin: sinSign < 0 ? s.neg() : s,
    cos: cosSign < 0 ? c.neg() : c,
    cosIsZero: refRight,
  };
}

export const sinApprox = (deg, digits = 10) => parts(deg, digits).sin.toDecimal(digits);
export const cosApprox = (deg, digits = 10) => parts(deg, digits).cos.toDecimal(digits);
export function tanApprox(deg, digits = 10) {
  const p = parts(deg, digits);
  if (p.cosIsZero) throw new RangeError("TAN_UNDEFINED");
  return p.sin.div(p.cos).toDecimal(digits);
}
