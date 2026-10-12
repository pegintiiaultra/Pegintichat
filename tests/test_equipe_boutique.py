"""Équipe TOMTECH.INC, permissions, 2FA obligatoire, boutique, logiciels, activité."""
import io
import os
import re
import tempfile
import time
import unittest
from unittest import mock

from backend import security as sec
from backend.db import get_db

from tests.test_plateforme import MDP, ORIGINE, Base

PEPPER = b"x" * 40
LOGICIELS = tempfile.mkdtemp()


class Horloge:
    """Fait avancer le temps de 30 s par code : chaque action sensible exige un code TOTP jamais utilisé."""

    def __init__(self):
        self.reel, self.decalage = time.time, 0

    def __call__(self):
        return self.reel() + self.decalage


class Acteur:
    def __init__(self, test, email, secret=None, mdp=MDP):
        self.t, self.email, self.secret, self.mdp = test, email, secret, mdp
        self.c, self.csrf = test.app.test_client(), None

    def req(self, methode, url, json=None, origine=ORIGINE, **kw):
        h = {"Origin": origine} if origine else {}
        if self.csrf:
            h["X-CSRF-Token"] = self.csrf
        return getattr(self.c, methode)(url, json=json, headers=h, **kw)

    def code(self):
        return self.t.code(self.secret)

    def connecter(self, **extra):
        corps = {"email": self.email, "mot_de_passe": self.mdp, **extra}
        if self.secret and not extra:
            corps["code_totp"] = self.code()
        r = self.req("post", "/api/auth/connexion", corps)
        if r.status_code == 200:
            self.csrf = r.get_json()["csrf"]
        return r

    def sensible(self, methode, url, corps=None):
        """Action sensible : ajoute un code TOTP frais."""
        return self.req(methode, url, {**(corps or {}), "code_totp": self.code()})


class BaseEquipe(Base):
    extra_cfg = {"PEGINTI_LOGICIELS": LOGICIELS, "CHAT_ANTIFLOOD": "0"}

    def setUp(self):
        super().setUp()
        self.horloge = Horloge()
        patcher = mock.patch("time.time", self.horloge)
        patcher.start()
        self.addCleanup(patcher.stop)

    def code(self, secret):
        self.horloge.decalage += 30
        return sec.totp_code(secret, time.time())

    def creer(self, email, role="gratuit", totp=True, mdp=MDP) -> Acteur:
        secret = sec.totp_nouveau_secret() if totp else None
        with self.app.app_context():
            db = get_db()
            db.execute("INSERT INTO utilisateurs(email, pseudo, mdp_hash, role, email_verifie, totp_secret, totp_actif, "
                       "cree_le) VALUES (?,?,?,?,1,?,?,?)",
                       (email, email.split("@")[0], sec.hasher_mot_de_passe(mdp, PEPPER), role,
                        sec.chiffrer_secret(secret, PEPPER) if secret else None, 1 if totp else 0, int(time.time())))
            db.commit()
        return Acteur(self, email, secret, mdp)

    def sql(self, requete, params=()):
        with self.app.app_context():
            db = get_db()
            cur = db.execute(requete, params)
            db.commit()
            return cur.fetchall() if requete.lstrip().upper().startswith("SELECT") else None

    def superadmin(self) -> Acteur:
        a = self.creer("fondateur@exemple.com", "superadmin")
        self.assertEqual(a.connecter().status_code, 200)
        return a


