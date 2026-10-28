import test from "node:test";
import assert from "node:assert/strict";
import { numberToWords as w } from "../src/i18n/number-words.mjs";

test("English", () => {
  assert.equal(w("0", "en"), "zero");
  assert.equal(w("123456", "en"), "one hundred twenty-three thousand four hundred fifty-six");
  assert.equal(w("1000000", "en"), "one million");
  assert.equal(w("-5", "en"), "negative five");
  assert.equal(w("3.14", "en"), "three point one four");
});

test("Khmer", () => {
  assert.equal(w("0", "km"), "សូន្យ");
  assert.equal(w("21", "km"), "ម្ភៃមួយ");
  assert.equal(w("123456", "km"), "មួយសែនពីរម៉ឺនបីពាន់បួនរយហាសិបប្រាំមួយ");
  assert.equal(w("1000000", "km"), "មួយលាន");
  assert.equal(w("1000000000", "km"), "មួយពាន់លាន");
  assert.equal(w("-5", "km"), "ដកប្រាំ");
});

test("Chinese", () => {
  assert.equal(w("0", "zh"), "零");
  assert.equal(w("10", "zh"), "十");
  assert.equal(w("110", "zh"), "一百一十");
  assert.equal(w("105", "zh"), "一百零五");
  assert.equal(w("123456", "zh"), "十二万三千四百五十六");
  assert.equal(w("10001", "zh"), "一万零一");
  assert.equal(w("1000000", "zh"), "一百万");
  assert.equal(w("100000001", "zh"), "一亿零一");
  assert.equal(w("3.14", "zh"), "三点一四");
});

test("កំហុស និងដែនកំណត់", () => {
  assert.throws(() => w("1+1", "en"), /INVALID_NUMBER/);
  assert.throws(() => w("5", "fr"), /UNSUPPORTED_LANGUAGE/);
  assert.throws(() => w("1" + "0".repeat(18), "en"), /NUMBER_TOO_LARGE/);
  assert.equal(w("-0", "en"), "zero");
});
