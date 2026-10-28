import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyAngle, normalizeDegrees, degToRadPi, radPiToDeg,
  radiansApprox, complement, supplement,
} from "../src/geometry/angles.mjs";

test("ចំណាត់ថ្នាក់មុំ", () => {
  assert.equal(classifyAngle("0"), "zero");
  assert.equal(classifyAngle("45"), "acute");
  assert.equal(classifyAngle("89.999"), "acute");
  assert.equal(classifyAngle("90"), "right");
  assert.equal(classifyAngle("120"), "obtuse");
  assert.equal(classifyAngle("180"), "straight");
  assert.equal(classifyAngle("270"), "reflex");
  assert.equal(classifyAngle("360"), "full");
  assert.throws(() => classifyAngle("361"), /ANGLE_OUT_OF_RANGE/);
  assert.throws(() => classifyAngle("-1"), /ANGLE_OUT_OF_RANGE/);
});

test("ដឺក្រេ ↔ រ៉ាដ្យង់ (មេគុណ π ពិតប្រាកដ)", () => {
  assert.equal(degToRadPi("180").toFraction(), "1");
  assert.equal(degToRadPi("90").toFraction(), "1/2");
  assert.equal(degToRadPi("45").toFraction(), "1/4");
  assert.equal(degToRadPi("30").toFraction(), "1/6");
  assert.equal(degToRadPi("360").toFraction(), "2");
  assert.equal(radPiToDeg("1/2").toFraction(), "90");
  assert.equal(radPiToDeg("1/3").toFraction(), "60");
});

test("រ៉ាដ្យង់ប្រហាក់ប្រហែល", () => {
  assert.equal(radiansApprox("180", 10), "3.1415926536");
  assert.equal(radiansApprox("90", 5), "1.57080");
  assert.throws(() => radiansApprox("90", 41), /PRECISION_LIMIT/);
});

test("normalize", () => {
  assert.equal(normalizeDegrees("-90").toFraction(), "270");
  assert.equal(normalizeDegrees("450").toFraction(), "90");
  assert.equal(normalizeDegrees("360").toFraction(), "0");
  assert.equal(normalizeDegrees("720.5").toFraction(), "1/2");
});

test("មុំបំពេញ និងមុំបន្ថែម", () => {
  assert.equal(complement("30").toFraction(), "60");
  assert.equal(complement("90").toFraction(), "0");
  assert.equal(supplement("120").toFraction(), "60");
  assert.equal(supplement("180").toFraction(), "0");
  assert.throws(() => complement("91"), /ANGLE_OUT_OF_RANGE/);
  assert.throws(() => supplement("181"), /ANGLE_OUT_OF_RANGE/);
});
