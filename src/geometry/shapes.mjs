import { Rational as R } from "../numbers/rational.mjs";

const ZERO = new R(0);
const toR = (v) => (v instanceof R ? v : R.parse(v));
const positive = (v) => {
  const r = toR(v);
  if (r.cmp(ZERO) <= 0) throw new RangeError("NON_POSITIVE_DIMENSION");
  return r;
};

export const rectangleArea = (w, h) => positive(w).mul(positive(h));
export const rectanglePerimeter = (w, h) => positive(w).add(positive(h)).mul(new R(2));
export const squareArea = (s) => positive(s).mul(positive(s));

// ត្រីកោណ៖ ផ្ទៃ = ½ × គ្រឹះ × កម្ពស់
export const triangleAreaBaseHeight = (b, h) => positive(b).mul(positive(h)).div(new R(2));

export function triangleValidate(a, b, c) {
  const [x, y, z] = [positive(a), positive(b), positive(c)];
  return x.add(y).cmp(z) > 0 && x.add(z).cmp(y) > 0 && y.add(z).cmp(x) > 0;
}

export function trianglePerimeter(a, b, c) {
  if (!triangleValidate(a, b, c)) throw new RangeError("INVALID_TRIANGLE");
  return toR(a).add(toR(b)).add(toR(c));
}

// Heron៖ 16·Area² = s(s-a)(s-b)(s-c) ×16 ត្រឡប់ area² ពិតប្រាកដ
export function triangleAreaSquared(a, b, c) {
  if (!triangleValidate(a, b, c)) throw new RangeError("INVALID_TRIANGLE");
  const [x, y, z] = [toR(a), toR(b), toR(c)];
  const s = x.add(y).add(z).div(new R(2));
  return s.mul(s.sub(x)).mul(s.sub(y)).mul(s.sub(z));
}

// ចំណាត់ថ្នាក់តាមជ្រុង
export function classifyTriangleBySides(a, b, c) {
  if (!triangleValidate(a, b, c)) throw new RangeError("INVALID_TRIANGLE");
  const [x, y, z] = [toR(a), toR(b), toR(c)];
  const eq = (p, q) => p.cmp(q) === 0;
  if (eq(x, y) && eq(y, z)) return "equilateral";
  if (eq(x, y) || eq(y, z) || eq(x, z)) return "isosceles";
  return "scalene";
}

// ចំណាត់ថ្នាក់តាមមុំ (ពិតប្រាកដ ដោយប្រៀបធៀប c² នឹង a²+b²)
export function classifyTriangleByAngles(a, b, c) {
  if (!triangleValidate(a, b, c)) throw new RangeError("INVALID_TRIANGLE");
  const [p, q, r] = [toR(a), toR(b), toR(c)].sort((m, n) => m.cmp(n));
  const lhs = p.mul(p).add(q.mul(q));
  const rhs = r.mul(r);
  const k = lhs.cmp(rhs);
  return k === 0 ? "right" : k > 0 ? "acute" : "obtuse";
}

// រង្វង់៖ ត្រឡប់មេគុណនៃ π ពិតប្រាកដ
export const circleAreaPi = (r) => positive(r).mul(positive(r));
export const circleCircumferencePi = (r) => positive(r).mul(new R(2));

const PI_APPROX = R.parse("3.14159265358979323846264338327950288419716939937510");
export function circleAreaApprox(r, digits = 10) {
  if (!Number.isInteger(digits) || digits < 0 || digits > 40) throw new RangeError("PRECISION_LIMIT");
  return circleAreaPi(r).mul(PI_APPROX).toDecimal(digits);
}
