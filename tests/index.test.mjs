import test from "node:test";
import assert from "node:assert/strict";
import * as api from "../src/index.mjs";

test("ចំណុចប្រទាក់រួម export គ្រប់មុខងារ", () => {
  const expected = [
    "Rational", "numberToWords", "LANGUAGES", "convert", "dimensionOf",
    "classifyAngle", "normalizeDegrees", "degToRadPi", "radPiToDeg",
    "radiansApprox", "complement", "supplement",
  ];
  for (const name of expected) assert.ok(name in api, `ខ្វះ ${name}`);
});

test("ប្រើរួមគ្នាតាម index តែមួយ", () => {
  const { convert, numberToWords, degToRadPi } = api;
  assert.equal(convert("1", "km", "m").toFraction(), "1000");
  assert.equal(numberToWords("21", "km"), "ម្ភៃមួយ");
  assert.equal(degToRadPi("90").toFraction(), "1/2");
});

test("export ធរណីមាត្រ shapes", () => {
  assert.equal(api.rectangleArea("3", "4").toFraction(), "12");
  assert.equal(api.circleAreaPi("3").toFraction(), "9");
  assert.equal(api.classifyTriangleByAngles("3", "4", "5"), "right");
});
