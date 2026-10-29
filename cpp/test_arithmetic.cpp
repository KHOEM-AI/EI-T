#include <iostream>
#include <stdexcept>
#include <string>
#include "rational.hpp"

static int failed = 0;
static void eq(const std::string& got, const std::string& want, const char* name) {
  if (got != want) { std::cerr << "FAIL " << name << ": got " << got << " want " << want << "\n"; ++failed; }
}
template <class E, class F>
static void throws(F f, const std::string& msg, const char* name) {
  try { f(); std::cerr << "FAIL " << name << ": no throw\n"; ++failed; }
  catch (const E& e) { if (msg != e.what()) { std::cerr << "FAIL " << name << ": " << e.what() << "\n"; ++failed; } }
}

int main() {
  using namespace eit;
  eq(add("0.1", "0.2").toFraction(), "3/10", "add");
  eq(sub("1", "0.9").toFraction(), "1/10", "sub");
  eq(mul("3/4", "2/3").toFraction(), "1/2", "mul");
  eq(div("1", "3").toFraction(), "1/3", "div");
  eq(div("-6", "4").toFraction(), "-3/2", "div neg");
  throws<std::domain_error>([] { div("1", "0"); }, "DIVISION_BY_ZERO", "div zero");
  throws<std::invalid_argument>([] { add("abc", "1"); }, "INVALID_NUMBER", "invalid");
  throws<std::invalid_argument>([] { add("1.", "1"); }, "INVALID_NUMBER", "invalid dot");
  throws<std::overflow_error>([] { mul("9223372036854775807", "2"); }, "OVERFLOW", "overflow");
  if (failed) { std::cerr << failed << " failed\n"; return 1; }
  std::cout << "cpp arithmetic: all passed\n";
  return 0;
}
