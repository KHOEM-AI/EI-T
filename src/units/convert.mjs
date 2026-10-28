import { Rational as R } from "../numbers/rational.mjs";

// factor = តម្លៃក្នុងឯកតាមូលដ្ឋាន SI (ពិតប្រាកដ)
const LINEAR = {
  mm: ["length", "0.001"], cm: ["length", "0.01"], m: ["length", "1"], km: ["length", "1000"],
  in: ["length", "0.0254"], ft: ["length", "0.3048"], yd: ["length", "0.9144"], mi: ["length", "1609.344"],
  mg: ["mass", "0.000001"], g: ["mass", "0.001"], kg: ["mass", "1"], t: ["mass", "1000"],
  lb: ["mass", "0.45359237"], oz: ["mass", "0.028349523125"],
  ms: ["time", "0.001"], s: ["time", "1"], min: ["time", "60"], h: ["time", "3600"], d: ["time", "86400"],
};

// សីតុណ្ហភាពតាមរយៈ Kelvin
const TEMP = {
  c: { to: (v) => v.add(R.parse("273.15")), from: (k) => k.sub(R.parse("273.15")) },
  f: {
    to: (v) => v.add(R.parse("459.67")).mul(R.parse("5/9")),
    from: (k) => k.mul(R.parse("9/5")).sub(R.parse("459.67")),
  },
  k: { to: (v) => v, from: (k) => k },
};

export function dimensionOf(unit) {
  if (Object.hasOwn(LINEAR, unit)) return LINEAR[unit][0];
  if (Object.hasOwn(TEMP, unit)) return "temperature";
  throw new RangeError("UNKNOWN_UNIT");
}

export function convert(value, from, to) {
  const dim = dimensionOf(from);
  if (dim !== dimensionOf(to)) throw new RangeError("INCOMPATIBLE_UNITS");
  const v = value instanceof R ? value : R.parse(value);
  if (dim === "temperature") {
    const k = TEMP[from].to(v);
    if (k.cmp(new R(0)) < 0) throw new RangeError("BELOW_ABSOLUTE_ZERO");
    return TEMP[to].from(k);
  }
  return v.mul(R.parse(LINEAR[from][1])).div(R.parse(LINEAR[to][1]));
}