class Test2FAObligatoire(BaseEquipe):
    def test_equipe_bloquee_sans_2fa_puis_libre(self):
        a = self.creer("tech@exemple.com", "admin", totp=False)
        r = a.connecter()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.get_json()["utilisateur"]["restreint"])
        r = a.req("get", "/api/admin/etat")
        self.assertEqual((r.status_code, r.get_json()["code"]), (403, "2fa_obligatoire"))
        self.assertEqual(a.req("post", "/api/chat", {"message": "bonjour"}).status_code, 403)
        self.assertEqual(a.req("get", "/api/auth/moi").status_code, 200)  # reste ouvert pour activer la 2FA
        secret = a.req("post", "/api/auth/2fa/initier", {}).get_json()["secret"]
        a.secret = secret
        r = a.req("post", "/api/auth/2fa/activer", {"code": self.code(secret)})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.get_json()["codes_secours"]), 8)
        self.assertEqual(a.req("get", "/api/admin/etat").status_code, 200)

    def test_equipe_ne_peut_pas_desactiver_la_2fa(self):
        a = self.creer("tech@exemple.com", "technique")
        a.connecter()
        r = a.req("post", "/api/auth/2fa/desactiver", {"mot_de_passe": MDP, "code": a.code()})
        self.assertEqual((r.status_code, r.get_json()["code"]), (403, "2fa_obligatoire"))

    def test_domaine_equipe_oblige_aussi_la_2fa(self):
        a = self.creer("quelquun@tomtech.inc", "gratuit", totp=False)
        self.assertTrue(a.connecter().get_json()["utilisateur"]["restreint"])
        simple = self.creer("simple@exemple.com", "gratuit", totp=False)
        self.assertFalse(simple.connecter().get_json()["utilisateur"]["restreint"])
        self.assertEqual(simple.req("post", "/api/auth/2fa/desactiver",
                                    {"mot_de_passe": MDP, "code": "000000"}).status_code, 403)  # code faux, pas « obligatoire »

    def test_utilisateur_ordinaire_peut_desactiver_sa_2fa(self):
        u = self.creer("simple@exemple.com", "gratuit")
        u.connecter()
        r = u.req("post", "/api/auth/2fa/desactiver", {"mot_de_passe": MDP, "code": u.code()})
        self.assertEqual(r.status_code, 200)

    def test_codes_de_secours(self):
        u = self.creer("simple@exemple.com", "gratuit", totp=False)
        u.connecter()
        u.secret = u.req("post", "/api/auth/2fa/initier", {}).get_json()["secret"]
        codes = u.req("post", "/api/auth/2fa/activer", {"code": self.code(u.secret)}).get_json()["codes_secours"]
        self.assertTrue(re.fullmatch(r"[A-Z2-9]{5}-[A-Z2-9]{5}", codes[0]))
        u.req("post", "/api/auth/deconnexion", {})
        u.csrf = None
        self.assertEqual(u.connecter(code_secours=codes[0]).status_code, 200)
        u.req("post", "/api/auth/deconnexion", {})
        u.csrf = None
        self.assertEqual(u.connecter(code_secours=codes[0]).status_code, 401)  # à usage unique
        r = u.connecter(code_secours=codes[1].lower().replace("-", " "))  # insensible à la casse et au format
        self.assertEqual(r.status_code, 200)
        nouveaux = u.req("post", "/api/auth/2fa/codes-secours", {"mot_de_passe": MDP, "code": u.code()}).get_json()
        u.req("post", "/api/auth/deconnexion", {})
        u.csrf = None
        self.assertEqual(u.connecter(code_secours=codes[2]).status_code, 401)  # anciens codes invalidés
        self.assertEqual(u.connecter(code_secours=nouveaux["codes_secours"][0]).status_code, 200)
        stockes = [x[0] for x in self.sql("SELECT code_hash FROM codes_secours")]
        self.assertNotIn(codes[0], stockes)  # seuls les hash sont stockés


