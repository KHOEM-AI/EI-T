import { Rational as R } from "../numbers/rational.mjs";

const ZERO = new R(0);
const LIMIT = 10n ** 12n;
const toR = (v) => (v instanceof R ? v : R.parse(v));
const isZero = (v) => v.cmp(ZERO) === 0;

const gcd = (a, b) => {
  while (b) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
};

// មេគុណពីដឺក្រេខ្ពស់ទៅទាប; លុបសូន្យនាំមុខ
export function polyNormalize(coeffs) {
  if (!Array.isArray(coeffs)) throw new TypeError("INVALID_POLYNOMIAL");
  const c = coeffs.map(toR);
  if (c.length === 0) return [ZERO];
  let i = 0;
  while (i < c.length - 1 && isZero(c[i])) i++;
  return c.slice(i);
}

export function polyAdd(a, b) {
  const [x, y] = [polyNormalize(a), polyNormalize(b)];
  const n = Math.max(x.length, y.length);
  const px = Array(n - x.length).fill(ZERO).concat(x);
  const py = Array(n - y.length).fill(ZERO).concat(y);
  return polyNormalize(px.map((v, i) => v.add(py[i])));
}

export function polySub(a, b) {
  return polyAdd(a, polyNormalize(b).map((v) => v.neg()));
}

export function polyMul(a, b) {
  const [x, y] = [polyNormalize(a), polyNormalize(b)];
  const out = Array(x.length + y.length - 1).fill(ZERO);
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < y.length; j++) out[i + j] = out[i + j].add(x[i].mul(y[j]));
  }
  return polyNormalize(out);
}

// Horner
export function polyEval(coeffs, x) {
  const v = toR(x);
  return polyNormalize(coeffs).reduce((acc, c) => acc.mul(v).add(c), ZERO);
}

// ចែកពហុធា៖ num = q·den + r
export function polyDivide(num, den) {
  const n = polyNormalize(num);
  const d = polyNormalize(den);
  if (isZero(d[0])) throw new RangeError("DIVISION_BY_ZERO");
  if (n.length < d.length) return { q: [ZERO], r: n };
  const rem = n.slice();
  const q = [];
  const steps = n.length - d.length + 1;
  for (let i = 0; i < steps; i++) {
    const coef = rem[i].div(d[0]);
    q.push(coef);
    for (let j = 0; j < d.length; j++) rem[i + j] = rem[i + j].sub(coef.mul(d[j]));
  }
  return { q: polyNormalize(q), r: polyNormalize(rem.slice(steps)) };
}

function divisors(n) {
  const out = [];
  for (let i = 1n; i * i <= n; i++) {
    if (n % i === 0n) {
      out.push(i);
      if (i * i !== n) out.push(n / i);
    }
  }
  return out;
}

// ឫសសនិទានទាំងអស់ជាមួយ multiplicity + remainder (ផ្នែកគ្មានឫសសនិទាន)
export function rationalRoots(coeffs) {
  let p = polyNormalize(coeffs);
  if (p.length === 1 && isZero(p[0])) throw new RangeError("ZERO_POLYNOMIAL");
  const roots = [];

  let zeros = 0;
  while (p.length > 1 && isZero(p[p.length - 1])) { p = p.slice(0, -1); zeros++; }
  if (zeros) roots.push({ x: new R(0), multiplicity: zeros });

  if (p.length > 1) {
    let L = 1n;
    for (const c of p) L = (L / gcd(L, c.d)) * c.d;
    const ints = p.map((c) => c.n * (L / c.d));
    const abs = (v) => (v < 0n ? -v : v);
    const a0 = abs(ints[ints.length - 1]);
    const an = abs(ints[0]);
    if (a0 > LIMIT || an > LIMIT) throw new RangeError("PRECISION_LIMIT");

    const seen = new Map();
    for (const pp of divisors(a0)) {
      for (const qq of divisors(an)) {
        for (const sign of [1n, -1n]) {
          const cand = new R(sign * pp, qq);
          seen.set(cand.toFraction(), cand);
        }
      }
    }
    const candidates = [...seen.values()].sort((a, b) => a.cmp(b));

    for (const cand of candidates) {
      let m = 0;
      while (p.length > 1 && isZero(polyEval(p, cand))) {
        p = polyDivide(p, [new R(1), cand.neg()]).q;
        m++;
      }
      if (m) roots.push({ x: cand, multiplicity: m });
    }
  }

  roots.sort((a, b) => a.x.cmp(b.x));
  return { roots, remainder: p };
}
