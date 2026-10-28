import test from "node:test";
import assert from "node:assert/strict";
import { Rational as R } from "../src/numbers/rational.mjs";
import { convert as c, dimensionOf } from "../src/units/convert.mjs";

test("ល្បឿន", () => {
  assert.equal(c("36", "km/h", "m/s").toFraction(), "10");
  assert.equal(c("1", "mph", "km/h").toDecimal(6), "1.609344");
  assert.equal(c("1", "kn", "km/h").toDecimal(3), "1.852");
});

test("កម្លាំង និងសម្ពាធ", () => {
  assert.equal(c("1", "kgf", "N").toDecimal(5), "9.80665");
  assert.equal(c("1", "lbf", "N").toDecimal(13), "4.4482216152605");
  assert.equal(c("1", "atm", "Pa").toFraction(), "101325");
  assert.equal(c("1", "bar", "kPa").toFraction(), "100");
  assert.equal(c("1", "psi", "Pa").toDecimal(6), "6894.757293");
  assert.equal(c("1", "atm", "psi").toDecimal(3), "14.696");
});

test("ថាមពល", () => {
  assert.equal(c("1", "kcal", "cal").toFraction(), "1000");
  assert.equal(c("1", "kWh", "J").toFraction(), "3600000");
  assert.equal(c("1", "cal", "J").toDecimal(3), "4.184");
  assert.equal(c("1", "eV", "J").cmp(R.parse("0." + "0".repeat(18) + "1602176634")), 0);
});

test("វិមាត្រ និងកំហុស", () => {
  assert.equal(dimensionOf("psi"), "pressure");
  assert.equal(dimensionOf("km/h"), "speed");
  assert.throws(() => c("1", "m/s", "N"), /INCOMPATIBLE_UNITS/);
  assert.throws(() => c("1", "N", "J"), /INCOMPATIBLE_UNITS/);
});
