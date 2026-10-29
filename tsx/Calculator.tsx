import { useState } from "react";
import { calculate, OPS } from "./calculate.ts";
import type { Op } from "./calculate.ts";

// ម៉ាស៊ីនគិតលេខពិតប្រាកដ (0.1 + 0.2 = 3/10)
export function Calculator() {
  const [a, setA] = useState("0.1");
  const [op, setOp] = useState<Op>("+");
  const [b, setB] = useState("0.2");
  const result = calculate(a, op, b);

  return (
    <div>
      <input aria-label="a" value={a} onChange={(e) => setA(e.target.value)} />
      <select aria-label="operator" value={op} onChange={(e) => setOp(e.target.value as Op)}>
        {OPS.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <input aria-label="b" value={b} onChange={(e) => setB(e.target.value)} />
      <output aria-label="result">{result.ok ? `= ${result.value}` : `Error: ${result.error}`}</output>
    </div>
  );
}

export default Calculator;
