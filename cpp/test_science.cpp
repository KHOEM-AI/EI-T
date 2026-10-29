#include <iostream>
#include <stdexcept>
#include <string>
#include "science.hpp"

static int failed = 0;
static void eq(const eit::Rational& got, const std::string& want, const char* name) {
  if (got.toFraction() != want) {
    std::cerr << "FAIL " << name << ": got " << got.toFraction() << " want " << want << "\n";
    ++failed;
  }
}

int main() {
  using namespace eit;
  eq(speed("100", "20"), "5", "speed");
  eq(force("2", "3/2"), "3", "force");
  eq(weight("10"), "196133/2000", "weight");
  eq(kineticEnergy("2", "3"), "9", "kineticEnergy");
  eq(density("500", "2"), "250", "density");
  eq(pressure("100", "4"), "25", "pressure");
  eq(work("10", "3/2"), "15", "work");
  eq(power("60", "12"), "5", "power");
  eq(molesFromMass("36", "18"), "2", "molesFromMass");
  eq(massFromMoles("2", "18"), "36", "massFromMoles");
  try { speed("1", "0"); std::cerr << "FAIL speed zero: no throw\n"; ++failed; }
  catch (const std::domain_error& e) { if (std::string(e.what()) != "DIVISION_BY_ZERO") { ++failed; } }
  if (failed) { std::cerr << failed << " failed\n"; return 1; }
  std::cout << "cpp science: all passed\n";
  return 0;
}
