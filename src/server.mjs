import http from "node:http";
import { pathToFileURL } from "node:url";
import * as api from "./index.mjs";

const MAX_BODY = 64 * 1024;
const MAX_ARGS = 20;
const ROUTES = { "/health": "GET", "/v1/functions": "GET", "/v1/call": "POST" };

// whitelist៖ មុខងារក្នុង index តែប៉ុណ្ណោះ (មិនរួមមាន class Rational)
const FUNCTIONS = new Map(
  Object.entries(api).filter(([name, v]) => typeof v === "function" && name !== "Rational"),
);

function httpError(status, code) {
  const e = new Error(code);
  e.status = status;
  return e;
}

function serialize(v) {
  if (v instanceof api.Rational) return v.toFraction();
  if (typeof v === "bigint") return v.toString();
  if (Array.isArray(v)) return v.map(serialize);
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, serialize(x)]));
  }
  return v;
}

function corsHeaders() {
  const origin = process.env.CORS_ORIGIN;
  return origin
    ? {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "content-type",
      }
    : {};
}

function send(res, status, obj) {
  const body = obj === null ? "" : JSON.stringify(obj);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    ...corsHeaders(),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let over = false;
    req.on("data", (c) => {
      if (over) return;
      size += c.length;
      if (size > MAX_BODY) {
        over = true;
        reject(httpError(413, "BODY_TOO_LARGE"));
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => { if (!over) resolve(Buffer.concat(chunks).toString("utf8")); });
    req.on("error", reject);
  });
}

async function handle(req, res) {
  try {
    const { pathname } = new URL(req.url, "http://localhost");

    if (req.method === "OPTIONS") {
      res.writeHead(204, corsHeaders());
      return res.end();
    }

    const allowed = Object.hasOwn(ROUTES, pathname) ? ROUTES[pathname] : null;
    if (!allowed) throw httpError(404, "NOT_FOUND");
    if (req.method !== allowed) throw httpError(405, "METHOD_NOT_ALLOWED");

    if (pathname === "/health") return send(res, 200, { ok: true });
    if (pathname === "/v1/functions") return send(res, 200, { functions: [...FUNCTIONS.keys()].sort() });

    // POST /v1/call
    if (Number(req.headers["content-length"]) > MAX_BODY) throw httpError(413, "BODY_TOO_LARGE");
    const raw = await readBody(req);
    let body;
    try { body = JSON.parse(raw); } catch { throw httpError(400, "INVALID_JSON"); }
    if (!body || typeof body !== "object" || Array.isArray(body) || typeof body.fn !== "string") {
      throw httpError(400, "INVALID_REQUEST");
    }
    const args = body.args ?? [];
    if (!Array.isArray(args)) throw httpError(400, "INVALID_ARGS");
    if (args.length > MAX_ARGS) throw httpError(400, "TOO_MANY_ARGS");
    const fn = FUNCTIONS.get(body.fn);
    if (!fn) throw httpError(404, "UNKNOWN_FUNCTION");
    return send(res, 200, { result: serialize(fn(...args)) });
  } catch (e) {
    if (e && e.status) return send(res, e.status, { error: e.message });
    if (e instanceof RangeError || e instanceof SyntaxError || e instanceof TypeError) {
      const code = /^[A-Z][A-Z0-9_]+$/.test(e.message) ? e.message : "INVALID_ARGUMENTS";
      return send(res, 400, { error: code });
    }
    return send(res, 500, { error: "INTERNAL_ERROR" });
  }
}

export function createApp() {
  const server = http.createServer((req, res) => {
    handle(req, res).catch(() => send(res, 500, { error: "INTERNAL_ERROR" }));
  });
  server.requestTimeout = 10_000;
  server.headersTimeout = 5_000;
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 3100);
  const host = process.env.HOST ?? "127.0.0.1";
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new RangeError("INVALID_PORT");
  createApp().listen(port, host, () => console.log(`EI-T API: http://${host}:${port}`));
}
