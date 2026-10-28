import test from "node:test";
import assert from "node:assert/strict";
import { solveLinear, solveQuadratic, exactSqrt } from "../src/algebra/equations.mjs";

test("សមីការលីនេអ៊ែរ", () => {
  assert.equal(solveLinear("2", "3", "7").x.toFraction(), "2");
  assert.equal(solveLinear("3", "0", "1").x.toFraction(), "1/3");
  assert.equal(solveLinear("0", "5", "5").type, "infinite");
  assert.equal(solveLinear("0", "5", "6").type, "none");
});

test("exactSqrt", () => {
  assert.equal(exactSqrt("9/4").toFraction(), "3/2");
  assert.equal(exactSqrt("0").toFraction(), "0");
  assert.equal(exactSqrt("2"), null);
  assert.equal(exactSqrt("-4"), null);
});

test("សមីការការ៉េ ឫសសនិទាន", () => {
  const r = solveQuadratic("1", "-3", "2");
  assert.equal(r.type, "two");
  assert.equal(r.x1.toFraction(), "1");
  assert.equal(r.x2.toFraction(), "2");
});

test("ឫសស្ទួន និងគ្មានឫសពិត", () => {
  const r = solveQuadratic("1", "2", "1");
  assert.equal(r.type, "one");
  assert.equal(r.x.toFraction(), "-1");
  assert.equal(solveQuadratic("1", "0", "1").type, "complex");
});

test("ឫសអសនិទាន x² - 2 = 0", () => {
  const r = solveQuadratic("1", "0", "-2");
  assert.equal(r.type, "irrational");
  assert.equal(r.p.toFraction(), "0");
  assert.equal(r.radicand.toFraction(), "2");
});

test("កំហុស", () => {
  assert.throws(() => solveQuadratic("0", "1", "1"), /NOT_QUADRATIC/);
});
