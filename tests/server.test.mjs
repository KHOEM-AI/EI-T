import test, { after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server.mjs";

const server = createApp();
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
after(() => { server.closeAllConnections?.(); server.close(); });

const call = async (body) => {
  const r = await fetch(`${base}/v1/call`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return { status: r.status, json: await r.json() };
};

test("health និងបញ្ជីមុខងារ", async () => {
  const h = await fetch(`${base}/health`);
  assert.equal(h.status, 200);
  assert.deepEqual(await h.json(), { ok: true });
  const f = await (await fetch(`${base}/v1/functions`)).json();
  assert.ok(f.functions.includes("convert"));
  assert.ok(f.functions.includes("solveQuadratic"));
  assert.ok(!f.functions.includes("Rational"));
});

test("ហៅមុខងារ", async () => {
  assert.equal((await call({ fn: "convert", args: ["1", "km", "m"] })).json.result, "1000");
  assert.equal((await call({ fn: "sum", args: [["0.1", "0.2"]] })).json.result, "3/10");
  assert.equal((await call({ fn: "numberToWords", args: ["123456", "zh"] })).json.result, "十二万三千四百五十六");
  const q = (await call({ fn: "solveQuadratic", args: ["1", "-3", "2"] })).json.result;
  assert.equal(q.type, "two");
  assert.equal(q.x1, "1");
  assert.equal(q.x2, "2");
  const t = (await call({ fn: "trigExact", args: ["sin", "60"] })).json.result;
  assert.deepEqual(t, { coeff: "1/2", radicand: "3" });
});

test("កំហុសម៉ូឌុលត្រឡប់ជាកូដ", async () => {
  let r = await call({ fn: "convert", args: ["1", "m", "kg"] });
  assert.equal(r.status, 400);
  assert.equal(r.json.error, "INCOMPATIBLE_UNITS");
  r = await call({ fn: "powInt", args: ["2", 10001] });
  assert.equal(r.json.error, "EXPONENT_LIMIT");
  r = await call({ fn: "solveLinear", args: ["x", "1", "2"] });
  assert.equal(r.json.error, "INVALID_NUMBER");
  assert.equal((await call("{bad")).json.error, "INVALID_JSON");
  assert.equal((await call({})).json.error, "INVALID_REQUEST");
  assert.equal((await call({ fn: "sum", args: "x" })).json.error, "INVALID_ARGS");
  assert.equal((await call({ fn: "sum", args: Array(21).fill("1") })).json.error, "TOO_MANY_ARGS");
});

test("សុវត្ថិភាពឈ្មោះមុខងារ", async () => {
  for (const fn of ["constructor", "__proto__", "toString", "Rational", "process"]) {
    const r = await call({ fn, args: [] });
    assert.equal(r.status, 404, fn);
    assert.equal(r.json.error, "UNKNOWN_FUNCTION", fn);
  }
});

test("ដែនកំណត់ និងវិធីសាស្ត្រ", async () => {
  const get = await fetch(`${base}/v1/call`);
  assert.equal(get.status, 405);
  assert.equal((await fetch(`${base}/nope`)).status, 404);
  const big = await call(JSON.stringify({ fn: "sum", args: ["1".repeat(70000)] }));
  assert.equal(big.status, 413);
  assert.equal(big.json.error, "BODY_TOO_LARGE");
});
