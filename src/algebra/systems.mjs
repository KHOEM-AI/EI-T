import { Rational as R } from "../numbers/rational.mjs";

const ZERO = new R(0);
const toR = (v) => (v instanceof R ? v : R.parse(v));
const isZero = (v) => v.cmp(ZERO) === 0;

// a1x + b1y = c1 ; a2x + b2y = c2
export function solveSystem2(a1, b1, c1, a2, b2, c2) {
  const [A1, B1, C1, A2, B2, C2] = [a1, b1, c1, a2, b2, c2].map(toR);
  const det = A1.mul(B2).sub(A2.mul(B1));
  if (!isZero(det)) {
    const x = C1.mul(B2).sub(C2.mul(B1)).div(det);
    const y = A1.mul(C2).sub(A2.mul(C1)).div(det);
    return { type: "one", x, y };
  }
  // det = 0៖ ពិនិត្យថាសមីការទាំងពីរស្របគ្នា ឬសមមូល
  const allZeroRow1 = isZero(A1) && isZero(B1);
  const allZeroRow2 = isZero(A2) && isZero(B2);
  if (allZeroRow1 && !isZero(C1)) return { type: "none" };
  if (allZeroRow2 && !isZero(C2)) return { type: "none" };
  if (allZeroRow1 && allZeroRow2) return { type: "infinite" };
  const d1 = A1.mul(C2).sub(A2.mul(C1));
  const d2 = B1.mul(C2).sub(B2.mul(C1));
  return isZero(d1) && isZero(d2) ? { type: "infinite" } : { type: "none" };
}
