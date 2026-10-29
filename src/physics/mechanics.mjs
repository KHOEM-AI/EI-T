import { Rational as R } from "../numbers/rational.mjs";
import { getConstant } from "../constants/constants.mjs";

// មេកានិច (SI: kg, m, s) ពិតប្រាកដដោយ Rational
const toR = (x) => (x instanceof R ? x : R.parse(x));

// ល្បឿន v = d / t
export const speed = (d, t) => toR(d).div(toR(t));

// កម្លាំង F = m · a
export const force = (m, a) => toR(m).mul(toR(a));

// ទម្ងន់ W = m · g_n
export const weight = (m) => toR(m).mul(getConstant("g_n").value);

// ថាមពលស៊ីនេទិច E = ½ · m · v²
export const kineticEnergy = (m, v) => {
  const vv = toR(v);
  return toR(m).mul(vv).mul(vv).div(new R(2));
};

// ដង់ស៊ីតេ ρ = m / V
export const density = (m, V) => toR(m).div(toR(V));

// សម្ពាធ P = F / A
export const pressure = (F, A) => toR(F).div(toR(A));

// កិច្ចការ W = F · d
export const work = (F, d) => toR(F).mul(toR(d));

// ថាមពល (power) P = W / t
export const power = (W, t) => toR(W).div(toR(t));