class TestPermissions(BaseEquipe):
    def test_matrice_des_droits(self):
        admin, tech = self.creer("adm@exemple.com", "admin"), self.creer("tec@exemple.com", "technique")
        sup = self.creer("sup@exemple.com", "superadmin")
        for a in (admin, tech, sup):
            self.assertEqual(a.connecter().status_code, 200)
        attendu = {  # route : (technique, admin, superadmin)
            "/api/admin/tableau": (403, 403, 200),
            "/api/admin/equipe": (403, 403, 200),
            "/api/admin/utilisateurs": (403, 200, 200),
            "/api/admin/commandes": (403, 200, 200),
            "/api/admin/produits": (403, 200, 200),
            "/api/admin/logiciels": (403, 403, 200),
            "/api/admin/parametres/paiement": (403, 403, 200),
            "/api/admin/etat": (200, 200, 200),
            "/api/admin/moi": (200, 200, 200),
        }
        for url, codes in attendu.items():
            obtenus = tuple(a.req("get", url).status_code for a in (tech, admin, sup))
            self.assertEqual(obtenus, codes, url)

    def test_un_visiteur_ou_un_membre_n_entre_pas(self):
        self.assertEqual(self.req("get", "/api/admin/etat").status_code, 401)
        u = self.creer("simple@exemple.com", "gratuit")
        u.connecter()
        self.assertEqual(u.req("get", "/api/admin/moi").status_code, 403)
        self.assertEqual(u.req("get", "/api/admin/etat").status_code, 403)

    def test_refus_journalises_et_audit_limite_a_soi(self):
        admin, sup = self.creer("adm@exemple.com", "admin"), self.creer("sup@exemple.com", "superadmin")
        admin.connecter(), sup.connecter()
        admin.req("get", "/api/admin/tableau")
        propre = admin.req("get", "/api/admin/audit").get_json()
        self.assertEqual(propre["portee"], "propre")
        self.assertTrue(all(e["email"] == "adm@exemple.com" for e in propre["evenements"]))
        tout = sup.req("get", "/api/admin/audit?q=permission_refusee").get_json()
        self.assertEqual(tout["portee"], "tout")
        self.assertTrue(any("tableau" in (e["detail"] or "") for e in tout["evenements"]))

    def test_admin_modere_les_utilisateurs_pas_l_equipe(self):
        admin = self.creer("adm@exemple.com", "admin")
        membre, autre_admin = self.creer("membre@exemple.com"), self.creer("adm2@exemple.com", "admin")
        admin.connecter()
        liste = admin.req("get", "/api/admin/utilisateurs").get_json()["utilisateurs"]
        self.assertEqual({u["email"] for u in liste}, {"membre@exemple.com"})  # aucun compte d'équipe listé
        ids = {r["email"]: r["id"] for r in self.sql("SELECT id, email FROM utilisateurs")}
        r = admin.req("post", f"/api/admin/utilisateurs/{ids['membre@exemple.com']}/action", {"action": "desactiver"})
        self.assertEqual(r.status_code, 200)
        self.assertFalse(r.get_json()["utilisateur"]["actif"])
        r = admin.req("post", f"/api/admin/utilisateurs/{ids['adm2@exemple.com']}/action", {"action": "desactiver"})
        self.assertEqual((r.status_code, r.get_json()["code"]), (403, "equipe"))
        r = admin.req("post", f"/api/admin/utilisateurs/{ids['membre@exemple.com']}/action",
                      {"action": "accorder_premium", "jours": 10})
        self.assertEqual(r.get_json()["utilisateur"]["role"], "premium")


