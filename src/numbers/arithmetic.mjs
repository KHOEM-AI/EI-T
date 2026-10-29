import { Rational as R } from "./rational.mjs";

// បូក ដក គុណ ចែក ពិតប្រាកដ
const toR = (x) => (x instanceof R ? x : R.parse(x));

export const add = (a, b) => toR(a).add(toR(b));
export const sub = (a, b) => toR(a).sub(toR(b));
export const mul = (a, b) => toR(a).mul(toR(b));
export const div = (a, b) => toR(a).div(toR(b));
