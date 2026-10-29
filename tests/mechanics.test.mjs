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
