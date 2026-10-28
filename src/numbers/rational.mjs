const gcd = (a, b) => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
};

export class Rational {
  constructor(n, d = 1n) {
    n = BigInt(n);
    d = BigInt(d);
    if (d === 0n) throw new RangeError("DIVISION_BY_ZERO");
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n, d);
    this.n = n / g;
    this.d = d / g;
    Object.freeze(this);
  }

  // ទទួលតែ "-12.345", "3/4", "42" (មិនប្រើ eval)
  static parse(input) {
    const t = String(input).trim();
    let m = /^([+-]?\d+)\/(\d+)$/.exec(t);
    if (m) return new Rational(m[1], m[2]);
    m = /^([+-]?)(\d+)(?:\.(\d+))?$/.exec(t);
    if (!m) throw new SyntaxError("INVALID_NUMBER");
    const frac = m[3] ?? "";
    const n = BigInt(m[2] + frac);
    return new Rational(m[1] === "-" ? -n : n, 10n ** BigInt(frac.length));
  }

  add(o) { return new Rational(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Rational(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Rational(this.n * o.n, this.d * o.d); }
  div(o) { return new Rational(this.n * o.d, this.d * o.n); }
  neg() { return new Rational(-this.n, this.d); }
  abs() { return new Rational(this.n < 0n ? -this.n : this.n, this.d); }
  cmp(o) {
    const a = this.n * o.d;
    const b = o.n * this.d;
    return a < b ? -1 : a > b ? 1 : 0;
  }

  toFraction() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }

  // បង្គត់ half away from zero
  toDecimal(digits = 10) {
    const num = this.n * 10n ** BigInt(digits);
    const neg = num < 0n;
    const a = neg ? -num : num;
    let q = a / this.d;
    if ((a % this.d) * 2n >= this.d) q += 1n;
    const s = q.toString().padStart(digits + 1, "0");
    const int = s.slice(0, s.length - digits);
    const frac = s.slice(s.length - digits);
    return (neg && q !== 0n ? "-" : "") + (digits ? `${int}.${frac}` : int);
  }
}
