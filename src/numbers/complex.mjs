import { Rational as R } from "./rational.mjs";

const toR = (v) => (v instanceof R ? v : R.parse(v));
const Z = (z) => {
  if (z && typeof z === "object" && !Array.isArray(z) && "re" in z && "im" in z) {
    return { re: toR(z.re), im: toR(z.im) };
  }
  if (!Array.isArray(z) || z.length !== 2) throw new TypeError("INVALID_COMPLEX");
  return { re: toR(z[0]), im: toR(z[1]) };
};
const out = (re, im) => ({ re, im });

// z ជាអារេ [re, im] ឧ. ["1", "2"] = 1 + 2i
export function cAdd(a, b) { const [x, y] = [Z(a), Z(b)]; return out(x.re.add(y.re), x.im.add(y.im)); }
export function cSub(a, b) { const [x, y] = [Z(a), Z(b)]; return out(x.re.sub(y.re), x.im.sub(y.im)); }
export function cMul(a, b) {
  const [x, y] = [Z(a), Z(b)];
  return out(x.re.mul(y.re).sub(x.im.mul(y.im)), x.re.mul(y.im).add(x.im.mul(y.re)));
}
export function cConj(a) { const x = Z(a); return out(x.re, x.im.neg()); }
export function cAbs2(a) { const x = Z(a); return x.re.mul(x.re).add(x.im.mul(x.im)); }
export function cDiv(a, b) {
  const n = cMul(a, cConj(b));
  const d = cAbs2(b);
  return out(n.re.div(d), n.im.div(d));
}
export function cPowInt(a, n) {
  if (!Number.isInteger(n) || Math.abs(n) > 1000) throw new RangeError("EXPONENT_LIMIT");
  let base = Z(a);
  if (n < 0 && cAbs2([base.re, base.im]).cmp(new R(0)) === 0) throw new RangeError("UNDEFINED_POWER");
  let e = Math.abs(n);
  let acc = out(new R(1), new R(0));
  let cur = out(base.re, base.im);
  while (e > 0) {
    if (e & 1) acc = cMul([acc.re, acc.im], [cur.re, cur.im]);
    cur = cMul([cur.re, cur.im], [cur.re, cur.im]);
    e >>= 1;
  }
  return n < 0 ? cDiv(["1", "0"], [acc.re, acc.im]) : acc;
}
export function cToString(a) {
  const { re, im } = Z(a);
  const zero = new R(0);
  if (im.cmp(zero) === 0) return re.toFraction();
  const ai = im.abs().toFraction() === "1" ? "i" : `${im.abs().toFraction()}i`;
  if (re.cmp(zero) === 0) return (im.cmp(zero) < 0 ? "-" : "") + ai;
  return `${re.toFraction()}${im.cmp(zero) < 0 ? "-" : "+"}${ai}`;
}
