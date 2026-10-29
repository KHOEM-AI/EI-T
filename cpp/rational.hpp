// EI-T (C++17): ប្រភាគពិតប្រាកដ + បូក ដក គុណ ចែក
// កូដកំហុសដូច MJS៖ DIVISION_BY_ZERO, INVALID_NUMBER (បន្ថែម OVERFLOW)
#pragma once
#include <cstdint>
#include <stdexcept>
#include <string>

namespace eit {

using i64 = long long;
__extension__ typedef __int128 i128;

inline i128 abs128(i128 x) { return x < 0 ? -x : x; }

inline i128 gcd128(i128 a, i128 b) {
  a = abs128(a);
  b = abs128(b);
  while (b != 0) { i128 t = a % b; a = b; b = t; }
  return a;
}

class Rational {
 public:
  i64 n = 0;
  i64 d = 1;

  Rational() = default;
  Rational(i64 num, i64 den = 1) { set(num, den); }

  // ទទួលតែ "-12.345", "3/4", "42"
  static Rational parse(const std::string& s) {
    size_t i = 0, len = s.size();
    bool neg = false;
    if (i < len && (s[i] == '+' || s[i] == '-')) { neg = (s[i] == '-'); ++i; }
    i128 num = 0, den = 1;
    size_t digits = 0;
    while (i < len && s[i] >= '0' && s[i] <= '9') { num = push(num, s[i] - '0'); ++i; ++digits; }
    if (digits == 0) throw std::invalid_argument("INVALID_NUMBER");
    if (i == len) return make(neg, num, den);
    if (s[i] == '/') {
      ++i;
      size_t dd = 0;
      den = 0;
      while (i < len && s[i] >= '0' && s[i] <= '9') { den = push(den, s[i] - '0'); ++i; ++dd; }
      if (dd == 0 || i != len) throw std::invalid_argument("INVALID_NUMBER");
      return make(neg, num, den);
    }
    if (s[i] == '.') {
      ++i;
      size_t fd = 0;
      while (i < len && s[i] >= '0' && s[i] <= '9') {
        num = push(num, s[i] - '0');
        den = push(den, 0);
        if (den == 0) throw std::overflow_error("OVERFLOW");
        ++i; ++fd;
      }
      if (fd == 0 || i != len) throw std::invalid_argument("INVALID_NUMBER");
      return make(neg, num, den);
    }
    throw std::invalid_argument("INVALID_NUMBER");
  }

  Rational add(const Rational& o) const { return build((i128)n * o.d + (i128)o.n * d, (i128)d * o.d); }
  Rational sub(const Rational& o) const { return build((i128)n * o.d - (i128)o.n * d, (i128)d * o.d); }
  Rational mul(const Rational& o) const { return build((i128)n * o.n, (i128)d * o.d); }
  Rational div(const Rational& o) const { return build((i128)n * o.d, (i128)d * o.n); }

  std::string toFraction() const {
    return d == 1 ? std::to_string(n) : std::to_string(n) + "/" + std::to_string(d);
  }

 private:
  // v*10 + digit ជាមួយការពារលើស
  static i128 push(i128 v, int digit) {
    const i128 LIM = (i128)9223372036854775807LL;
    if (v > (LIM - digit) / 10) throw std::overflow_error("OVERFLOW");
    return v * 10 + digit;
  }
  static Rational make(bool neg, i128 num, i128 den) { return build(neg ? -num : num, den); }
  static Rational build(i128 num, i128 den) {
    if (den == 0) throw std::domain_error("DIVISION_BY_ZERO");
    if (den < 0) { num = -num; den = -den; }
    i128 g = gcd128(num, den);
    if (g > 1) { num /= g; den /= g; }
    const i128 LIM = (i128)9223372036854775807LL;
    if (abs128(num) > LIM || den > LIM) throw std::overflow_error("OVERFLOW");
    Rational r;
    r.n = (i64)num;
    r.d = (i64)den;
    return r;
  }
  void set(i64 num, i64 den) { *this = build(num, den); }
};

inline Rational toR(const std::string& s) { return Rational::parse(s); }
inline Rational add(const std::string& a, const std::string& b) { return toR(a).add(toR(b)); }
inline Rational sub(const std::string& a, const std::string& b) { return toR(a).sub(toR(b)); }
inline Rational mul(const std::string& a, const std::string& b) { return toR(a).mul(toR(b)); }
inline Rational div(const std::string& a, const std::string& b) { return toR(a).div(toR(b)); }

}  // namespace eit
