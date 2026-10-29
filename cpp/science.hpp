// EI-T (C++17): mechanics and basic chemistry on top of rational.hpp.
// 64-bit limits apply (OVERFLOW is thrown, never a wrong answer). N_A does not
// fit in 64 bits, so particle-count functions exist only in JS, TS and Python.
#pragma once
#include <string>
#include "rational.hpp"

namespace eit {

inline Rational speed(const std::string& d, const std::string& t) { return div(d, t); }
inline Rational force(const std::string& m, const std::string& a) { return mul(m, a); }
inline Rational work(const std::string& f, const std::string& d) { return mul(f, d); }
inline Rational power(const std::string& w, const std::string& t) { return div(w, t); }
inline Rational density(const std::string& m, const std::string& v) { return div(m, v); }
inline Rational pressure(const std::string& f, const std::string& a) { return div(f, a); }

// W = m * g_n, g_n = 9.80665 = 196133/20000
inline Rational weight(const std::string& m) { return toR(m).mul(Rational(196133, 20000)); }

// E = m * v * v / 2
inline Rational kineticEnergy(const std::string& m, const std::string& v) {
  return toR(m).mul(toR(v)).mul(toR(v)).div(Rational(2));
}

// n = m / M, m = n * M
inline Rational molesFromMass(const std::string& m, const std::string& M) { return div(m, M); }
inline Rational massFromMoles(const std::string& n, const std::string& M) { return mul(n, M); }

}  // namespace eit
