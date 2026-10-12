"""Tests de sécurité et du pipeline. Lancer : python -m unittest discover -s tests -v"""
import os
import re
import tempfile
import time
import unittest
from unittest import mock

from backend import security as sec
from backend.app import create_app

ORIGINE = "http://127.0.0.1:4000"
MDP = "Tr0ub4dor&Zebre-91"


class Base(unittest.TestCase):
    extra_cfg: dict = {}

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.app = create_app({"PEGINTI_ENV": "test", "PEGINTI_DB": os.path.join(self.tmp.name, "t.db"),
                               "PEGINTI_PEPPER": "x" * 40, "PORT": "4000", "WOUNANET_PILOTE": "0",
                               "GEMINI_API_KEY": "", **self.extra_cfg})
        self.c = self.app.test_client()
        self.csrf = None

    def tearDown(self):
        self.tmp.cleanup()

    def req(self, methode, url, json=None, csrf=True, origine=ORIGINE, client=None):
        h = {}
        if origine:
            h["Origin"] = origine
        if csrf and self.csrf:
            h["X-CSRF-Token"] = self.csrf
        return getattr(client or self.c, methode)(url, json=json, headers=h)

    def inscrire(self, email="a@exemple.com", pseudo="Alice", mdp=MDP):
        return self.req("post", "/api/auth/inscription",
                        {"email": email, "pseudo": pseudo, "mot_de_passe": mdp})

    def connecter(self, email="a@exemple.com", mdp=MDP, **extra):
        r = self.req("post", "/api/auth/connexion", {"email": email, "mot_de_passe": mdp, **extra})
        if r.status_code == 200:
            self.csrf = r.get_json()["csrf"]
        return r

    def promouvoir(self, role, email="a@exemple.com"):
        with self.app.app_context():
            from backend.db import get_db
            get_db().execute("UPDATE utilisateurs SET role=? WHERE email=?", (role, email))
            get_db().commit()


class TestPrimitives(unittest.TestCase):
    def test_hash_et_verification(self):
        p = b"p" * 32
        h = sec.hasher_mot_de_passe("Secret!Passe123", p)
        self.assertTrue(sec.verifier_mot_de_passe("Secret!Passe123", h, p))
        self.assertFalse(sec.verifier_mot_de_passe("autre", h, p))
        self.assertFalse(sec.verifier_mot_de_passe("Secret!Passe123", h, b"q" * 32))  # mauvais poivre
        self.assertNotEqual(h, sec.hasher_mot_de_passe("Secret!Passe123", p))  # sel unique

    def test_politique(self):
        self.assertTrue(sec.verifier_politique_mdp("court"))
        self.assertTrue(sec.verifier_politique_mdp("motdepasse1234AB!"))
        self.assertTrue(sec.verifier_politique_mdp("aaaaaaaaaaaaAAAA1111"))
        self.assertTrue(sec.verifier_politique_mdp("alice.dupont-2024X", "alice.dupont@x.com"))
        self.assertEqual(sec.verifier_politique_mdp(MDP, "a@exemple.com", "Alice"), [])

    def test_totp_rfc6238(self):
        secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # « 12345678901234567890 »
        self.assertEqual(sec.totp_code(secret, 59), "287082")
        self.assertIsNotNone(sec.totp_verifier(secret, "287082", 0, 59))
        self.assertIsNone(sec.totp_verifier(secret, "287082", 1, 59))  # rejeu refusé

    def test_chiffrement_secret(self):
        p = b"k" * 32
        blob = sec.chiffrer_secret("ABCDEF234567", p)
        self.assertEqual(sec.dechiffrer_secret(blob, p), "ABCDEF234567")
        self.assertIsNone(sec.dechiffrer_secret(blob, b"z" * 32))
        altere = blob[:-4] + ("AAAA" if not blob.endswith("AAAA") else "BBBB")
        self.assertIsNone(sec.dechiffrer_secret(altere, p))

    def test_limiteur(self):
        lim = sec.LimiteurDebit()
        self.assertTrue(all(lim.autoriser("k", 3, 60)[0] for _ in range(3)))
        self.assertFalse(lim.autoriser("k", 3, 60)[0])


