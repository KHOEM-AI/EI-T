import test from "node:test";
import assert from "node:assert/strict";
import {
  polyAdd, polySub, polyMul, polyEval, polyDivide, rationalRoots,
} from "../src/algebra/polynomial.mjs";

const f = (a) => a.map((x) => x.toFraction());
const rr = (c) => {
  const { roots, remainder } = rationalRoots(c);
  return { roots: roots.map((r) => `${r.x.toFraction()}^${r.multiplicity}`), rem: f(remainder) };
};

test("ផលបូក ផលដក ផលគុណ", () => {
  assert.deepEqual(f(polyAdd(["1", "2"], ["3"])), ["1", "5"]);
  assert.deepEqual(f(polySub(["1", "1"], ["1", "1"])), ["0"]);
  assert.deepEqual(f(polyMul(["1", "1"], ["1", "-1"])), ["1", "0", "-1"]);
  assert.deepEqual(f(polyMul(["1", "-1"], ["1", "-2"])), ["1", "-3", "2"]);
});

test("គណនាតម្លៃ", () => {
  assert.equal(polyEval(["1", "-3", "2"], "3").toFraction(), "2");
  assert.equal(polyEval(["1", "-3", "2"], "1/2").toFraction(), "3/4");
});

test("ចែកពហុធា", () => {
  const a = polyDivide(["1", "0", "0", "-1"], ["1", "-1"]);
  assert.deepEqual(f(a.q), ["1", "1", "1"]);
  assert.deepEqual(f(a.r), ["0"]);
  const b = polyDivide(["1", "0", "1"], ["1", "-1"]);
  assert.deepEqual(f(b.q), ["1", "1"]);
  assert.deepEqual(f(b.r), ["2"]);
  assert.throws(() => polyDivide(["1"], ["0"]), /DIVISION_BY_ZERO/);
});

test("ឫសសនិទាន", () => {
  assert.deepEqual(rr(["1", "-3", "2"]), { roots: ["1^1", "2^1"], rem: ["1"] });
  assert.deepEqual(rr(["1", "0", "-3", "2"]), { roots: ["-2^1", "1^2"], rem: ["1"] });
  assert.deepEqual(rr(["1", "0", "-1", "0"]), { roots: ["-1^1", "0^1", "1^1"], rem: ["1"] });
  assert.deepEqual(rr(["2", "-3", "1"]), { roots: ["1/2^1", "1^1"], rem: ["2"] });
  assert.deepEqual(rr(["1/2", "-3/2", "1"]), { roots: ["1^1", "2^1"], rem: ["1/2"] });
  assert.deepEqual(rr(["1", "0", "-2"]), { roots: [], rem: ["1", "0", "-2"] });
});

test("កំហុស និងដែនកំណត់", () => {
  assert.throws(() => rationalRoots(["0"]), /ZERO_POLYNOMIAL/);
  assert.throws(() => rationalRoots(["1", "0", "-1" + "0".repeat(13)]), /PRECISION_LIMIT/);
});
