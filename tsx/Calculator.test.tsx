import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { calculate } from "./calculate.ts";
import { Calculator } from "./Calculator.tsx";

test("calculate: ៤ វិធី", () => {
  assert.deepEqual(calculate("0.1", "+", "0.2"), { ok: true, value: "3/10" });
  assert.deepEqual(calculate("1", "-", "0.9"), { ok: true, value: "1/10" });
  assert.deepEqual(calculate("3/4", "×", "2/3"), { ok: true, value: "1/2" });
  assert.deepEqual(calculate("1", "÷", "3"), { ok: true, value: "1/3" });
});

test("calculate: កំហុសជាកូដ", () => {
  assert.deepEqual(calculate("1", "÷", "0"), { ok: false, error: "DIVISION_BY_ZERO" });
  assert.deepEqual(calculate("abc", "+", "1"), { ok: false, error: "INVALID_NUMBER" });
});

test("Calculator: បង្ហាញ = 3/10 តាមលំនាំដើម", () => {
  const html = renderToStaticMarkup(<Calculator />);
  assert.match(html, /= 3\/10/);
  assert.match(html, /aria-label="operator"/);
});
