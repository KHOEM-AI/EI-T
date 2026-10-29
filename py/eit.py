"""EI-T (Python): exact arithmetic, mechanics and basic chemistry.

Numbers are passed as strings ("0.1", "3/4", "-5") and returned as Fraction.
Error codes match the JavaScript version: DIVISION_BY_ZERO, INVALID_NUMBER.
"""
import re
from fractions import Fraction

_FRACTION = re.compile(r"^([+-]?\d+)/(\d+)$")
_DECIMAL = re.compile(r"^([+-]?)(\d+)(?:\.(\d+))?$")

# SI exact constants
G_N = Fraction("9.80665")                 # m/s^2
N_A = Fraction(602214076) * 10**15        # 1/mol (6.02214076e23)


def to_r(x):
    """Parse "-12.345", "3/4" or "42" exactly (never uses eval or float)."""
    if isinstance(x, Fraction):
        return x
    t = str(x).strip()
    m = _FRACTION.match(t)
    if m:
        if int(m.group(2)) == 0:
            raise ZeroDivisionError("DIVISION_BY_ZERO")
        return Fraction(int(m.group(1)), int(m.group(2)))
    m = _DECIMAL.match(t)
    if not m:
        raise ValueError("INVALID_NUMBER")
    frac = m.group(3) or ""
    n = int(m.group(2) + frac)
    n = -n if m.group(1) == "-" else n
    return Fraction(n, 10 ** len(frac))


def to_fraction(r):
    """Format like the JS version: "3/10" or "5"."""
    return str(r.numerator) if r.denominator == 1 else f"{r.numerator}/{r.denominator}"


def _div(a, b):
    if b == 0:
        raise ZeroDivisionError("DIVISION_BY_ZERO")
    return a / b


# arithmetic
def add(a, b): return to_r(a) + to_r(b)
def sub(a, b): return to_r(a) - to_r(b)
def mul(a, b): return to_r(a) * to_r(b)
def div(a, b): return _div(to_r(a), to_r(b))


# mechanics (SI)
def speed(d, t): return _div(to_r(d), to_r(t))
def force(m, a): return to_r(m) * to_r(a)
def weight(m): return to_r(m) * G_N
def kinetic_energy(m, v): return to_r(m) * to_r(v) * to_r(v) / 2
def density(m, v): return _div(to_r(m), to_r(v))
def pressure(f, a): return _div(to_r(f), to_r(a))
def work(f, d): return to_r(f) * to_r(d)
def power(w, t): return _div(to_r(w), to_r(t))


# chemistry
def moles_from_particles(n): return to_r(n) / N_A
def particles_from_moles(n): return to_r(n) * N_A
def moles_from_mass(m, molar_mass): return _div(to_r(m), to_r(molar_mass))
def mass_from_moles(n, molar_mass): return to_r(n) * to_r(molar_mass)