class TestComptes(Base):
    def test_inscription_connexion_cookie(self):
        self.assertEqual(self.inscrire().status_code, 201)
        r = self.connecter()
        self.assertEqual(r.status_code, 200)
        cookie = r.headers["Set-Cookie"]
        self.assertIn("HttpOnly", cookie)
        self.assertIn("SameSite=Lax", cookie)
        self.assertEqual(self.req("get", "/api/auth/moi").get_json()["utilisateur"]["pseudo"], "Alice")

    def test_inscription_mdp_faible_refusee(self):
        r = self.inscrire(mdp="password")
        self.assertEqual(r.status_code, 400)
        self.assertTrue(r.get_json()["details"])

    def test_pas_d_enumeration_inscription(self):
        a = self.inscrire()
        b = self.inscrire(pseudo="Autre")
        self.assertEqual((a.status_code, a.get_json()), (b.status_code, b.get_json()))

    def test_pas_d_enumeration_connexion(self):
        self.inscrire()
        a = self.connecter(mdp="Mauvais!Passe123")
        b = self.connecter(email="inconnu@exemple.com")
        self.assertEqual((a.status_code, a.get_json()), (b.status_code, b.get_json()))

    def test_verrouillage_apres_5_echecs(self):
        self.inscrire()
        for _ in range(5):
            self.assertEqual(self.connecter(mdp="Mauvais!Passe123").status_code, 401)
        # même avec le bon mot de passe, le compte est verrouillé
        self.assertEqual(self.connecter().status_code, 401)

    def test_limite_de_debit_connexion(self):
        codes = [self.connecter(email="x@exemple.com", mdp="Mauvais!Passe123").status_code
                 for _ in range(10)]
        self.assertIn(429, codes)

    def test_csrf_requis_si_session(self):
        self.inscrire()
        self.connecter()
        r = self.req("post", "/api/chat", {"message": "bonjour"}, csrf=False)
        self.assertEqual(r.status_code, 403)
        self.assertEqual(r.get_json()["code"], "csrf")
        self.assertEqual(self.req("post", "/api/chat", {"message": "bonjour"}).status_code, 200)

    def test_origine_etrangere_refusee(self):
        r = self.req("post", "/api/auth/connexion", {"email": "a@b.cc", "mot_de_passe": "x"},
                     origine="https://evil.example")
        self.assertEqual(r.status_code, 403)
        r = self.req("post", "/api/chat", {"message": "bonjour"}, origine=None)
        self.assertEqual(r.status_code, 403)

    def test_nouvelle_session_a_chaque_connexion(self):
        self.inscrire()
        t1 = self.connecter().headers["Set-Cookie"].split(";")[0]
        c2 = self.app.test_client()
        r2 = c2.post("/api/auth/connexion", json={"email": "a@exemple.com", "mot_de_passe": MDP},
                     headers={"Origin": ORIGINE})
        self.assertNotEqual(t1, r2.headers["Set-Cookie"].split(";")[0])

    def test_deconnexion_invalide_la_session(self):
        self.inscrire()
        self.connecter()
        self.assertEqual(self.req("post", "/api/auth/deconnexion").status_code, 200)
        self.assertIsNone(self.req("get", "/api/auth/moi").get_json()["utilisateur"])

    def test_jeton_session_stocke_hache(self):
        self.inscrire()
        r = self.connecter()
        brut = r.headers["Set-Cookie"].split(";")[0].split("=", 1)[1]
        with self.app.app_context():
            from backend.db import get_db
            hashes = [x[0] for x in get_db().execute("SELECT jeton_hash FROM sessions")]
        self.assertNotIn(brut, hashes)
        self.assertIn(sec.hash_jeton(brut), hashes)

    def test_changement_mdp_ferme_autres_sessions(self):
        self.inscrire()
        self.connecter()
        autre = self.app.test_client()
        autre.post("/api/auth/connexion", json={"email": "a@exemple.com", "mot_de_passe": MDP},
                   headers={"Origin": ORIGINE})
        r = self.req("post", "/api/auth/mot-de-passe", {"actuel": MDP, "nouveau": "Nouveau&Secret-2077"})
        self.assertEqual(r.status_code, 200)
        self.assertIsNone(autre.get("/api/auth/moi").get_json()["utilisateur"])
        self.assertIsNotNone(self.req("get", "/api/auth/moi").get_json()["utilisateur"])

    def test_double_authentification(self):
        self.inscrire()
        self.connecter()
        secret = self.req("post", "/api/auth/2fa/initier").get_json()["secret"]
        self.assertEqual(self.req("post", "/api/auth/2fa/activer", {"code": "000000"}).status_code, 400)
        code = sec.totp_code(secret)
        self.assertEqual(self.req("post", "/api/auth/2fa/activer", {"code": code}).status_code, 200)
        self.req("post", "/api/auth/deconnexion")
        self.csrf = None
        r = self.connecter()
        self.assertEqual(r.get_json()["code"], "totp_requis")
        self.assertEqual(self.connecter(code_totp=code).status_code, 401)  # même code = rejeu refusé
        with self.app.app_context():  # le secret n'est pas en clair en base
            from backend.db import get_db
            self.assertNotIn(secret, get_db().execute("SELECT totp_secret FROM utilisateurs").fetchone()[0])

    def test_reinitialisation_mdp(self):
        self.inscrire()
        self.connecter()
        envoyes = []
        with mock.patch("backend.courriel.envoyer", lambda d, s, c: envoyes.append(c) or True):
            self.req("post", "/api/auth/mot-de-passe-oublie", {"email": "a@exemple.com"})
            self.req("post", "/api/auth/mot-de-passe-oublie", {"email": "inconnu@exemple.com"})
        self.assertEqual(len(envoyes), 1)
        jeton = re.search(r"jeton=([\w\-]+)", envoyes[0]).group(1)
        faible = self.req("post", "/api/auth/reinitialiser", {"jeton": jeton, "mot_de_passe": "faible"})
        self.assertEqual(faible.status_code, 400)
        ok = self.req("post", "/api/auth/reinitialiser", {"jeton": jeton, "mot_de_passe": "Nouveau&Secret-2077"})
        self.assertEqual(ok.status_code, 200)
        self.assertEqual(self.req("post", "/api/auth/reinitialiser",
                                  {"jeton": jeton, "mot_de_passe": "Autre&Secret-2078"}).status_code, 400)
        self.assertIsNone(self.req("get", "/api/auth/moi").get_json()["utilisateur"])  # sessions révoquées
        self.csrf = None
        self.assertEqual(self.connecter(mdp="Nouveau&Secret-2077").status_code, 200)

    def test_suppression_compte_cascade(self):
        self.inscrire()
        self.connecter()
        self.req("post", "/api/chat", {"message": "bonjour"})
        r = self.req("delete", "/api/auth/compte", {"mot_de_passe": MDP})
        self.assertEqual(r.status_code, 200)
        with self.app.app_context():
            from backend.db import get_db
            for t in ("utilisateurs", "sessions", "memoire"):
                self.assertEqual(get_db().execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0], 0)


