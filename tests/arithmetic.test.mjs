import test from "node:test";
import assert from "node:assert/strict";
import { add, sub, mul, div } from "../src/index.mjs";

test("បូក ដក គុណ ចែក ពិតប្រាកដ", () => {
  assert.equal(add("0.1", "0.2").toFraction(), "3/10");
  assert.equal(sub("1", "0.9").toFraction(), "1/10");
  assert.equal(mul("3/4", "2/3").toFraction(), "1/2");
  assert.equal(div("1", "3").toFraction(), "1/3");
  assert.equal(div("-6", "4").toFraction(), "-3/2");
});

test("ចែកនឹងសូន្យ និងលេខមិនត្រឹមត្រូវ", () => {
  assert.throws(() => div("1", "0"), { message: "DIVISION_BY_ZERO" });
  assert.throws(() => add("abc", "1"), { message: "INVALID_NUMBER" });
});
