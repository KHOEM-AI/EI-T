// ទំនាក់ទំនងរវាង UI និងស្នូល៖ គណនា a (op) b ហើយត្រឡប់លទ្ធផល ឬកូដកំហុស
import { add, sub, mul, div } from "./rational.ts";

export type Op = "+" | "-" | "×" | "÷";
export type Result = { ok: true; value: string } | { ok: false; error: string };

export const OPS: readonly Op[] = ["+", "-", "×", "÷"];

export function calculate(a: string, op: Op, b: string): Result {
  try {
    const r = op === "+" ? add(a, b) : op === "-" ? sub(a, b) : op === "×" ? mul(a, b) : div(a, b);
    return { ok: true, value: r.toFraction() };
  } catch (e) {
    const code = e instanceof Error && /^[A-Z][A-Z0-9_]+$/.test(e.message) ? e.message : "INVALID_ARGUMENTS";
    return { ok: false, error: code };
  }
}
