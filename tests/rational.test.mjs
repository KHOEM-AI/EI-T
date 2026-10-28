import test from "node:test";
import assert from "node:assert/strict";
import { Rational as R } from "../src/numbers/rational.mjs";

test("0.1 + 0.2 = 3/10 ពិតប្រាកដ", () => {
  assert.equal(R.parse("0.1").add(R.parse("0.2")).toFraction(), "3/10");
});
test("1/3 * 3 = 1", () => {
  assert.equal(R.parse("1/3").mul(R.parse("3")).toFraction(), "1");
});
test("ចែកនឹងសូន្យ", () => {
  assert.throws(() => R.parse("1").div(R.parse("0")), /DIVISION_BY_ZERO/);
});
test("បង្គត់ទសភាគ", () => {
  assert.equal(R.parse("2/3").toDecimal(2), "0.67");
  assert.equal(R.parse("-1/2").toDecimal(0), "-1");
  assert.equal(R.parse("0").toDecimal(3), "0.000");
});
test("ចំនួនធំមិនបាត់ខ្ទង់", () => {
  const big = "1" + "0".repeat(100);
  assert.equal(R.parse(big).mul(R.parse("2")).toFraction(), "2" + "0".repeat(100));
});
test("បដិសេធអក្សរមិនត្រឹមត្រូវ", () => {
  assert.throws(() => R.parse("1+1"), /INVALID_NUMBER/);
  assert.throws(() => R.parse("process.exit()"), /INVALID_NUMBER/);
});
