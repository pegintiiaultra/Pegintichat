#!/usr/bin/env python3
"""Administration en ligne de commande (Termux) : comptes, rôles, commandes, produits.

Exemples :
  python manage.py creer-superadmin vous@tomtech.inc MonPseudo   # fondateur (le seul créable ici)
  python manage.py creer-admin vous@exemple.com MonPseudo
  python manage.py reinit-2fa vous@tomtech.inc   # perte de téléphone ET de codes de secours
  python manage.py lister
  python manage.py role vous@exemple.com premium
  python manage.py commandes
  python manage.py valider-commande 3        # donne le rôle premium à l'acheteur
"""
import argparse
import getpass
import sys
import time

from backend import security as sec
from backend.app import create_app
from backend.db import get_db


def _u(db, email):
    u = db.execute("SELECT * FROM utilisateurs WHERE email=?", (sec.normaliser_email(email),)).fetchone()
    if not u:
        sys.exit(f"Utilisateur introuvable : {email}")
    return u


def db_existe(email):
    return get_db().execute("SELECT 1 FROM utilisateurs WHERE email=?", (email,)).fetchone() is not None


def creer(args, role):
    cfg = args.app.config["PEGINTI"]
    email = sec.normaliser_email(args.email)
    if not sec.email_valide(email) or not sec.pseudo_valide(args.pseudo):
        sys.exit("E-mail ou pseudo invalide.")
    mdp = getpass.getpass("Mot de passe : ")
    if mdp != getpass.getpass("Confirmer : "):
        sys.exit("Les mots de passe diffèrent.")
    erreurs = sec.verifier_politique_mdp(mdp, email, args.pseudo)
    if erreurs:
        sys.exit("Mot de passe refusé : " + " ".join(erreurs))
    db = get_db()
    if db_existe(email):
        sys.exit("Cette adresse existe déjà.")
    from backend import permissions as perm
    charge = perm.DESCRIPTIONS[role]["charge"] if role in perm.DESCRIPTIONS else None
    db.execute("INSERT INTO utilisateurs(email, pseudo, mdp_hash, role, email_verifie, charge, cree_le) VALUES (?,?,?,?,1,?,?)",
               (email, args.pseudo.strip(), sec.hasher_mot_de_passe(mdp, cfg.pepper), role, charge, int(time.time())))
    db.commit()
    print(f"Compte {role} créé : {email}")
    if role in ("superadmin", "admin", "technique"):
        print("La double authentification (application TOTP) sera exigée à la première connexion.")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="cmd", required=True)
    for nom in ("creer-superadmin", "creer-admin", "creer-technique", "creer-utilisateur"):
        c = s.add_parser(nom)
        c.add_argument("email")
        c.add_argument("pseudo")
    c = s.add_parser("role")
    c.add_argument("email")
    c.add_argument("role", choices=["gratuit", "premium", "technique", "admin"])
    for nom in ("verifier", "debloquer", "desactiver", "activer", "reinit-2fa"):
        s.add_parser(nom).add_argument("email")
    s.add_parser("lister")
    s.add_parser("commandes")
    c = s.add_parser("valider-commande")
    c.add_argument("id", type=int)
    c = s.add_parser("refuser-commande")
    c.add_argument("id", type=int)
    c = s.add_parser("produit")
    c.add_argument("nom")
    c.add_argument("description")
    c.add_argument("--prix", type=int, help="prix en FCFA")
    s.add_parser("audit")
    s.add_parser("purger")
    args = p.parse_args()

    args.app = create_app()
    with args.app.app_context():
        db = get_db()
        if args.cmd == "creer-superadmin":
            if db.execute("SELECT 1 FROM utilisateurs WHERE role='superadmin'").fetchone():
                sys.exit("Un super administrateur existe déjà. Utilisez « role » pour en changer (terminal uniquement).")
            creer(args, "superadmin")
        elif args.cmd == "creer-admin":
            creer(args, "admin")
        elif args.cmd == "creer-technique":
            creer(args, "technique")
        elif args.cmd == "reinit-2fa":
            u = _u(db, args.email)
            db.execute("UPDATE utilisateurs SET totp_actif=0, totp_secret=NULL, totp_dernier_pas=0 WHERE id=?", (u["id"],))
            db.execute("DELETE FROM codes_secours WHERE utilisateur_id=?", (u["id"],))
            db.execute("DELETE FROM sessions WHERE utilisateur_id=?", (u["id"],))
            db.commit()
            print("2FA réinitialisée, sessions fermées. Elle sera à réactiver à la prochaine connexion.")
        elif args.cmd == "creer-utilisateur":
            creer(args, "gratuit")
        elif args.cmd == "role":
            u = _u(db, args.email)
            db.execute("UPDATE utilisateurs SET role=? WHERE id=?", (args.role, u["id"]))
            db.commit()
            print(f"{u['email']} → {args.role}")
        elif args.cmd == "verifier":
            u = _u(db, args.email)
            db.execute("UPDATE utilisateurs SET email_verifie=1 WHERE id=?", (u["id"],))
            db.commit()
            print("E-mail marqué comme vérifié.")
        elif args.cmd == "debloquer":
            u = _u(db, args.email)
            db.execute("UPDATE utilisateurs SET echecs=0, verrou_jusqua=0 WHERE id=?", (u["id"],))
            db.commit()
            print("Compte débloqué.")
        elif args.cmd in ("desactiver", "activer"):
            u = _u(db, args.email)
            actif = 1 if args.cmd == "activer" else 0
            db.execute("UPDATE utilisateurs SET actif=? WHERE id=?", (actif, u["id"]))
            if not actif:
                db.execute("DELETE FROM sessions WHERE utilisateur_id=?", (u["id"],))
            db.commit()
            print("Compte " + ("activé." if actif else "désactivé, sessions fermées."))
        elif args.cmd == "lister":
            for u in db.execute("SELECT * FROM utilisateurs ORDER BY id"):
                print(f"{u['id']:>4}  {u['email']:<34} {u['pseudo']:<18} {u['role']:<8} "
                      f"vérifié={u['email_verifie']} actif={u['actif']} 2fa={u['totp_actif']}")
        elif args.cmd == "commandes":
            for c in db.execute("SELECT c.id, c.reference, c.total_xaf, u.email, c.statut FROM commandes c "
                                "JOIN utilisateurs u ON u.id=c.utilisateur_id ORDER BY c.id DESC LIMIT 50"):
                print(f"#{c['id']:<4} {c['reference'] or '':<14} {c['statut']:<11} {c['total_xaf']:>8} FCFA  {c['email']}")
        elif args.cmd in ("valider-commande", "refuser-commande"):
            c = db.execute("SELECT * FROM commandes WHERE id=?", (args.id,)).fetchone()
            if not c:
                sys.exit("Commande introuvable.")
            ok = args.cmd == "valider-commande"
            if c["statut"] != "en_attente":
                sys.exit("Commande déjà traitée.")
            db.execute("UPDATE commandes SET statut=?, traite_le=? WHERE id=?",
                       ("validee" if ok else "refusee", int(time.time()), c["id"]))
            if ok:
                from backend.boutique import appliquer_effets
                appliquer_effets(db, c["id"])
            db.commit()
            print("Commande validée : accès accordé." if ok else "Commande refusée.")
        elif args.cmd == "produit":
            db.execute("INSERT INTO produits(nom, description, prix_xaf, categorie, type) VALUES (?,?,?,'Services','service')",
                       (args.nom, args.description, args.prix))
            db.commit()
            print("Produit ajouté.")
        elif args.cmd == "purger":
            now = int(time.time())
            a = db.execute("DELETE FROM audit WHERE ts < ?", (now - 365 * 86400,)).rowcount
            s_ = db.execute("DELETE FROM sessions WHERE expire_le < ?", (now,)).rowcount
            j = db.execute("DELETE FROM jetons WHERE expire_le < ? OR utilise=1", (now,)).rowcount
            v = db.execute("DELETE FROM activite WHERE ts < ?", (now - 90 * 86400,)).rowcount
            db.commit()
            print(f"Purge : {a} audit (>12 mois), {v} activité (>90 j), {s_} sessions, {j} jetons.")
        elif args.cmd == "audit":
            for a in db.execute("SELECT * FROM audit ORDER BY id DESC LIMIT 40"):
                print(time.strftime("%d/%m %H:%M:%S", time.localtime(a["ts"])), a["evenement"],
                      a["utilisateur_id"] or "-", a["ip"], a["detail"] or "")


if __name__ == "__main__":
    main()
