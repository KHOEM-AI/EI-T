import test from "node:test";
import assert from "node:assert/strict";
import { solveSystem2 } from "../src/algebra/systems.mjs";

test("ចម្លើយតែមួយ", () => {
  const r = solveSystem2("1", "1", "3", "1", "-1", "1");
  assert.equal(r.type, "one");
  assert.equal(r.x.toFraction(), "2");
  assert.equal(r.y.toFraction(), "1");
});

test("ចម្លើយប្រភាគ", () => {
  const r = solveSystem2("2", "3", "1", "4", "-1", "2");
  assert.equal(r.x.toFraction(), "1/2");
  assert.equal(r.y.toFraction(), "0");
});

test("គ្មានចម្លើយ និងច្រើនឥតកំណត់", () => {
  assert.equal(solveSystem2("1", "1", "2", "2", "2", "5").type, "none");
  assert.equal(solveSystem2("1", "1", "2", "2", "2", "4").type, "infinite");
  assert.equal(solveSystem2("0", "0", "1", "1", "1", "1").type, "none");
  assert.equal(solveSystem2("0", "0", "0", "0", "0", "0").type, "infinite");
});