class TestSuperAdminEquipe(BaseEquipe):
    def test_action_sensible_exige_un_code_frais(self):
        sup = self.superadmin()
        corps = {"email": "nouveau@exemple.com", "pseudo": "Nouveau", "role": "admin"}
        r = sup.req("post", "/api/admin/equipe", corps)  # session ouverte mais pas de code
        self.assertEqual((r.status_code, r.get_json()["code"]), (403, "totp_requis"))
        r = sup.req("post", "/api/admin/equipe", {**corps, "code_totp": "000000"})
        self.assertEqual(r.status_code, 403)
        self.assertEqual(sup.sensible("post", "/api/admin/equipe", corps).status_code, 201)

    def test_creation_invitation_et_premiere_connexion(self):
        sup = self.superadmin()
        r = sup.sensible("post", "/api/admin/equipe", {"email": "tech@exemple.com", "pseudo": "Technicien",
                                                       "role": "technique", "charge": "Exploitation nuit"})
        self.assertEqual(r.status_code, 201)
        corps = r.get_json()
        self.assertEqual(corps["utilisateur"]["charge"], "Exploitation nuit")
        jeton = re.search(r"jeton=([\w\-]+)", corps["lien_invitation"]).group(1)
        nouveau = Acteur(self, "tech@exemple.com", None, "Mot&Passe-2026-Neuf")
        self.assertEqual(nouveau.req("post", "/api/auth/connexion",
                                     {"email": "tech@exemple.com", "mot_de_passe": "n'importe"}).status_code, 401)
        r = nouveau.req("post", "/api/auth/reinitialiser", {"jeton": jeton, "mot_de_passe": nouveau.mdp})
        self.assertEqual(r.status_code, 200)
        r = nouveau.connecter()
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.get_json()["utilisateur"]["restreint"])  # 2FA à activer dès la première connexion
        self.assertEqual(nouveau.req("get", "/api/admin/etat").status_code, 403)
        self.assertEqual(nouveau.req("get", "/api/auth/moi").get_json()["utilisateur"]["role"], "technique")

    def test_creation_limites(self):
        sup = self.superadmin()
        for role in ("superadmin", "gratuit", "autre"):
            r = sup.sensible("post", "/api/admin/equipe", {"email": "x@exemple.com", "pseudo": "Xavier", "role": role})
            self.assertEqual(r.status_code, 400, role)
        ok = {"email": "x@exemple.com", "pseudo": "Xavier", "role": "admin"}
        self.assertEqual(sup.sensible("post", "/api/admin/equipe", ok).status_code, 201)
        self.assertEqual(sup.sensible("post", "/api/admin/equipe", ok).status_code, 409)

    def test_modifier_supprimer_reinitialiser(self):
        sup, adm = self.superadmin(), self.creer("adm@exemple.com", "admin")
        adm.connecter()
        ids = {r["email"]: r["id"] for r in self.sql("SELECT id, email FROM utilisateurs")}
        cible = ids["adm@exemple.com"]
        r = sup.sensible("patch", f"/api/admin/equipe/{cible}", {"role": "technique", "charge": "Nouvelle charge"})
        self.assertEqual(r.get_json()["utilisateur"]["role"], "technique")
        self.assertEqual(sup.sensible("patch", f"/api/admin/equipe/{cible}", {"actif": False}).status_code, 200)
        self.assertEqual(adm.req("get", "/api/auth/moi").get_json()["utilisateur"], None)  # sessions fermées
        sup.sensible("patch", f"/api/admin/equipe/{cible}", {"actif": True})
        self.assertEqual(sup.sensible("post", f"/api/admin/equipe/{cible}/reinit-2fa").status_code, 200)
        self.assertEqual(self.sql("SELECT totp_actif FROM utilisateurs WHERE id=?", (cible,))[0][0], 0)
        self.assertEqual(sup.sensible("delete", f"/api/admin/equipe/{cible}").status_code, 200)
        self.assertEqual(self.sql("SELECT COUNT(*) FROM utilisateurs WHERE id=?", (cible,))[0][0], 0)

    def test_protections_du_super_administrateur(self):
        sup = self.superadmin()
        moi = self.sql("SELECT id FROM utilisateurs WHERE email='fondateur@exemple.com'")[0][0]
        self.assertEqual(sup.sensible("delete", f"/api/admin/equipe/{moi}").status_code, 403)
        self.assertEqual(sup.sensible("patch", f"/api/admin/equipe/{moi}", {"role": "admin"}).status_code, 403)
        r = sup.req("delete", "/api/auth/compte", {"mot_de_passe": MDP})
        self.assertEqual((r.status_code, r.get_json()["code"]), (403, "equipe"))  # pas de suppression par l'API de compte
        adm = self.creer("adm@exemple.com", "admin")
        adm.connecter()
        ids = {r["email"]: r["id"] for r in self.sql("SELECT id, email FROM utilisateurs")}
        self.assertEqual(adm.req("delete", f"/api/admin/equipe/{moi}", {"code_totp": adm.code()}).status_code, 403)


