import test from "node:test";
import assert from "node:assert/strict";
import { Rational as R } from "../src/numbers/rational.mjs";
import { getConstant as g, listConstants, CONSTANTS_VERSION } from "../src/constants/constants.mjs";

test("ថេរពិតប្រាកដ", () => {
  assert.equal(g("c").value.toFraction(), "299792458");
  assert.equal(g("h").value.toFraction(), R.parse("6.62607015").mul(R.parse("1/" + "1" + "0".repeat(34))).toFraction());
  assert.equal(g("N_A").value.toFraction(), "602214076" + "0".repeat(15));
  assert.equal(g("g_n").value.toFraction(), R.parse("9.80665").toFraction());
  assert.equal(g("atm").value.toFraction(), "101325");
  for (const id of ["c", "h", "e_charge", "k_B", "N_A", "g_n", "atm"]) {
    assert.equal(g(id).kind, "exact", id);
    assert.equal(g(id).uncertainty, null, id);
  }
});

test("ថេរប្រហាក់ប្រហែលមាន uncertainty", () => {
  for (const id of ["G", "pi", "e"]) {
    const c = g(id);
    assert.equal(c.kind, "approximate", id);
    assert.ok(c.uncertainty instanceof R, id);
  }
  assert.equal(g("pi").value.toDecimal(10), "3.1415926536");
  assert.equal(g("e").value.toDecimal(10), "2.7182818285");
});

test("ឈ្មោះ ៣ ភាសា ប្រភព និងកំណែ", () => {
  for (const id of listConstants()) {
    const c = g(id);
    assert.ok(c.name.en && c.name.km && c.name.zh, id);
    assert.ok(c.source.length > 0, id);
    assert.equal(c.version, CONSTANTS_VERSION);
  }
  assert.equal(g("c").name.zh, "真空光速");
});

test("កំហុស និងសុវត្ថិភាព", () => {
  for (const id of ["nope", "constructor", "__proto__", "toString"]) {
    assert.throws(() => g(id), /UNKNOWN_CONSTANT/, id);
  }
  assert.throws(() => { g("c").value = 1; }, TypeError);
  assert.ok(listConstants().includes("pi"));
  assert.equal(listConstants().length, 10);
});
