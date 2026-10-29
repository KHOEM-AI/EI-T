import test from "node:test";
import assert from "node:assert/strict";
import {
  molesFromParticles, particlesFromMoles, molesFromMass, massFromMoles, getConstant,
} from "../src/index.mjs";

test("ម៉ូល និងភាគល្អិត (N_A)", () => {
  const NA = getConstant("N_A").value;
  assert.equal(particlesFromMoles("1").cmp(NA), 0);
  assert.equal(molesFromParticles("602214076000000000000000").toFraction(), "1");
  assert.equal(molesFromParticles(NA.toFraction()).toFraction(), "1");
});

test("ម៉ូល និងម៉ាស", () => {
  assert.equal(molesFromMass("36", "18").toFraction(), "2");
  assert.equal(massFromMoles("2", "18").toFraction(), "36");
  assert.throws(() => molesFromMass("1", "0"), { message: "DIVISION_BY_ZERO" });
});
