import test from "node:test";
import assert from "node:assert/strict";
import { powInt, logExact } from "../src/numbers/power.mjs";

test("powInt", () => {
  assert.equal(powInt("2", 10).toFraction(), "1024");
  assert.equal(powInt("2", -2).toFraction(), "1/4");
  assert.equal(powInt("2/3", 3).toFraction(), "8/27");
  assert.equal(powInt("-2", 3).toFraction(), "-8");
  assert.equal(powInt("5", 0).toFraction(), "1");
  assert.equal(powInt("2", 200).toFraction(), (2n ** 200n).toString());
});

test("powInt កំហុស", () => {
  assert.throws(() => powInt("0", 0), /UNDEFINED_POWER/);
  assert.throws(() => powInt("0", -1), /UNDEFINED_POWER/);
  assert.throws(() => powInt("2", 10001), /EXPONENT_LIMIT/);
  assert.throws(() => powInt("2", 1.5), /EXPONENT_LIMIT/);
});

test("logExact", () => {
  assert.equal(logExact("2", "8").toFraction(), "3");
  assert.equal(logExact("2", "1/4").toFraction(), "-2");
  assert.equal(logExact("4", "2").toFraction(), "1/2");
  assert.equal(logExact("10", "1").toFraction(), "0");
  assert.equal(logExact("2", "3"), null);
  assert.throws(() => logExact("1", "5"), /LOG_DOMAIN/);
  assert.throws(() => logExact("2", "0"), /LOG_DOMAIN/);
  assert.throws(() => logExact("2", "-4"), /LOG_DOMAIN/);
});
