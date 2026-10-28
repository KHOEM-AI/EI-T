import { Rational as R } from "../numbers/rational.mjs";

// factor = តម្លៃក្នុងឯកតាមូលដ្ឋាន SI (ពិតប្រាកដ)
const LINEAR = {
  mm: ["length", "0.001"], cm: ["length", "0.01"], m: ["length", "1"], km: ["length", "1000"],
  in: ["length", "0.0254"], ft: ["length", "0.3048"], yd: ["length", "0.9144"], mi: ["length", "1609.344"],
  mg: ["mass", "0.000001"], g: ["mass", "0.001"], kg: ["mass", "1"], t: ["mass", "1000"],
  lb: ["mass", "0.45359237"], oz: ["mass", "0.028349523125"],
  ms: ["time", "0.001"], s: ["time", "1"], min: ["time", "60"], h: ["time", "3600"], d: ["time", "86400"],
  "m/s": ["speed", "1"], "km/h": ["speed", "5/18"], mph: ["speed", "0.44704"], kn: ["speed", "463/900"],
  N: ["force", "1"], kN: ["force", "1000"], kgf: ["force", "9.80665"], lbf: ["force", "4.4482216152605"],
  Pa: ["pressure", "1"], kPa: ["pressure", "1000"], bar: ["pressure", "100000"], atm: ["pressure", "101325"],
  psi: ["pressure", "44482216152605/6451600000"],
  J: ["energy", "1"], kJ: ["energy", "1000"], cal: ["energy", "4.184"], kcal: ["energy", "4184"],
  Wh: ["energy", "3600"], kWh: ["energy", "3600000"], eV: ["energy", "0." + "0".repeat(18) + "1602176634"],
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