class TestBoutique(BaseEquipe):
    def fixer_prix(self, sup, prix_premium=5000, prix_studio=12000):
        ids = [r[0] for r in self.sql("SELECT id FROM produits ORDER BY ordre")]
        for pid, prix in zip(ids, (prix_premium, prix_studio)):
            self.assertEqual(sup.sensible("patch", f"/api/admin/produits/{pid}", {"prix_xaf": prix}).status_code, 200)
        return ids

    def test_prix_reserves_au_super_administrateur(self):
        sup, adm = self.superadmin(), self.creer("adm@exemple.com", "admin")
        adm.connecter()
        pid = self.sql("SELECT id FROM produits ORDER BY ordre")[0][0]
        self.assertEqual(adm.sensible("patch", f"/api/admin/produits/{pid}", {"prix_xaf": 1}).status_code, 403)
        self.assertEqual(sup.req("patch", f"/api/admin/produits/{pid}", {"prix_xaf": 1}).status_code, 403)  # sans code
        self.assertEqual(sup.sensible("patch", f"/api/admin/produits/{pid}", {"prix_xaf": -5}).status_code, 400)
        self.assertEqual(sup.sensible("patch", f"/api/admin/produits/{pid}", {"prix_xaf": 7500}).status_code, 200)
        audit = sup.req("get", "/api/admin/audit?q=prix_modifie").get_json()["evenements"]
        self.assertIn("7500", audit[0]["detail"])
        self.assertEqual(self.req("get", "/api/premium/catalogue").get_json()["produits"][0]["prix_xaf"], 7500)

    def test_catalogue_recherche_filtres_tri(self):
        sup = self.superadmin()
        self.fixer_prix(sup)
        sup.sensible("post", "/api/admin/produits", {"nom": "Outil gratuit", "description": "Un petit utilitaire", "type": "logiciel",
                                                      "categorie": "Logiciels", "prix_xaf": 0})
        tout = self.req("get", "/api/premium/catalogue").get_json()
        self.assertEqual(len(tout["produits"]), 3)
        self.assertIn("Logiciels", tout["categories"])
        self.assertEqual([p["nom"] for p in self.req("get", "/api/premium/catalogue?q=studio").get_json()["produits"]],
                         ["Studio SDK Peginti Pro"])
        self.assertEqual(len(self.req("get", "/api/premium/catalogue?type=logiciel").get_json()["produits"]), 1)
        prix = [p["prix_xaf"] for p in self.req("get", "/api/premium/catalogue?tri=prix_desc").get_json()["produits"]]
        self.assertEqual(prix, sorted(prix, reverse=True))
        self.assertEqual(self.req("get", "/api/premium/produits/999").status_code, 404)
        self.assertIn("similaires", self.req("get", "/api/premium/produits/1").get_json())

    def test_prix_du_panier_viennent_du_serveur(self):
        sup = self.superadmin()
        ids = self.fixer_prix(sup)
        self.assertEqual(self.req("post", "/api/premium/commande", {"lignes": [{"produit_id": ids[0], "quantite": 1}],
                                                                    "mode_paiement": "carte"}).status_code, 401)
        r = self.req("post", "/api/premium/panier", {"lignes": [{"produit_id": ids[0], "quantite": 2, "prix_unitaire": 1},
                                                                {"produit_id": ids[0], "quantite": 1}]})
        corps = r.get_json()
        self.assertEqual((corps["total_xaf"], len(corps["lignes"]), corps["lignes"][0]["quantite"]), (15000, 1, 3))
        for mauvais in ([], [{"produit_id": ids[0], "quantite": 0}], [{"produit_id": ids[0], "quantite": 99}],
                        [{"produit_id": "1", "quantite": 1}], "texte"):
            self.assertEqual(self.req("post", "/api/premium/panier", {"lignes": mauvais}).status_code, 400)

    def test_commande_validation_et_expiration_premium(self):
        sup, adm = self.superadmin(), self.creer("adm@exemple.com", "admin")
        ids = self.fixer_prix(sup)
        adm.connecter()
        client = self.creer("client@exemple.com", "gratuit")
        client.connecter()
        self.assertEqual(client.req("post", "/api/premium/studio", {"message": "aide"}).status_code, 403)
        sans_mode = client.req("post", "/api/premium/commande", {"lignes": [{"produit_id": ids[0], "quantite": 2}]})
        self.assertEqual((sans_mode.status_code, sans_mode.get_json()["code"]), (400, "mode_paiement"))
        r = client.req("post", "/api/premium/commande", {"lignes": [{"produit_id": ids[0], "quantite": 2, "prix_unitaire": 1}],
                                                         "mode_paiement": "orange_money"})
        self.assertEqual(r.status_code, 201)
        c = r.get_json()["commande"]
        self.assertEqual((c["total_xaf"], c["statut"]), (10000, "en_attente"))
        self.assertTrue(c["reference"].startswith("PGT-"))
        self.assertIn("instructions", r.get_json()["paiement"])
        self.assertEqual(adm.req("post", f"/api/admin/commandes/{c['id']}/valider").status_code, 200)
        self.assertEqual(adm.req("post", f"/api/admin/commandes/{c['id']}/valider").status_code, 409)
        moi = client.req("get", "/api/auth/moi").get_json()["utilisateur"]
        self.assertEqual(moi["role"], "premium")
        self.assertAlmostEqual(moi["premium_jusqua"], time.time() + 60 * 86400, delta=120)  # 2 × 30 jours
        self.assertEqual(client.req("post", "/api/premium/studio", {"message": "aide"}).status_code, 200)
        self.sql("UPDATE utilisateurs SET premium_jusqua=? WHERE email='client@exemple.com'", (int(time.time()) - 5,))
        self.assertEqual(client.req("get", "/api/auth/moi").get_json()["utilisateur"]["role"], "gratuit")  # échu
        self.assertEqual(client.req("post", "/api/premium/studio", {"message": "aide"}).status_code, 403)

    def test_commande_gratuite_annulation_et_limite(self):
        sup = self.superadmin()
        sup.sensible("post", "/api/admin/produits", {"nom": "Outil gratuit", "description": "Petit utilitaire", "type": "logiciel",
                                                      "prix_xaf": 0})
        pid = self.sql("SELECT id FROM produits WHERE nom='Outil gratuit'")[0][0]
        ids = self.fixer_prix(sup)
        c = self.creer("client@exemple.com")
        c.connecter()
        r = c.req("post", "/api/premium/commande", {"lignes": [{"produit_id": pid, "quantite": 1}]})
        self.assertEqual(r.get_json()["commande"]["statut"], "validee")  # gratuit : validée d'office
        for _ in range(5):
            self.assertEqual(c.req("post", "/api/premium/commande", {"lignes": [{"produit_id": ids[0], "quantite": 1}],
                                                                     "mode_paiement": "carte"}).status_code, 201)
        r = c.req("post", "/api/premium/commande", {"lignes": [{"produit_id": ids[0], "quantite": 1}], "mode_paiement": "carte"})
        self.assertEqual(r.status_code, 409)  # 5 commandes en attente au maximum
        en_attente = [x for x in c.req("get", "/api/premium/commandes").get_json()["commandes"] if x["statut"] == "en_attente"]
        self.assertEqual(c.req("post", f"/api/premium/commandes/{en_attente[0]['id']}/annuler", {}).status_code, 200)
        self.assertEqual(c.req("post", f"/api/premium/commandes/{en_attente[0]['id']}/annuler", {}).status_code, 409)

    def test_produit_sans_prix_non_commandable(self):
        c = self.creer("client@exemple.com")
        c.connecter()
        pid = self.sql("SELECT id FROM produits ORDER BY ordre")[0][0]
        r = c.req("post", "/api/premium/commande", {"lignes": [{"produit_id": pid, "quantite": 1}], "mode_paiement": "carte"})
        self.assertEqual((r.status_code, r.get_json()["code"]), (400, "indisponible"))
        self.assertFalse(self.req("get", "/api/premium/catalogue").get_json()["produits"][0]["disponible"])


