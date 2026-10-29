/* EI-T (browser JavaScript, classic script): exact arithmetic, mechanics, chemistry.
 * Exposes window.EIT. Numbers are strings ("0.1", "3/4") or rationals; results are rationals.
 * Errors match the other versions: RangeError("DIVISION_BY_ZERO"), SyntaxError("INVALID_NUMBER"). */
(function (root) {
  "use strict";

  const gcd = (a, b) => {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b) [a, b] = [b, a % b];
    return a;
  };

  function make(n, d) {
    n = BigInt(n);
    d = BigInt(d);
    if (d === 0n) throw new RangeError("DIVISION_BY_ZERO");
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n, d);
    return Object.freeze({ n: n / g, d: d / g });
  }

  const isRational = (x) => x !== null && typeof x === "object" && typeof x.n === "bigint" && typeof x.d === "bigint";

  function parse(input) {
    if (isRational(input)) return input;
    const t = String(input).trim();
    let m = /^([+-]?\d+)\/(\d+)$/.exec(t);
    if (m) return make(m[1], m[2]);
    m = /^([+-]?)(\d+)(?:\.(\d+))?$/.exec(t);
    if (!m) throw new SyntaxError("INVALID_NUMBER");
    const frac = m[3] || "";
    const n = BigInt(m[2] + frac);
    return make(m[1] === "-" ? -n : n, 10n ** BigInt(frac.length));
  }

  const add = (a, b) => { a = parse(a); b = parse(b); return make(a.n * b.d + b.n * a.d, a.d * b.d); };
  const sub = (a, b) => { a = parse(a); b = parse(b); return make(a.n * b.d - b.n * a.d, a.d * b.d); };
  const mul = (a, b) => { a = parse(a); b = parse(b); return make(a.n * b.n, a.d * b.d); };
  const div = (a, b) => { a = parse(a); b = parse(b); return make(a.n * b.d, a.d * b.n); };

  const toFraction = (r) => (r.d === 1n ? `${r.n}` : `${r.n}/${r.d}`);

  // rounds half away from zero
  function toDecimal(r, digits = 10) {
    const num = r.n * 10n ** BigInt(digits);
    const neg = num < 0n;
    const a = neg ? -num : num;
    let q = a / r.d;
    if ((a % r.d) * 2n >= r.d) q += 1n;
    const s = q.toString().padStart(digits + 1, "0");
    const int = s.slice(0, s.length - digits);
    const frac = s.slice(s.length - digits);
    return (neg && q !== 0n ? "-" : "") + (digits ? `${int}.${frac}` : int);
  }

  const G_N = parse("9.80665");
  const N_A = parse("602214076000000000000000");

  // mechanics (SI)
  const speed = (d, t) => div(d, t);
  const force = (m, a) => mul(m, a);
  const weight = (m) => mul(m, G_N);
  const kineticEnergy = (m, v) => div(mul(mul(m, v), v), "2");
  const density = (m, v) => div(m, v);
  const pressure = (f, a) => div(f, a);
  const work = (f, d) => mul(f, d);
  const power = (w, t) => div(w, t);

  // chemistry
  const molesFromParticles = (n) => div(n, N_A);
  const particlesFromMoles = (n) => mul(n, N_A);
  const molesFromMass = (m, M) => div(m, M);
  const massFromMoles = (n, M) => mul(n, M);

  const api = {
    parse, toFraction, toDecimal, G_N, N_A,
    add, sub, mul, div,
    speed, force, weight, kineticEnergy, density, pressure, work, power,
    molesFromParticles, particlesFromMoles, molesFromMass, massFromMoles,
  };
  root.EIT = Object.freeze(api);
})(typeof globalThis !== "undefined" ? globalThis : this);
