import test from "node:test";
import assert from "node:assert/strict";
import { convert as c, dimensionOf } from "../src/units/convert.mjs";

test("ប្រវែង", () => {
  assert.equal(c("1", "km", "m").toFraction(), "1000");
  assert.equal(c("1", "in", "cm").toDecimal(2), "2.54");
  assert.equal(c("1", "mi", "km").toDecimal(6), "1.609344");
  assert.equal(c("12", "in", "ft").toFraction(), "1");
});

test("ម៉ាស និងពេលវេលា", () => {
  assert.equal(c("1", "kg", "lb").toDecimal(4), "2.2046");
  assert.equal(c("1", "h", "s").toFraction(), "3600");
  assert.equal(c("1", "d", "min").toFraction(), "1440");
});

test("សីតុណ្ហភាព", () => {
  assert.equal(c("100", "c", "f").toFraction(), "212");
  assert.equal(c("-40", "c", "f").toFraction(), "-40");
  assert.equal(c("-40", "f", "c").toFraction(), "-40");
  assert.equal(c("0", "c", "k").toDecimal(2), "273.15");
});

test("កំហុស", () => {
  assert.throws(() => c("1", "m", "kg"), /INCOMPATIBLE_UNITS/);
  assert.throws(() => c("1", "m", "xyz"), /UNKNOWN_UNIT/);
  assert.throws(() => c("1", "constructor", "m"), /UNKNOWN_UNIT/);
  assert.throws(() => c("-1", "k", "c"), /BELOW_ABSOLUTE_ZERO/);
  assert.equal(dimensionOf("c"), "temperature");
});
