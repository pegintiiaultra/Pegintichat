import io
import unittest
import urllib.error
from types import SimpleNamespace
from unittest import mock

from backend.config import _cles_gemini
from backend.services import llm


def cfg(cles, strat="tourniquet"):
    return SimpleNamespace(gemini_keys=tuple(cles), gemini_key=cles[0] if cles else "",
                           gemini_model="m", gemini_strategie=strat)


def http(code, ra=None):
    h = {"Retry-After": ra} if ra else {}
    return urllib.error.HTTPError("u", code, "x", h, io.BytesIO(b""))


class RotationCles(unittest.TestCase):
    def setUp(self):
        llm.RESERVE = llm.ReserveDeCles()

    def test_lecture_des_cles(self):
        e = {"GEMINI_API_KEYS": "a,b\nc", "GEMINI_API_KEY": "a", "GEMINI_API_KEY_1": "d", "GEMINI_API_KEY_2": ""}
        self.assertEqual(_cles_gemini(e), ("a", "b", "c", "d"))
        self.assertEqual(_cles_gemini({}), ())

    def test_cles_collees_par_des_points(self):
        e = {"GEMINI_API_KEYS": "AQ.aaa-1.AQ.bbb_2.AQ.ccc3,AQ.ddd4"}
        self.assertEqual(_cles_gemini(e), ("AQ.aaa-1", "AQ.bbb_2", "AQ.ccc3", "AQ.ddd4"))

    def test_bascule_sur_la_cle_suivante_quand_epuisee(self):
        appels = []

        def faux(c, cle, corps, mod=None):
            appels.append(cle)
            if cle == "k1":
                raise http(429)
            return "ok " + cle
        with mock.patch.object(llm, "_appel", faux):
            self.assertEqual(llm.generer(cfg(["k1", "k2", "k3"], "sequentiel"), "s", [], "m"), "ok k2")
            self.assertEqual(appels, ["k1", "k2"])
            appels.clear()
            llm.generer(cfg(["k1", "k2", "k3"], "sequentiel"), "s", [], "m")
            self.assertEqual(appels, ["k2"])  # k1 est en pause : plus d'appel perdu

    def test_tourniquet_repartit(self):
        vus = []
        with mock.patch.object(llm, "_appel", lambda c, k, b, mod=None: vus.append(k) or "ok"):
            for _ in range(6):
                llm.generer(cfg(["a", "b", "c"]), "s", [], "m")
        self.assertEqual(vus, ["a", "b", "c", "a", "b", "c"])

    def test_cle_refusee_et_toutes_epuisees(self):
        def faux(c, k, b, mod=None):
            raise http(403 if k == "a" else 429)
        with mock.patch.object(llm, "_appel", faux):
            self.assertIsNone(llm.generer(cfg(["a", "b"]), "s", [], "m"))
            self.assertEqual(llm.etat_moteur(cfg(["a", "b"]))["disponibles"], 0)

    def test_modele_404_essaie_le_modele_suivant(self):
        c = cfg(["a"]); c.gemini_model = "vieux,nouveau"
        def faux(cf, k, b, mod=None):
            if mod == "vieux":
                raise http(404)
            return "ok " + mod
        with mock.patch.object(llm, "_appel", faux):
            self.assertEqual(llm.generer(c, "s", [], "m"), "ok nouveau")

    def test_tous_modeles_404_signale_la_cause_sans_punir_les_cles(self):
        c = cfg(["a", "b"]); c.gemini_model = "x"
        with mock.patch.object(llm, "_appel", lambda *a, **k: (_ for _ in ()).throw(http(404))):
            self.assertIsNone(llm.generer(c, "s", [], "m"))
        self.assertTrue(llm.CAUSE["modele_introuvable"])
        self.assertEqual(llm.RESERVE.disponibles(("a", "b")), 2)

    def test_surcharge_503_essaie_le_modele_suivant_sur_la_meme_cle(self):
        c = cfg(["a", "b"]); c.gemini_model = "m1,m2"
        vus = []
        def faux(cf, k, b, mod=None):
            vus.append((k, mod))
            if mod == "m1":
                raise http(503)
            return "ok"
        with mock.patch.object(llm, "_appel", faux):
            self.assertEqual(llm.generer(c, "s", [], "m"), "ok")
        self.assertEqual(vus, [("a", "m1"), ("a", "m2")])

    def test_pas_de_cle(self):
        self.assertIsNone(llm.generer(cfg([]), "s", [], "m"))


if __name__ == "__main__":
    unittest.main()