class TestAccesEtPipeline(Base):
    def test_wounanet_exige_un_compte(self):
        self.assertEqual(self.req("post", "/api/wounanet/rechercher", {"sujet": "économie"}).status_code, 401)
        self.assertEqual(self.req("get", "/api/wounanet/actualites").status_code, 200)  # fil public

    def test_studio_reserve_premium(self):
        self.inscrire()
        self.connecter()
        self.assertEqual(self.req("post", "/api/premium/studio", {"message": "aide"}).status_code, 403)
        self.promouvoir("premium")
        self.assertEqual(self.req("post", "/api/premium/studio", {"message": "aide"}).status_code, 200)

    def test_chat_anonyme_sans_quota(self):
        r = self.req("post", "/api/chat", {"message": "Bonjour"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()["texte"], "Bonjour, comment puis-je vous aider aujourd'hui ?")
        # 25 messages d'affilée : aucun refus (la garde anti-rafale est à 30 par 10 s)
        self.assertTrue(all(self.req("post", "/api/chat", {"message": "salut"}).status_code == 200
                            for _ in range(25)))

    def test_identite_locale(self):
        t = self.req("post", "/api/chat", {"message": "Qui es-tu ?"}).get_json()["texte"]
        self.assertIn("Tomo Ombede Barnabé Bertrand", t)

    def test_sans_moteur_reponse_honnete(self):
        t = self.req("post", "/api/chat", {"message": "Explique la photosynthèse"}).get_json()
        self.assertEqual(t["mode"], "indisponible")

    def test_bip_filtres_et_besoin(self):
        from backend.core import bip
        p = bip.scanner("Donne-moi les dernières actualités économiques", "CHAT_INTERACTIF", None)
        self.assertTrue(p["besoin_wounanet"])
        self.assertIn("rigueur_factuelle", p["filtres"])
        p = bip.scanner("Écris une fonction Python pour trier", "CHAT_INTERACTIF", None)
        self.assertEqual(p["intention"], "developpement")
        p = bip.scanner("quelle est la capitale du Cameroun", "CHAT_INTERACTIF", None)
        self.assertNotIn("developpeur", p["filtres"])  # « api » dans « capitale » ne déclenche pas

    def test_pipeline_complet_avec_llm_et_sources(self):
        self.inscrire()
        self.connecter()
        faux_src = [{"titre": "Titre", "source": "RFI", "lien": "https://x.test/a", "date": "2026-01-01T00:00:00+00:00",
                     "resume": "Résumé"}]
        sortie = '{"factuel":"Fait [1].","enrichi":"Analyse.","strategique":"Conseil."}'
        with mock.patch.object(self.app.extensions["wounanet"], "rechercher", return_value=faux_src), \
                mock.patch("backend.services.llm.generer", return_value=sortie) as llm:
            r = self.req("post", "/api/wounanet/rechercher", {"sujet": "énergie en Afrique"}).get_json()
        self.assertEqual(r["mode"], "llm")
        self.assertEqual(len(r["sections"]), 3)
        self.assertEqual(r["sources"][0]["lien"], "https://x.test/a")
        self.assertIn("<SOURCES>", llm.call_args[0][3])  # sources isolées comme données
        self.assertEqual(len(self.req("get", "/api/historique?vitrine=WOUNANET").get_json()["messages"]), 2)

    def test_historique_isole_par_utilisateur(self):
        self.inscrire()
        self.connecter()
        self.req("post", "/api/chat", {"message": "bonjour"})
        c2 = self.app.test_client()
        self.inscrire("b@exemple.com", "Bob")
        self.csrf = None
        self.connecter("b@exemple.com")
        self.assertEqual(self.req("get", "/api/historique").get_json()["messages"], [])

    def test_en_tetes_securite(self):
        r = self.c.get("/api/sante")
        self.assertIn("default-src 'self'", r.headers["Content-Security-Policy"])
        self.assertEqual(r.headers["X-Frame-Options"], "DENY")
        self.assertEqual(r.headers["Cache-Control"], "no-store")
        self.assertNotIn("memoire", r.get_json())

    def test_erreurs_sans_fuite(self):
        r = self.req("post", "/api/chat", {"message": 123})
        self.assertEqual(r.status_code, 400)
        r = self.c.post("/api/chat", data="x" * 200000, headers={"Origin": ORIGINE,
                                                               "Content-Type": "application/json"})
        self.assertEqual(r.status_code, 413)

    def test_catalogue_public_commande_protegee(self):
        self.assertEqual(len(self.req("get", "/api/premium/catalogue").get_json()["produits"]), 2)
        corps = {"lignes": [{"produit_id": 1, "quantite": 1}], "mode_paiement": "virement"}
        self.assertEqual(self.req("post", "/api/premium/commande", corps).status_code, 401)
        self.inscrire()
        self.connecter()
        # prix non fixé par le super administrateur : commande refusée, pas de prix inventé
        self.assertEqual(self.req("post", "/api/premium/commande", corps).status_code, 400)


class TestChatSansLimite(Base):
    extra_cfg = {"CHAT_ANTIFLOOD": "0"}

    def test_aucune_limite_quand_desactivee(self):
        self.assertTrue(all(self.req("post", "/api/chat", {"message": "salut"}).status_code == 200
                            for _ in range(80)))


class TestChatAntiRafale(Base):
    extra_cfg = {"CHAT_ANTIFLOOD": "5"}

    def test_rafale_bloquee(self):
        codes = [self.req("post", "/api/chat", {"message": "salut"}).status_code for _ in range(8)]
        self.assertEqual(codes[:5], [200] * 5)
        self.assertIn(429, codes[5:])


class TestHotes(Base):
    def test_redirection_vers_hote_canonique(self):
        self.app.config["PEGINTI"].base_url = "https://www.pegintichat.online"
        hotes = {"premium.pegintichat.online": ("/", "https://www.pegintichat.online/premium"),
                 "wounanet.pegintichat.online": ("/", "https://www.pegintichat.online/wounanet"),
                 "autre.pegintichat.online": ("/compte", "https://www.pegintichat.online/compte")}
        for hote, (chemin, attendu) in hotes.items():
            # redirect() de Werkzeug 3 rend l'URL absolue telle quelle
            self.app.config["PEGINTI"]  # config déjà modifiée
            r = self.c.get(chemin, headers={"Host": hote})
            self.assertEqual((r.status_code, r.headers["Location"]), (301, attendu))
        r = self.c.get("/", headers={"Host": "evil.example"})  # hôte étranger : pas de redirection ouverte
        self.assertEqual(r.status_code, 200)
        r = self.c.get("/", headers={"Host": "pegintichat.online"})  # domaine nu : laissé à Google AI Studio
        self.assertEqual(r.status_code, 200)


class TestWounanetParsing(unittest.TestCase):
    def test_rss_nettoye(self):
        from backend.services.wounanet import analyser_rss
        xml = b"""<rss><channel><item><title>T &amp; co</title><link>javascript:alert(1)</link>
        <description>&lt;b&gt;Salut&lt;/b&gt; monde</description><pubDate>Wed, 07 Oct 2026 01:00:00 GMT</pubDate>
        </item></channel></rss>"""
        it = analyser_rss(xml, "Src")[0]
        self.assertEqual(it["titre"], "T & co")
        self.assertEqual(it["lien"], "")  # schéma dangereux rejeté
        self.assertEqual(it["resume"], "Salut monde")
        self.assertTrue(it["date"].startswith("2026-10-07"))


if __name__ == "__main__":
    unittest.main()
