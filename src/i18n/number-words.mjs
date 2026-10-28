const LIMIT = 10n ** 18n;
const NUM = /^([+-]?)(\d+)(?:\.(\d+))?$/;

// ---------- English ----------
const EN_ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const EN_SCALES = ["", "thousand", "million", "billion", "trillion", "quadrillion"];

function enBelow1000(n) {
  const parts = [];
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h) parts.push(`${EN_ONES[h]} hundred`);
  if (r) {
    parts.push(r < 20 ? EN_ONES[r] : EN_TENS[Math.floor(r / 10)] + (r % 10 ? `-${EN_ONES[r % 10]}` : ""));
  }
  return parts.join(" ");
}

function enInt(n) {
  if (n === 0n) return "zero";
  const parts = [];
  let i = 0;
  while (n > 0n) {
    const g = Number(n % 1000n);
    if (g) parts.unshift(enBelow1000(g) + (EN_SCALES[i] ? ` ${EN_SCALES[i]}` : ""));
    n /= 1000n;
    i++;
  }
  return parts.join(" ");
}

// ---------- Khmer ----------
const KM_DIGITS = ["សូន្យ", "មួយ", "ពីរ", "បី", "បួន", "ប្រាំ", "ប្រាំមួយ", "ប្រាំពីរ", "ប្រាំបី", "ប្រាំបួន"];
const KM_TENS = ["", "ដប់", "ម្ភៃ", "សាមសិប", "សែសិប", "ហាសិប", "ហុកសិប", "ចិតសិប", "ប៉ែតសិប", "កៅសិប"];
const KM_UNITS = [[100000, "សែន"], [10000, "ម៉ឺន"], [1000, "ពាន់"], [100, "រយ"]];

function kmBelow1e6(n) {
  let s = "";
  for (const [u, name] of KM_UNITS) {
    const d = Math.floor(n / u);
    n %= u;
    if (d) s += KM_DIGITS[d] + name;
  }
  const t = Math.floor(n / 10);
  const o = n % 10;
  return s + KM_TENS[t] + (o ? KM_DIGITS[o] : "");
}

function kmInt(n) {
  if (n === 0n) return KM_DIGITS[0];
  if (n < 1000000n) return kmBelow1e6(Number(n));
  const rest = Number(n % 1000000n);
  return kmInt(n / 1000000n) + "លាន" + (rest ? kmBelow1e6(rest) : "");
}

// ---------- Chinese ----------
const ZH_DIGITS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const ZH_UNITS = ["", "万", "亿", "兆", "京"];

function zhSection(g) {
  const ds = [Math.floor(g / 1000), Math.floor(g / 100) % 10, Math.floor(g / 10) % 10, g % 10];
  const U = ["千", "百", "十", ""];
  let s = "";
  let zero = false;
  for (let i = 0; i < 4; i++) {
    const d = ds[i];
    if (d === 0) {
      if (s) zero = true;
    } else {
      if (zero) { s += "零"; zero = false; }
      s += ZH_DIGITS[d] + U[i];
    }
  }
  return s;
}

function zhInt(n) {
  if (n === 0n) return "零";
  const groups = [];
  while (n > 0n) { groups.push(Number(n % 10000n)); n /= 10000n; }
  let out = "";
  let pending = false;
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) { pending = out !== ""; continue; }
    let t = zhSection(g);
    if (out === "" && t.startsWith("一十")) t = t.slice(1);
    if (out !== "" && (pending || g < 1000)) out += "零";
    out += t + ZH_UNITS[i];
    pending = false;
  }
  return out;
}

// ---------- Public API ----------
const IMPL = {
  en: { int: enInt, digits: EN_ONES.slice(0, 10), point: " point ", sep: " ", neg: "negative " },
  km: { int: kmInt, digits: KM_DIGITS, point: "ក្បៀស", sep: " ", neg: "ដក" },
  zh: { int: zhInt, digits: ZH_DIGITS, point: "点", sep: "", neg: "负" },
};

export const LANGUAGES = Object.keys(IMPL);

export function numberToWords(input, lang = "en") {
  const m = NUM.exec(String(input).trim());
  if (!m) throw new SyntaxError("INVALID_NUMBER");
  const impl = IMPL[lang];
  if (!impl) throw new RangeError("UNSUPPORTED_LANGUAGE");
  const int = BigInt(m[2]);
  if (int >= LIMIT) throw new RangeError("NUMBER_TOO_LARGE");
  const frac = m[3] ?? "";
  const isZero = int === 0n && /^0*$/.test(frac);
  let s = impl.int(int);
  if (frac) s += impl.point + [...frac].map((c) => impl.digits[Number(c)]).join(impl.sep);
  if (m[1] === "-" && !isZero) s = impl.neg + s;
  return s;
}
