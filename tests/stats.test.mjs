import test from "node:test";
import assert from "node:assert/strict";
import { sum, mean, median, mode, range } from "../src/stats/basic.mjs";

test("ផលបូក និងមធ្យម", () => {
  assert.equal(sum(["0.1", "0.2"]).toFraction(), "3/10");
  assert.equal(mean(["1", "2", "3", "4"]).toFraction(), "5/2");
  assert.equal(mean(["1", "2"]).toDecimal(1), "1.5");
});

test("មធ្យស្ថាន", () => {
  assert.equal(median(["3", "1", "2"]).toFraction(), "2");
  assert.equal(median(["4", "1", "3", "2"]).toFraction(), "5/2");
});

test("ម៉ូដ និងចន្លោះ", () => {
  assert.deepEqual(mode(["1", "2", "2", "3"]).map((x) => x.toFraction()), ["2"]);
  assert.deepEqual(mode(["1", "1", "2", "2"]).map((x) => x.toFraction()), ["1", "2"]);
  assert.equal(range(["5", "1", "9"]).toFraction(), "8");
});

test("កំហុស", () => {
  assert.throws(() => mean([]), /EMPTY_DATA/);
  assert.throws(() => median("abc"), /EMPTY_DATA/);
  assert.throws(() => sum(["1", "x"]), /INVALID_NUMBER/);
});
