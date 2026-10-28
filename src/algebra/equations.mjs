import { Rational as R } from "../numbers/rational.mjs";

const ZERO = new R(0);
const toR = (v) => (v instanceof R ? v : R.parse(v));

// BigInt isqrt (Newton) ត្រឡប់ floor(√n)
function isqrt(n) {
  if (n < 2n) return n;
  let x = n;
  let y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + n / x) / 2n; }
  return x;
}

// ឫសការ៉េពិតប្រាកដនៃ Rational ឬ null បើមិនមែនការ៉េល្អឥតខ្ចោះ
export function exactSqrt(v) {
  const r = toR(v);
  if (r.cmp(ZERO) < 0) return null;
  const a = isqrt(r.n);
  const b = isqrt(r.d);
  return a * a === r.n && b * b === r.d ? new R(a, b) : null;
}

// ax + b = c
export function solveLinear(a, b, c) {
  const [A, B, C] = [toR(a), toR(b), toR(c)];
  if (A.cmp(ZERO) === 0) {
    return B.cmp(C) === 0 ? { type: "infinite" } : { type: "none" };
  }
  return { type: "one", x: C.sub(B).div(A) };
}

// ax² + bx + c = 0
export function solveQuadratic(a, b, c) {
  const [A, B, C] = [toR(a), toR(b), toR(c)];
  if (A.cmp(ZERO) === 0) throw new RangeError("NOT_QUADRATIC");
  const D = B.mul(B).sub(new R(4).mul(A).mul(C));
  const twoA = new R(2).mul(A);
  const p = B.neg().div(twoA);
  const k = D.cmp(ZERO);
  if (k === 0) return { type: "one", discriminant: D, x: p };
  if (k < 0) return { type: "complex", discriminant: D };
  const s = exactSqrt(D);
  if (s) {
    const d = s.div(twoA);
    const r1 = p.sub(d);
    const r2 = p.add(d);
    const [x1, x2] = r1.cmp(r2) <= 0 ? [r1, r2] : [r2, r1];
    return { type: "two", discriminant: D, x1, x2 };
  }
  // ឫសអសនិទាន៖ x = p ± √(D / (2a)²)
  return { type: "irrational", discriminant: D, p, radicand: D.div(twoA.mul(twoA)) };
}
