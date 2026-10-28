import { Rational as R } from "../numbers/rational.mjs";

const toList = (values) => {
  if (!Array.isArray(values) || values.length === 0) throw new RangeError("EMPTY_DATA");
  return values.map((v) => (v instanceof R ? v : R.parse(v)));
};

export function sum(values) {
  return toList(values).reduce((a, b) => a.add(b), new R(0));
}

export function mean(values) {
  const list = toList(values);
  return sum(list).div(new R(list.length));
}

export function median(values) {
  const s = toList(values).sort((a, b) => a.cmp(b));
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : s[mid - 1].add(s[mid]).div(new R(2));
}

// ត្រឡប់បញ្ជីម៉ូដ (អាចមានច្រើន) តាមលំដាប់ពីតូចទៅធំ
export function mode(values) {
  const s = toList(values).sort((a, b) => a.cmp(b));
  const counts = [];
  for (const v of s) {
    const last = counts[counts.length - 1];
    if (last && last.v.cmp(v) === 0) last.c++;
    else counts.push({ v, c: 1 });
  }
  const max = Math.max(...counts.map((x) => x.c));
  return counts.filter((x) => x.c === max).map((x) => x.v);
}

export function range(values) {
  const s = toList(values).sort((a, b) => a.cmp(b));
  return s[s.length - 1].sub(s[0]);
}