class TestLogiciels(BaseEquipe):
    def televerser(self, sup, pid, publie="1", nom="peginti-237.zip", contenu=b"PK\x03\x04 contenu de test"):
        return sup.c.post("/api/admin/logiciels", content_type="multipart/form-data",
                          headers={"Origin": ORIGINE, "X-CSRF-Token": sup.csrf},
                          data={"produit_id": str(pid), "version": "2.3.7", "plateforme": "termux", "publie": publie,
                                "notes": "Première version", "code_totp": sup.code(),
                                "fichier": (io.BytesIO(contenu), nom)})

    def produit_logiciel(self, sup, prix):
        r = sup.sensible("post", "/api/admin/produits", {"nom": "Peginti IA 237", "description": "Application complète",
                                                          "type": "logiciel", "categorie": "Logiciels", "prix_xaf": prix})
        return r.get_json()["produit"]["id"]

    def test_publication_et_telechargement_payant(self):
        sup, adm = self.superadmin(), self.creer("adm@exemple.com", "admin")
        adm.connecter()
        pid = self.produit_logiciel(sup, 3000)
        self.assertEqual(adm.req("get", "/api/admin/logiciels").status_code, 403)
        r = self.televerser(sup, pid)
        self.assertEqual(r.status_code, 201, r.get_json())
        lid = r.get_json()["logiciel"]["id"]
        sha = r.get_json()["logiciel"]["sha256"]
        self.assertEqual(sha, __import__("hashlib").sha256(b"PK\x03\x04 contenu de test").hexdigest())
        fiche = self.req("get", f"/api/premium/produits/{pid}").get_json()["produit"]
        self.assertEqual((fiche["versions"][0]["version"], fiche["plateformes"]), ("2.3.7", ["termux"]))
        self.assertNotIn("fichier", fiche["versions"][0])  # le nom de stockage n'est jamais exposé
        client = self.creer("client@exemple.com")
        client.connecter()
        r = client.req("get", f"/api/logiciels/{lid}/telecharger")
        self.assertEqual((r.status_code, r.get_json()["code"]), (403, "achat_requis"))
        self.assertEqual(client.req("get", "/api/premium/mes-logiciels").get_json()["logiciels"], [])
        c = client.req("post", "/api/premium/commande", {"lignes": [{"produit_id": pid, "quantite": 1}],
                                                         "mode_paiement": "mtn_momo"}).get_json()["commande"]
        adm.req("post", f"/api/admin/commandes/{c['id']}/valider")
        r = client.req("get", f"/api/logiciels/{lid}/telecharger")
        self.assertEqual(r.status_code, 200)
        self.assertEqual((r.data, r.headers["X-SHA256"]), (b"PK\x03\x04 contenu de test", sha))
        self.assertIn("attachment", r.headers["Content-Disposition"])
        self.assertEqual(len(client.req("get", "/api/premium/mes-logiciels").get_json()["logiciels"]), 1)
        self.assertEqual(self.sql("SELECT telechargements FROM logiciels")[0][0], 1)
        self.assertEqual(self.req("get", f"/api/logiciels/{lid}/telecharger").status_code, 401)

    def test_logiciel_gratuit_non_publie_et_retrait(self):
        sup = self.superadmin()
        pid = self.produit_logiciel(sup, 0)
        lid = self.televerser(sup, pid, publie="0").get_json()["logiciel"]["id"]
        client = self.creer("client@exemple.com")
        client.connecter()
        self.assertEqual(client.req("get", f"/api/logiciels/{lid}/telecharger").status_code, 404)  # pas publié
        self.assertEqual(sup.req("get", f"/api/logiciels/{lid}/telecharger").status_code, 200)  # le super admin vérifie
        self.assertEqual(sup.sensible("patch", f"/api/admin/logiciels/{lid}", {"publie": True}).status_code, 200)
        self.assertEqual(client.req("get", f"/api/logiciels/{lid}/telecharger").status_code, 200)  # gratuit : un compte suffit
        sup.sensible("patch", f"/api/admin/logiciels/{lid}", {"publie": False})
        self.assertEqual(client.req("get", f"/api/logiciels/{lid}/telecharger").status_code, 404)
        stocke = self.sql("SELECT fichier FROM logiciels")[0][0]
        self.assertTrue(os.path.isfile(os.path.join(LOGICIELS, stocke)))
        self.assertEqual(sup.sensible("delete", f"/api/admin/logiciels/{lid}").status_code, 200)
        self.assertFalse(os.path.isfile(os.path.join(LOGICIELS, stocke)))

    def test_refus_de_fichiers_et_champs_invalides(self):
        sup = self.superadmin()
        pid = self.produit_logiciel(sup, 0)
        self.assertEqual(self.televerser(sup, pid, nom="script.php").status_code, 400)
        self.assertEqual(self.televerser(sup, pid, contenu=b"").status_code, 400)
        self.assertEqual(self.televerser(sup, 1).status_code, 400)  # produit qui n'est pas un logiciel
        r = sup.c.post("/api/admin/logiciels", content_type="multipart/form-data",
                       headers={"Origin": ORIGINE, "X-CSRF-Token": sup.csrf},
                       data={"produit_id": str(pid), "version": "1", "plateforme": "termux",
                             "fichier": (io.BytesIO(b"abc"), "a.zip")})  # sans code TOTP
        self.assertEqual(r.status_code, 403)
        self.assertEqual(os.listdir(LOGICIELS).count("script.php"), 0)


