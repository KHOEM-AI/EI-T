import React, { useState } from "react";
import * as eit from "../src/index.mjs";

// id, label, arguments (name, default value)
export const FUNCS = [
  { id: "add", label: "a + b", args: [["a", "0.1"], ["b", "0.2"]] },
  { id: "sub", label: "a - b", args: [["a", "1"], ["b", "0.9"]] },
  { id: "mul", label: "a x b", args: [["a", "3/4"], ["b", "2/3"]] },
  { id: "div", label: "a / b", args: [["a", "1"], ["b", "3"]] },
  { id: "speed", label: "Speed v = d / t", args: [["distance d (m)", "100"], ["time t (s)", "20"]] },
  { id: "force", label: "Force F = m a", args: [["mass m (kg)", "2"], ["acceleration a (m/s2)", "3/2"]] },
  { id: "weight", label: "Weight W = m g", args: [["mass m (kg)", "10"]] },
  { id: "kineticEnergy", label: "Kinetic energy E = m v^2 / 2", args: [["mass m (kg)", "2"], ["speed v (m/s)", "3"]] },
  { id: "density", label: "Density = m / V", args: [["mass m (kg)", "500"], ["volume V (m3)", "2"]] },
  { id: "pressure", label: "Pressure P = F / A", args: [["force F (N)", "100"], ["area A (m2)", "4"]] },
  { id: "work", label: "Work W = F d", args: [["force F (N)", "10"], ["distance d (m)", "3/2"]] },
  { id: "power", label: "Power P = W / t", args: [["work W (J)", "60"], ["time t (s)", "12"]] },
  { id: "molesFromMass", label: "Moles n = m / M", args: [["mass m (g)", "36"], ["molar mass M (g/mol)", "18"]] },
  { id: "massFromMoles", label: "Mass m = n M", args: [["moles n (mol)", "2"], ["molar mass M (g/mol)", "18"]] },
];

export function run(id, values) {
  try {
    const r = eit[id](...values);
    return { ok: true, fraction: r.toFraction(), decimal: r.toDecimal(10) };
  } catch (e) {
    const code = e instanceof Error && /^[A-Z][A-Z0-9_]+$/.test(e.message) ? e.message : "INVALID_ARGUMENTS";
    return { ok: false, error: code };
  }
}

export function Calculator() {
  const [index, setIndex] = useState(0);
  const fn = FUNCS[index];
  const [values, setValues] = useState(fn.args.map((a) => a[1]));
  const result = run(fn.id, values);

  const choose = (i) => {
    setIndex(i);
    setValues(FUNCS[i].args.map((a) => a[1]));
  };
  const setAt = (i, v) => setValues(values.map((x, j) => (j === i ? v : x)));

  return (
    <div>
      <select aria-label="function" value={index} onChange={(e) => choose(Number(e.target.value))}>
        {FUNCS.map((f, i) => (
          <option key={f.id} value={i}>{f.label}</option>
        ))}
      </select>
      {fn.args.map((a, i) => (
        <label key={a[0]}>
          {a[0]}
          <input aria-label={`arg${i + 1}`} value={values[i] ?? ""} onChange={(e) => setAt(i, e.target.value)} />
        </label>
      ))}
      <output aria-label="result">
        {result.ok ? `= ${result.fraction} (\u2248 ${result.decimal})` : `Error: ${result.error}`}
      </output>
    </div>
  );
}

export default Calculator;
