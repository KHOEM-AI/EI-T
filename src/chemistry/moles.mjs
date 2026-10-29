import { Rational as R } from "../numbers/rational.mjs";
import { getConstant } from "../constants/constants.mjs";

// គីមីវិទ្យាមូលដ្ឋាន៖ ម៉ូល (mol), ម៉ាស (g), ម៉ាសម៉ូលេគុល M (g/mol) ពិតប្រាកដ
const toR = (x) => (x instanceof R ? x : R.parse(x));
const NA = () => getConstant("N_A").value; // 6.02214076e23 /mol (ពិតប្រាកដ)

// ម៉ូល n = N / N_A
export const molesFromParticles = (N) => toR(N).div(NA());

// ចំនួនភាគល្អិត N = n · N_A
export const particlesFromMoles = (n) => toR(n).mul(NA());

// ម៉ូល n = m / M
export const molesFromMass = (m, M) => toR(m).div(toR(M));

// ម៉ាស m = n · M
export const massFromMoles = (n, M) => toR(n).mul(toR(M));
