import { Rational as R } from "../numbers/rational.mjs";

const ZERO = new R(0);
const ONE = new R(1);
const MAX_SIZE = 50;
const toR = (v) => (v instanceof R ? v : R.parse(v));
const isZero = (v) => v.cmp(ZERO) === 0;

export function matNormalize(m) {
  if (!Array.isArray(m) || m.length === 0 || !Array.isArray(m[0]) || m[0].length === 0) {
    throw new TypeError("INVALID_MATRIX");
  }
  const cols = m[0].length;
  for (const row of m) {
    if (!Array.isArray(row) || row.length !== cols) throw new TypeError("INVALID_MATRIX");
  }
  if (m.length > MAX_SIZE || cols > MAX_SIZE) throw new RangeError("SIZE_LIMIT");
  return m.map((row) => row.map(toR));
}

export function matIdentity(n) {
  if (!Number.isInteger(n) || n < 1 || n > MAX_SIZE) throw new RangeError("SIZE_LIMIT");
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? ONE : ZERO)));
}

export function matTranspose(m) {
  const a = matNormalize(m);
  return a[0].map((_, j) => a.map((row) => row[j]));
}

export function matMul(x, y) {
  const a = matNormalize(x);
  const b = matNormalize(y);
  if (a[0].length !== b.length) throw new RangeError("DIMENSION_MISMATCH");
  return a.map((row) =>
    b[0].map((_, j) => row.reduce((acc, v, k) => acc.add(v.mul(b[k][j])), ZERO)),
  );
}

// Gauss-Jordan៖ ត្រឡប់ម៉ាទ្រីស RREF និងបញ្ជីជួរឈរ pivot
function rref(m) {
  const a = m.map((r) => r.slice());
  const rows = a.length;
  const cols = a[0].length;
  const pivots = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let p = r;
    while (p < rows && isZero(a[p][c])) p++;
    if (p === rows) continue;
    [a[r], a[p]] = [a[p], a[r]];
    const pv = a[r][c];
    a[r] = a[r].map((v) => v.div(pv));
    for (let i = 0; i < rows; i++) {
      if (i !== r && !isZero(a[i][c])) {
        const f = a[i][c];
        a[i] = a[i].map((v, k) => v.sub(f.mul(a[r][k])));
      }
    }
    pivots.push(c);
    r++;
  }
  return { a, pivots };
}

export function matRank(m) {
  return rref(matNormalize(m)).pivots.length;
}

export function matDet(m) {
  const a = matNormalize(m);
  const n = a.length;
  if (a[0].length !== n) throw new RangeError("NOT_SQUARE");
  let det = ONE;
  let sign = 1;
  for (let c = 0; c < n; c++) {
    let p = c;
    while (p < n && isZero(a[p][c])) p++;
    if (p === n) return ZERO;
    if (p !== c) { [a[c], a[p]] = [a[p], a[c]]; sign = -sign; }
    det = det.mul(a[c][c]);
    for (let r = c + 1; r < n; r++) {
      const f = a[r][c].div(a[c][c]);
      for (let k = c; k < n; k++) a[r][k] = a[r][k].sub(f.mul(a[c][k]));
    }
  }
  return sign < 0 ? det.neg() : det;
}

export function matInverse(m) {
  const a = matNormalize(m);
  const n = a.length;
  if (a[0].length !== n) throw new RangeError("NOT_SQUARE");
  if (isZero(matDet(a))) throw new RangeError("SINGULAR_MATRIX");
  const id = matIdentity(n);
  const aug = a.map((row, i) => row.concat(id[i]));
  const { a: out } = rref(aug);
  return out.map((row) => row.slice(n));
}

// A·x = b  (A: n×m, b: វ៉ិចទ័រប្រវែង n)
export function solveSystem(A, b) {
  const a = matNormalize(A);
  if (!Array.isArray(b) || b.length !== a.length) throw new RangeError("DIMENSION_MISMATCH");
  const m = a[0].length;
  const aug = a.map((row, i) => row.concat([toR(b[i])]));
  const { a: out, pivots } = rref(aug);
  if (pivots.includes(m)) return { type: "none" };
  if (pivots.length === m) {
    const x = Array(m).fill(ZERO);
    pivots.forEach((c, i) => { x[c] = out[i][m]; });
    return { type: "one", x };
  }
  return { type: "infinite", rank: pivots.length, freeVariables: m - pivots.length };
}
