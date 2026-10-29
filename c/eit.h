/* EI-T (C11): exact rational arithmetic, mechanics and basic chemistry.
 * Header-only. 64-bit limits: results that do not fit return EIT_OVERFLOW
 * (never a silently wrong answer). Error names match the JS version. */
#ifndef EIT_H
#define EIT_H

#include <limits.h>
#include <stddef.h>
#include <stdio.h>

__extension__ typedef __int128 eit_i128;

typedef struct { long long n, d; } eit_rational;
typedef enum { EIT_OK = 0, EIT_DIVISION_BY_ZERO, EIT_INVALID_NUMBER, EIT_OVERFLOW } eit_err;

static inline const char *eit_err_name(eit_err e) {
  switch (e) {
    case EIT_OK: return "OK";
    case EIT_DIVISION_BY_ZERO: return "DIVISION_BY_ZERO";
    case EIT_INVALID_NUMBER: return "INVALID_NUMBER";
    default: return "OVERFLOW";
  }
}

static inline eit_i128 eit_abs(eit_i128 x) { return x < 0 ? -x : x; }

static inline eit_i128 eit_gcd(eit_i128 a, eit_i128 b) {
  a = eit_abs(a); b = eit_abs(b);
  while (b != 0) { eit_i128 t = a % b; a = b; b = t; }
  return a;
}

static inline eit_err eit_build(eit_i128 num, eit_i128 den, eit_rational *out) {
  if (den == 0) return EIT_DIVISION_BY_ZERO;
  if (den < 0) { num = -num; den = -den; }
  eit_i128 g = eit_gcd(num, den);
  if (g > 1) { num /= g; den /= g; }
  if (eit_abs(num) > (eit_i128)LLONG_MAX || den > (eit_i128)LLONG_MAX) return EIT_OVERFLOW;
  out->n = (long long)num;
  out->d = (long long)den;
  return EIT_OK;
}

/* v*10 + digit with overflow guard */
static inline eit_err eit_push(eit_i128 *v, int digit) {
  if (*v > ((eit_i128)LLONG_MAX - digit) / 10) return EIT_OVERFLOW;
  *v = *v * 10 + digit;
  return EIT_OK;
}

static inline int eit_isdigit(char c) { return c >= '0' && c <= '9'; }

/* Accepts "-12.345", "3/4", "42". */
static inline eit_err eit_parse(const char *s, eit_rational *out) {
  if (!s) return EIT_INVALID_NUMBER;
  size_t i = 0;
  int neg = 0;
  if (s[i] == '+' || s[i] == '-') { neg = (s[i] == '-'); i++; }
  eit_i128 num = 0, den = 1;
  size_t digits = 0;
  eit_err e;
  while (eit_isdigit(s[i])) {
    if ((e = eit_push(&num, s[i] - '0')) != EIT_OK) return e;
    i++; digits++;
  }
  if (digits == 0) return EIT_INVALID_NUMBER;
  if (s[i] == '\0') return eit_build(neg ? -num : num, den, out);
  if (s[i] == '/') {
    i++;
    den = 0;
    size_t dd = 0;
    while (eit_isdigit(s[i])) {
      if ((e = eit_push(&den, s[i] - '0')) != EIT_OK) return e;
      i++; dd++;
    }
    if (dd == 0 || s[i] != '\0') return EIT_INVALID_NUMBER;
    return eit_build(neg ? -num : num, den, out);
  }
  if (s[i] == '.') {
    i++;
    size_t fd = 0;
    while (eit_isdigit(s[i])) {
      if ((e = eit_push(&num, s[i] - '0')) != EIT_OK) return e;
      if ((e = eit_push(&den, 0)) != EIT_OK) return e;
      i++; fd++;
    }
    if (fd == 0 || s[i] != '\0') return EIT_INVALID_NUMBER;
    return eit_build(neg ? -num : num, den, out);
  }
  return EIT_INVALID_NUMBER;
}

static inline eit_err eit_add(eit_rational a, eit_rational b, eit_rational *o) {
  return eit_build((eit_i128)a.n * b.d + (eit_i128)b.n * a.d, (eit_i128)a.d * b.d, o);
}
static inline eit_err eit_sub(eit_rational a, eit_rational b, eit_rational *o) {
  return eit_build((eit_i128)a.n * b.d - (eit_i128)b.n * a.d, (eit_i128)a.d * b.d, o);
}
static inline eit_err eit_mul(eit_rational a, eit_rational b, eit_rational *o) {
  return eit_build((eit_i128)a.n * b.n, (eit_i128)a.d * b.d, o);
}
static inline eit_err eit_div(eit_rational a, eit_rational b, eit_rational *o) {
  return eit_build((eit_i128)a.n * b.d, (eit_i128)a.d * b.n, o);
}

/* "3/10" or "5" */
static inline void eit_to_string(eit_rational r, char *buf, size_t size) {
  if (r.d == 1) snprintf(buf, size, "%lld", r.n);
  else snprintf(buf, size, "%lld/%lld", r.n, r.d);
}

/* mechanics (SI) */
static inline eit_err eit_speed(eit_rational d, eit_rational t, eit_rational *o) { return eit_div(d, t, o); }
static inline eit_err eit_force(eit_rational m, eit_rational a, eit_rational *o) { return eit_mul(m, a, o); }
static inline eit_err eit_work(eit_rational f, eit_rational d, eit_rational *o) { return eit_mul(f, d, o); }
static inline eit_err eit_power(eit_rational w, eit_rational t, eit_rational *o) { return eit_div(w, t, o); }
static inline eit_err eit_density(eit_rational m, eit_rational v, eit_rational *o) { return eit_div(m, v, o); }
static inline eit_err eit_pressure(eit_rational f, eit_rational a, eit_rational *o) { return eit_div(f, a, o); }

/* W = m * g_n, g_n = 9.80665 = 196133/20000 */
static inline eit_err eit_weight(eit_rational m, eit_rational *o) {
  eit_rational g = {196133, 20000};
  return eit_mul(m, g, o);
}

/* E = m * v * v / 2 */
static inline eit_err eit_kinetic_energy(eit_rational m, eit_rational v, eit_rational *o) {
  eit_rational t, two = {2, 1};
  eit_err e;
  if ((e = eit_mul(m, v, &t)) != EIT_OK) return e;
  if ((e = eit_mul(t, v, &t)) != EIT_OK) return e;
  return eit_div(t, two, o);
}

/* chemistry: n = m / M, m = n * M (N_A does not fit in 64 bits, so the
 * particle-count functions exist only in the JS, TS and Python versions) */
static inline eit_err eit_moles_from_mass(eit_rational m, eit_rational molar, eit_rational *o) { return eit_div(m, molar, o); }
static inline eit_err eit_mass_from_moles(eit_rational n, eit_rational molar, eit_rational *o) { return eit_mul(n, molar, o); }

#endif /* EIT_H */
