import test from "node:test";
import assert from "node:assert/strict";
import { speed, force, weight, kineticEnergy } from "../src/index.mjs";

test("មេកានិចមូលដ្ឋាន", () => {
  assert.equal(speed("100", "20").toFraction(), "5");
  assert.equal(force("2", "3/2").toFraction(), "3");
  assert.equal(weight("10").toFraction(), "196133/2000");
  assert.equal(kineticEnergy("2", "3").toFraction(), "9");
});

test("ល្បឿនពេលវេលាសូន្យ", () => {
  assert.throws(() => speed("1", "0"), { message: "DIVISION_BY_ZERO" });
});

test("ដង់ស៊ីតេ សម្ពាធ កិច្ចការ ថាមពល", async () => {
  const { density, pressure, work, power } = await import("../src/index.mjs");
  assert.equal(density("500", "2").toFraction(), "250");
  assert.equal(pressure("100", "4").toFraction(), "25");
  assert.equal(work("10", "3/2").toFraction(), "15");
  assert.equal(power("60", "12").toFraction(), "5");
  assert.throws(() => density("1", "0"), { message: "DIVISION_BY_ZERO" });
});
