// EI-T (TypeScript): ប្រភាគពិតប្រាកដដោយ BigInt + បូក ដក គុណ ចែក
// កូដកំហុសដូច MJS៖ DIVISION_BY_ZERO, INVALID_NUMBER

const gcd = (a: bigint, b: bigint): bigint => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
};

export class Rational {
  readonly n: bigint;
  readonly d: bigint;

  constructor(n: bigint | number | string, d: bigint | number | string = 1n) {
    let num = BigInt(n);
    let den = BigInt(d);
    if (den === 0n) throw new RangeError("DIVISION_BY_ZERO");
    if (den < 0n) { num = -num; den = -den; }
    const g = gcd(num, den);
    this.n = num / g;
    this.d = den / g;
    Object.freeze(this);
  }

  // ទទួលតែ "-12.345", "3/4", "42" (មិនប្រើ eval)
  static parse(input: string | Rational): Rational {
    if (input instanceof Rational) return input;
    const t = String(input).trim();
    let m = /^([+-]?\d+)\/(\d+)$/.exec(t);
    if (m) return new Rational(m[1], m[2]);
    m = /^([+-]?)(\d+)(?:\.(\d+))?$/.exec(t);
    if (!m) throw new SyntaxError("INVALID_NUMBER");
    const frac = m[3] ?? "";
    const n = BigInt(m[2] + frac);
    return new Rational(m[1] === "-" ? -n : n, 10n ** BigInt(frac.length));
  }

  add(o: Rational): Rational { return new Rational(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o: Rational): Rational { return new Rational(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o: Rational): Rational { return new Rational(this.n * o.n, this.d * o.d); }
  div(o: Rational): Rational { return new Rational(this.n * o.d, this.d * o.n); }

  toFraction(): string {
    return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`;
  }
}

export type Num = string | Rational;

export const add = (a: Num, b: Num): Rational => Rational.parse(a).add(Rational.parse(b));
export const sub = (a: Num, b: Num): Rational => Rational.parse(a).sub(Rational.parse(b));
export const mul = (a: Num, b: Num): Rational => Rational.parse(a).mul(Rational.parse(b));
export const div = (a: Num, b: Num): Rational => Rational.parse(a).div(Rational.parse(b));
