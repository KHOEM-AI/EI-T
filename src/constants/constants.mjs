import { Rational as R } from "../numbers/rational.mjs";
import { powInt } from "../numbers/power.mjs";

export const CONSTANTS_VERSION = "1.0.1";

const sci = (m, e) => R.parse(m).mul(powInt("10", e));
const SI = "BIPM, The International System of Units (SI Brochure), 9th edition, 2019";
const CODATA = "CODATA recommended values (NIST)";

const defs = [
  { id: "c", symbol: "c", unit: "m/s", kind: "exact", value: R.parse("299792458"), uncertainty: null,
    name: { en: "Speed of light in vacuum", km: "ល្បឿនពន្លឺក្នុងខ្វះចន្លោះ", zh: "真空光速" }, source: SI },
  { id: "h", symbol: "h", unit: "J·s", kind: "exact", value: sci("6.62607015", -34), uncertainty: null,
    name: { en: "Planck constant", km: "ថេរផ្លង់", zh: "普朗克常数" }, source: SI },
  { id: "e_charge", symbol: "e", unit: "C", kind: "exact", value: sci("1.602176634", -19), uncertainty: null,
    name: { en: "Elementary charge", km: "បន្ទុកបឋម", zh: "基本电荷" }, source: SI },
  { id: "k_B", symbol: "k", unit: "J/K", kind: "exact", value: sci("1.380649", -23), uncertainty: null,
    name: { en: "Boltzmann constant", km: "ថេរបុលស្មាន", zh: "玻尔兹曼常数" }, source: SI },
  { id: "N_A", symbol: "N_A", unit: "1/mol", kind: "exact", value: sci("6.02214076", 23), uncertainty: null,
    name: { en: "Avogadro constant", km: "ថេរអាវ៉ូហ្គាដ្រូ", zh: "阿伏伽德罗常数" }, source: SI },
  { id: "g_n", symbol: "g_n", unit: "m/s²", kind: "exact", value: R.parse("9.80665"), uncertainty: null,
    name: { en: "Standard acceleration of gravity", km: "សំទុះទំនាញស្តង់ដារ", zh: "标准重力加速度" },
    source: "CGPM 1901 (3rd CGPM) definition; BIPM SI Brochure" },
  { id: "atm", symbol: "atm", unit: "Pa", kind: "exact", value: R.parse("101325"), uncertainty: null,
    name: { en: "Standard atmosphere", km: "សម្ពាធបរិយាកាសស្តង់ដារ", zh: "标准大气压" },
    source: "CGPM 1954 (10th CGPM) definition" },
  { id: "G", symbol: "G", unit: "m³/(kg·s²)", kind: "approximate", value: sci("6.67430", -11), uncertainty: sci("0.00015", -11),
    name: { en: "Newtonian constant of gravitation", km: "ថេរទំនាញសកល", zh: "万有引力常数" },
    source: `${CODATA} 2022 (same value as 2018); 6.67430(15)e-11` },
  { id: "pi", symbol: "π", unit: "1", kind: "approximate",
    value: R.parse("3.14159265358979323846264338327950288419716939937510"), uncertainty: R.parse(`0.${"0".repeat(49)}1`),
    name: { en: "Pi", km: "ពាយ (π)", zh: "圆周率" }, source: "Mathematical constant; truncated to 50 decimal digits" },
  { id: "e", symbol: "e", unit: "1", kind: "approximate",
    value: R.parse("2.71828182845904523536028747135266249775724709369995"), uncertainty: R.parse(`0.${"0".repeat(49)}1`),
    name: { en: "Euler's number", km: "ចំនួន e (អយល័រ)", zh: "自然常数 e" }, source: "Mathematical constant; truncated to 50 decimal digits" },
];

const REGISTRY = new Map(defs.map((d) => [d.id, d]));

const publicView = (d) => Object.freeze({
  ...d, name: Object.freeze({ ...d.name }), version: CONSTANTS_VERSION,
});

export function listConstants() {
  return [...REGISTRY.keys()].sort();
}

export function getConstant(id) {
  const d = REGISTRY.get(id);
  if (!d) throw new RangeError("UNKNOWN_CONSTANT");
  return publicView(d);
}
