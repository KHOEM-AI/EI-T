import test from "node:test";
import assert from "node:assert/strict";
import * as s from "../src/geometry/shapes.mjs";

test("ចតុកោណ និងការ៉េ", () => {
  assert.equal(s.rectangleArea("3", "4.5").toFraction(), "27/2");
  assert.equal(s.rectanglePerimeter("3", "4").toFraction(), "14");
  assert.equal(s.squareArea("1.5").toFraction(), "9/4");
});

test("ត្រីកោណ", () => {
  assert.equal(s.triangleAreaBaseHeight("6", "4").toFraction(), "12");
  assert.equal(s.trianglePerimeter("3", "4", "5").toFraction(), "12");
  assert.equal(s.triangleAreaSquared("3", "4", "5").toFraction(), "36");
  assert.equal(s.triangleValidate("1", "2", "3"), false);
  assert.throws(() => s.trianglePerimeter("1", "2", "3"), /INVALID_TRIANGLE/);
});

test("ចំណាត់ថ្នាក់ត្រីកោណ", () => {
  assert.equal(s.classifyTriangleBySides("2", "2", "2"), "equilateral");
  assert.equal(s.classifyTriangleBySides("2", "2", "3"), "isosceles");
  assert.equal(s.classifyTriangleBySides("3", "4", "5"), "scalene");
  assert.equal(s.classifyTriangleByAngles("3", "4", "5"), "right");
  assert.equal(s.classifyTriangleByAngles("4", "5", "6"), "acute");
  assert.equal(s.classifyTriangleByAngles("2", "3", "4"), "obtuse");
});

test("រង្វង់ (មេគុណ π)", () => {
  assert.equal(s.circleAreaPi("3").toFraction(), "9");
  assert.equal(s.circleCircumferencePi("2.5").toFraction(), "5");
  assert.equal(s.circleAreaApprox("1", 5), "3.14159");
});

test("កំហុស", () => {
  assert.throws(() => s.rectangleArea("0", "3"), /NON_POSITIVE_DIMENSION/);
  assert.throws(() => s.circleAreaPi("-1"), /NON_POSITIVE_DIMENSION/);
});
