import unittest
from eit import (add, sub, mul, div, speed, force, weight, kinetic_energy, density,
                 pressure, work, power, moles_from_particles, particles_from_moles,
                 moles_from_mass, mass_from_moles, to_fraction as f, N_A)


class TestEit(unittest.TestCase):
    def test_arithmetic(self):
        self.assertEqual(f(add("0.1", "0.2")), "3/10")
        self.assertEqual(f(sub("1", "0.9")), "1/10")
        self.assertEqual(f(mul("3/4", "2/3")), "1/2")
        self.assertEqual(f(div("1", "3")), "1/3")
        self.assertEqual(f(div("-6", "4")), "-3/2")

    def test_errors(self):
        with self.assertRaisesRegex(ZeroDivisionError, "^DIVISION_BY_ZERO$"):
            div("1", "0")
        with self.assertRaisesRegex(ZeroDivisionError, "^DIVISION_BY_ZERO$"):
            add("1/0", "1")
        for bad in ("abc", "1.", "1e5", "", "1 2"):
            with self.assertRaisesRegex(ValueError, "^INVALID_NUMBER$"):
                add(bad, "1")

    def test_big_numbers(self):
        self.assertEqual(f(mul("123456789012345678901234567890", "2")), "246913578024691357802469135780")

    def test_mechanics(self):
        self.assertEqual(f(speed("100", "20")), "5")
        self.assertEqual(f(force("2", "3/2")), "3")
        self.assertEqual(f(weight("10")), "196133/2000")
        self.assertEqual(f(kinetic_energy("2", "3")), "9")
        self.assertEqual(f(density("500", "2")), "250")
        self.assertEqual(f(pressure("100", "4")), "25")
        self.assertEqual(f(work("10", "3/2")), "15")
        self.assertEqual(f(power("60", "12")), "5")
        with self.assertRaises(ZeroDivisionError):
            speed("1", "0")

    def test_chemistry(self):
        self.assertEqual(particles_from_moles("1"), N_A)
        self.assertEqual(f(moles_from_particles("602214076000000000000000")), "1")
        self.assertEqual(f(moles_from_mass("36", "18")), "2")
        self.assertEqual(f(mass_from_moles("2", "18")), "36")


if __name__ == "__main__":
    unittest.main()
