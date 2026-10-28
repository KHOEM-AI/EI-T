import test from "node:test";
import assert from "node:assert/strict";
import { trigExact, exactToString as s, sinApprox, cosApprox, tanApprox } from "../src/geometry/trig.mjs";

const ex = (fn, d) => s(trigExact(fn, d));

test("មុំពិសេស quadrant ទី ១", () => {
  assert.equal(ex("sin", "0"), "0");
  assert.equal(ex("sin", "30"), "1/2");
  assert.equal(ex("sin", "45"), "√2/2");
  assert.equal(ex("sin", "60"), "√3/2");
  assert.equal(ex("sin", "90"), "1");
  assert.equal(ex("cos", "0"), "1");
  assert.equal(ex("cos", "60"), "1/2");
  assert.equal(ex("cos", "90"), "0");
  assert.equal(ex("tan", "30"), "√3/3");
  assert.equal(ex("tan", "45"), "1");
  assert.equal(ex("tan", "60"), "√3");
});

test("quadrant ផ្សេង និងមុំអវិជ្ជមាន", () => {
  assert.equal(ex("sin", "150"), "1/2");
  assert.equal(ex("cos", "120"), "-1/2");
  assert.equal(ex("cos", "135"), "-√2/2");
  assert.equal(ex("sin", "210"), "-1/2");
  assert.equal(ex("tan", "135"), "-1");
  assert.equal(ex("tan", "120"), "-√3");
  assert.equal(ex("sin", "330"), "-1/2");
  assert.equal(ex("sin", "-30"), "-1/2");
  assert.equal(ex("sin", "390"), "1/2");
  assert.equal(ex("cos", "180"), "-1");
});

test("មុំមិនពិសេស និងកំហុស", () => {
  assert.equal(trigExact("sin", "10"), null);
  assert.equal(trigExact("tan", "1"), null);
  assert.throws(() => trigExact("tan", "90"), /TAN_UNDEFINED/);
  assert.throws(() => trigExact("tan", "270"), /TAN_UNDEFINED/);
  assert.throws(() => trigExact("sec", "30"), /UNKNOWN_FUNCTION/);
  assert.throws(() => tanApprox("90"), /TAN_UNDEFINED/);
});

test("ប្រហាក់ប្រហែល", () => {
  assert.equal(sinApprox("60", 10), "0.8660254038");
  assert.equal(sinApprox("30", 10), "0.5000000000");
  assert.equal(cosApprox("60", 10), "0.5000000000");
  assert.equal(tanApprox("45", 10), "1.0000000000");
  assert.equal(tanApprox("60", 6), "1.732051");
  assert.equal(sinApprox("1", 10), "0.0174524064");
  assert.equal(sinApprox("-30", 5), "-0.50000");
  assert.equal(sinApprox("180", 5), "0.00000");
  assert.equal(cosApprox("90", 5), "0.00000");
});

test("ដែនកំណត់ភាពជាក់លាក់", () => {
  assert.throws(() => sinApprox("1", 31), /PRECISION_LIMIT/);
  assert.throws(() => cosApprox("1", -1), /PRECISION_LIMIT/);
});
