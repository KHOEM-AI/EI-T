import test from "node:test";
import assert from "node:assert/strict";
import "./eit.js";

const E = globalThis.EIT;
const f = (r) => E.toFraction(r);

test("web: arithmetic", () => {
  assert.equal(f(E.add("0.1", "0.2")), "3/10");
  assert.equal(f(E.sub("1", "0.9")), "1/10");
  assert.equal(f(E.mul("3/4", "2/3")), "1/2");
  assert.equal(f(E.div("1", "3")), "1/3");
  assert.equal(f(E.div("-6", "4")), "-3/2");
  assert.equal(f(E.mul("123456789012345678901234567890", "2")), "246913578024691357802469135780");
});

test("web: errors", () => {
  assert.throws(() => E.div("1", "0"), { name: "RangeError", message: "DIVISION_BY_ZERO" });
  for (const bad of ["abc", "1.", "1e5", ""]) {
    assert.throws(() => E.add(bad, "1"), { name: "SyntaxError", message: "INVALID_NUMBER" });
  }
});

test("web: decimal", () => {
  assert.equal(E.toDecimal(E.div("1", "3"), 5), "0.33333");
  assert.equal(E.toDecimal(E.div("-1", "8"), 2), "-0.13");
  assert.equal(E.toDecimal(E.parse("5"), 0), "5");
});

test("web: mechanics and chemistry", () => {
  assert.equal(f(E.speed("100", "20")), "5");
  assert.equal(f(E.force("2", "3/2")), "3");
  assert.equal(f(E.weight("10")), "196133/2000");
  assert.equal(f(E.kineticEnergy("2", "3")), "9");
  assert.equal(f(E.density("500", "2")), "250");
  assert.equal(f(E.pressure("100", "4")), "25");
  assert.equal(f(E.work("10", "3/2")), "15");
  assert.equal(f(E.power("60", "12")), "5");
  assert.equal(f(E.molesFromParticles("602214076000000000000000")), "1");
  assert.equal(f(E.molesFromMass("36", "18")), "2");
  assert.equal(f(E.massFromMoles("2", "18")), "36");
});
