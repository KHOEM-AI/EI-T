#include <stdio.h>
#include <string.h>
#include "eit.h"

static int failed = 0;

/* parse a, parse b, apply op, compare result string (or error name) */
typedef eit_err (*binop)(eit_rational, eit_rational, eit_rational *);

static void check(const char *name, binop op, const char *a, const char *b, const char *want) {
  eit_rational x, y, r;
  char got[64];
  eit_err e = eit_parse(a, &x);
  if (e == EIT_OK) e = eit_parse(b, &y);
  if (e == EIT_OK) e = op(x, y, &r);
  if (e != EIT_OK) snprintf(got, sizeof got, "%s", eit_err_name(e));
  else eit_to_string(r, got, sizeof got);
  if (strcmp(got, want) != 0) {
    fprintf(stderr, "FAIL %s: got %s want %s\n", name, got, want);
    failed++;
  }
}

static eit_err weight2(eit_rational m, eit_rational u, eit_rational *o) { (void)u; return eit_weight(m, o); }

int main(void) {
  check("add", eit_add, "0.1", "0.2", "3/10");
  check("sub", eit_sub, "1", "0.9", "1/10");
  check("mul", eit_mul, "3/4", "2/3", "1/2");
  check("div", eit_div, "1", "3", "1/3");
  check("div neg", eit_div, "-6", "4", "-3/2");
  check("div zero", eit_div, "1", "0", "DIVISION_BY_ZERO");
  check("zero denominator", eit_add, "1/0", "1", "DIVISION_BY_ZERO");
  check("invalid", eit_add, "abc", "1", "INVALID_NUMBER");
  check("invalid dot", eit_add, "1.", "1", "INVALID_NUMBER");
  check("invalid empty", eit_add, "", "1", "INVALID_NUMBER");
  check("invalid exp", eit_add, "1e5", "1", "INVALID_NUMBER");
  check("overflow", eit_mul, "9223372036854775807", "2", "OVERFLOW");
  check("overflow parse", eit_add, "99999999999999999999", "1", "OVERFLOW");
  check("speed", eit_speed, "100", "20", "5");
  check("force", eit_force, "2", "3/2", "3");
  check("weight", weight2, "10", "0", "196133/2000");
  check("density", eit_density, "500", "2", "250");
  check("pressure", eit_pressure, "100", "4", "25");
  check("work", eit_work, "10", "3/2", "15");
  check("power", eit_power, "60", "12", "5");
  check("moles", eit_moles_from_mass, "36", "18", "2");
  check("mass", eit_mass_from_moles, "2", "18", "36");

  { /* kinetic energy */
    eit_rational m, v, r; char got[64];
    eit_parse("2", &m); eit_parse("3", &v);
    eit_kinetic_energy(m, v, &r); eit_to_string(r, got, sizeof got);
    if (strcmp(got, "9") != 0) { fprintf(stderr, "FAIL kinetic: %s\n", got); failed++; }
  }

  if (failed) { fprintf(stderr, "%d failed\n", failed); return 1; }
  puts("c eit: all passed");
  return 0;
}
