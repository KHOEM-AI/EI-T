import React from "react";
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Calculator, FUNCS, run } from "./Calculator.jsx";

test("jsx: run() on every function with its default values", () => {
  const want = {
    add: "3/10", sub: "1/10", mul: "1/2", div: "1/3", speed: "5", force: "3",
    weight: "196133/2000", kineticEnergy: "9", density: "250", pressure: "25",
    work: "15", power: "5", molesFromMass: "2", massFromMoles: "36",
  };
  for (const f of FUNCS) {
    const r = run(f.id, f.args.map((a) => a[1]));
    assert.equal(r.ok, true, f.id);
    assert.equal(r.fraction, want[f.id], f.id);
  }
  assert.equal(FUNCS.length, Object.keys(want).length);
});

test("jsx: errors are codes", () => {
  assert.deepEqual(run("div", ["1", "0"]), { ok: false, error: "DIVISION_BY_ZERO" });
  assert.deepEqual(run("add", ["abc", "1"]), { ok: false, error: "INVALID_NUMBER" });
});

test("jsx: Calculator renders = 3/10 by default", () => {
  const html = renderToStaticMarkup(<Calculator />);
  assert.match(html, /= 3\/10/);
  assert.match(html, /aria-label="function"/);
});
