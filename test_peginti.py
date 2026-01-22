# test_peginti.py
import unittest
from PEGINTI import repondre

class TestPEGINTI(unittest.TestCase):
    def test_repondre_bonjour(self):
        self.assertEqual(
            repondre("Bonjour"),
            "Bonjour, je suis PEGINTI. Comment puis-je vous aider aujourd'hui ?"
        )

    def test_repondre_hello(self):
        self.assertEqual(
            repondre("Hello"),
            "Hello, I am PEGINTI. How can I assist you today?"
        )

    def test_repondre_hola(self):
        self.assertEqual(
            repondre("Hola"),
            "Hola, soy PEGINTI. ¿Cómo puedo ayudarte hoy?"
        )

    def test_repondre_identite(self):
        self.assertIn("PEGINTI", repondre("Quelle est ton identité ?"))

    def test_repondre_aide(self):
        self.assertIn("aider", repondre("aide"))

    def test_repondre_default(self):
        # Cas où la langue est inconnue
        self.assertIn("français", repondre("xyz123"))

if __name__ == "__main__":
    unittest.main()
