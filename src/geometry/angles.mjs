import { Rational as R } from "../numbers/rational.mjs";

const toR = (v) => (v instanceof R ? v : R.parse(v));
const ZERO = new R(0);
const RIGHT = new R(90);
const STRAIGHT = new R(180);
const FULL = new R(360);

// π ប្រហាក់ប្រហែល 50 ខ្ទង់ (មិនមែនតម្លៃពិតប្រាកដ)
const PI_APPROX = R.parse("3.14159265358979323846264338327950288419716939937510");
const MAX_DIGITS = 40;

// ចំណាត់ថ្នាក់មុំ ក្នុងចន្លោះ 0° ដល់ 360°
export function classifyAngle(deg) {
  const a = toR(deg);
  if (a.cmp(ZERO) < 0 || a.cmp(FULL) > 0) throw new RangeError("ANGLE_OUT_OF_RANGE");
  if (a.cmp(ZERO) === 0) return "zero";
  if (a.cmp(RIGHT) < 0) return "acute";
  if (a.cmp(RIGHT) === 0) return "right";
  if (a.cmp(STRAIGHT) < 0) return "obtuse";
  if (a.cmp(STRAIGHT) === 0) return "straight";
  if (a.cmp(FULL) < 0) return "reflex";
  return "full";
}

// បញ្ចូលមុំទៅក្នុង [0, 360)
export function normalizeDegrees(deg) {
  const a = toR(deg);
  const m = a.d * 360n;
  let k = a.n / m;
  if (a.n % m !== 0n && a.n < 0n) k -= 1n;
  return a.sub(new R(360n * k));
}

// ពិតប្រាកដ៖ rad = k·π ត្រឡប់ k
export function degToRadPi(deg) {
  return toR(deg).div(new R(180));
}

export function radPiToDeg(k) {
  return toR(k).mul(new R(180));
}

// ប្រហាក់ប្រហែល៖ តម្លៃរ៉ាដ្យង់ជាទសភាគ (string)
export function radiansApprox(deg, digits = 10) {
  if (!Number.isInteger(digits) || digits < 0 || digits > MAX_DIGITS) {
    throw new RangeError("PRECISION_LIMIT");
  }
  return degToRadPi(deg).mul(PI_APPROX).toDecimal(digits);
}

// មុំបំពេញ (បូកគ្នា 90°)
export function complement(deg) {
  const a = toR(deg);
  if (a.cmp(ZERO) < 0 || a.cmp(RIGHT) > 0) throw new RangeError("ANGLE_OUT_OF_RANGE");
  return RIGHT.sub(a);
}

// មុំបន្ថែម (បូកគ្នា 180°)
export function supplement(deg) {
  const a = toR(deg);
  if (a.cmp(ZERO) < 0 || a.cmp(STRAIGHT) > 0) throw new RangeError("ANGLE_OUT_OF_RANGE");
  return STRAIGHT.sub(a);
}