class TestActiviteDesChaines(BaseEquipe):
    def test_activite_visible_uniquement_par_le_super_administrateur(self):
        sup, adm = self.superadmin(), self.creer("adm@exemple.com", "admin")
        adm.connecter()
        membre = self.creer("membre@exemple.com")
        membre.connecter()
        secret = "Message très confidentiel du membre"
        self.req("post", "/api/chat", {"message": "Bonjour"})
        membre.req("post", "/api/chat", {"message": secret})
        membre.req("post", "/api/wounanet/rechercher", {"sujet": "énergie solaire"})
        self.req("get", "/api/premium/catalogue")
        t = sup.req("get", "/api/admin/tableau").get_json()
        self.assertEqual(set(t["chaines"]), {"CHAT_INTERACTIF", "WOUNANET", "PREMIUM"})
        self.assertEqual(t["chaines"]["CHAT_INTERACTIF"]["total"], 2)
        self.assertEqual(t["chaines"]["CHAT_INTERACTIF"]["visiteurs_distincts"], 2)  # un visiteur et un membre
        self.assertGreaterEqual(t["chaines"]["WOUNANET"]["par_type"]["requete"], 1)
        self.assertGreaterEqual(t["chaines"]["PREMIUM"]["par_type"]["consultation"], 1)
        self.assertEqual(len(t["courbe"]["jours"]), 7)
        self.assertNotIn(secret, str(t))  # jamais le contenu des messages
        self.assertEqual(self.sql("SELECT COUNT(*) FROM activite WHERE detail LIKE ?", ("%confidentiel%",))[0][0], 0)
        self.assertEqual(adm.req("get", "/api/admin/tableau").status_code, 403)
        self.assertEqual(adm.req("get", "/api/admin/etat").status_code, 200)
        self.assertNotIn("chaines", adm.req("get", "/api/admin/etat").get_json())

    def test_suppression_du_compte_anonymise_l_activite(self):
        membre = self.creer("membre@exemple.com")
        membre.connecter()
        membre.req("post", "/api/chat", {"message": "Bonjour"})
        membre.req("delete", "/api/auth/compte", {"mot_de_passe": MDP})
        self.assertEqual(self.sql("SELECT COUNT(*) FROM activite WHERE utilisateur_id IS NOT NULL")[0][0], 0)
        self.assertEqual(self.sql("SELECT COUNT(*) FROM activite")[0][0], 1)

    def test_purge_par_le_technicien(self):
        tech = self.creer("tec@exemple.com", "technique")
        tech.connecter()
        self.sql("INSERT INTO activite(ts, vitrine, type) VALUES (?,?,?)", (int(time.time()) - 200 * 86400, "CHAT_INTERACTIF", "requete"))
        r = tech.req("post", "/api/admin/maintenance/purger", {})
        self.assertEqual(r.get_json()["supprime"]["activite"], 1)
        self.assertEqual(self.creer("adm@exemple.com", "admin").connecter().status_code, 200)


if __name__ == "__main__":
    unittest.main()
