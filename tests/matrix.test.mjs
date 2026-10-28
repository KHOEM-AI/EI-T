import test from "node:test";
import assert from "node:assert/strict";
import {
  matIdentity, matTranspose, matMul, matDet, matRank, matInverse, solveSystem,
} from "../src/algebra/matrix.mjs";

const f = (m) => m.map((r) => r.map((x) => x.toFraction()));

test("គុណ និង transpose", () => {
  assert.deepEqual(f(matMul([["1", "2"], ["3", "4"]], [["5", "6"], ["7", "8"]])), [["19", "22"], ["43", "50"]]);
  assert.deepEqual(f(matTranspose([["1", "2", "3"], ["4", "5", "6"]])), [["1", "4"], ["2", "5"], ["3", "6"]]);
  assert.deepEqual(f(matIdentity(2)), [["1", "0"], ["0", "1"]]);
});

test("determinant", () => {
  assert.equal(matDet([["1", "2"], ["3", "4"]]).toFraction(), "-2");
  assert.equal(matDet([["2", "0", "0"], ["0", "3", "0"], ["0", "0", "4"]]).toFraction(), "24");
  assert.equal(matDet([["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]]).toFraction(), "0");
  assert.equal(matDet([["0", "1"], ["1", "0"]]).toFraction(), "-1");
  assert.equal(matDet([["2", "-1", "0"], ["-1", "2", "-1"], ["0", "-1", "2"]]).toFraction(), "4");
});

test("rank", () => {
  assert.equal(matRank([["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]]), 2);
  assert.equal(matRank(matIdentity(3)), 3);
});

test("inverse", () => {
  const A = [["1", "2"], ["3", "4"]];
  assert.deepEqual(f(matInverse(A)), [["-2", "1"], ["3/2", "-1/2"]]);
  assert.deepEqual(f(matMul(A, matInverse(A))), [["1", "0"], ["0", "1"]]);
  assert.throws(() => matInverse([["1", "2"], ["2", "4"]]), /SINGULAR_MATRIX/);
});

test("ប្រព័ន្ធសមីការ ៣ អញ្ញាត", () => {
  const r = solveSystem([["1", "1", "1"], ["0", "2", "5"], ["2", "5", "-1"]], ["6", "-4", "27"]);
  assert.equal(r.type, "one");
  assert.deepEqual(r.x.map((v) => v.toFraction()), ["5", "3", "-2"]);
  assert.equal(solveSystem([["1", "1"], ["1", "1"]], ["1", "2"]).type, "none");
  const inf = solveSystem([["1", "1"], ["2", "2"]], ["2", "4"]);
  assert.equal(inf.type, "infinite");
  assert.equal(inf.rank, 1);
  assert.equal(inf.freeVariables, 1);
});

test("កំហុស", () => {
  assert.throws(() => matMul([["1", "2"]], [["1", "2"]]), /DIMENSION_MISMATCH/);
  assert.throws(() => matDet([["1", "2"]]), /NOT_SQUARE/);
  assert.throws(() => matTranspose([["1", "2"], ["3"]]), /INVALID_MATRIX/);
  assert.throws(() => solveSystem([["1"]], ["1", "2"]), /DIMENSION_MISMATCH/);
});
