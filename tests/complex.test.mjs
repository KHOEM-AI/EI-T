import test from "node:test";
import assert from "node:assert/strict";
import { cAdd, cSub, cMul, cDiv, cConj, cAbs2, cPowInt, cToString as s } from "../src/numbers/complex.mjs";

test("បូក ដក គុណ", () => {
  assert.equal(s(cAdd(["1", "2"], ["3", "4"])), "4+6i");
  assert.equal(s(cSub(["1", "2"], ["3", "4"])), "-2-2i");
  assert.equal(s(cMul(["1", "2"], ["3", "4"])), "-5+10i");
  assert.equal(s(cMul(["0", "1"], ["0", "1"])), "-1");
});
test("ចែក conjugate abs²", () => {
  assert.equal(s(cDiv(["1", "2"], ["3", "4"])), "11/25+2/25i");
  assert.equal(s(cConj(["1", "2"])), "1-2i");
  assert.equal(cAbs2(["3", "4"]).toFraction(), "25");
});
test("ស្វ័យគុណ", () => {
  assert.equal(s(cPowInt(["1", "1"], 2)), "2i");
  assert.equal(s(cPowInt(["1", "1"], -1)), "1/2-1/2i");
  assert.equal(s(cPowInt(["0", "1"], 4)), "1");
  assert.equal(s(cPowInt(["2", "3"], 0)), "1");
});
test("កំហុស", () => {
  assert.throws(() => cDiv(["1", "1"], ["0", "0"]), /DIVISION_BY_ZERO/);
  assert.throws(() => cPowInt(["0", "0"], -1), /UNDEFINED_POWER/);
  assert.throws(() => cAdd(["1"], ["1", "2"]), /INVALID_COMPLEX/);
  assert.throws(() => cPowInt(["1", "1"], 1001), /EXPONENT_LIMIT/);
});
