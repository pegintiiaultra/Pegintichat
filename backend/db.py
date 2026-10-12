"""Base de données SQLite (bibliothèque standard) : schéma, migrations, paramètres."""
from __future__ import annotations

import os
import secrets
import sqlite3
import time
from pathlib import Path

from flask import current_app, g

ROLES = ("gratuit", "premium", "technique", "admin", "superadmin")

# Colonnes de la table des utilisateurs, dans l'ordre : sert à la migration depuis l'ancien schéma.
COLONNES_UTILISATEURS = (
    "id", "email", "pseudo", "mdp_hash", "role", "email_verifie", "actif", "echecs", "verrou_jusqua",
    "totp_secret", "totp_actif", "totp_dernier_pas", "cree_le", "derniere_connexion",
)


def _ddl_utilisateurs(nom: str) -> str:
    roles = ",".join(f"'{r}'" for r in ROLES)
    return f"""
CREATE TABLE IF NOT EXISTS {nom} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  pseudo TEXT NOT NULL,
  mdp_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'gratuit' CHECK (role IN ({roles})),
  charge TEXT,
  cree_par INTEGER,
  premium_jusqua INTEGER,
  email_verifie INTEGER NOT NULL DEFAULT 0,
  actif INTEGER NOT NULL DEFAULT 1,
  echecs INTEGER NOT NULL DEFAULT 0,
  verrou_jusqua INTEGER NOT NULL DEFAULT 0,
  totp_secret TEXT,
  totp_actif INTEGER NOT NULL DEFAULT 0,
  totp_dernier_pas INTEGER NOT NULL DEFAULT 0,
  cree_le INTEGER NOT NULL,
  derniere_connexion INTEGER
);"""


SCHEMA = _ddl_utilisateurs("utilisateurs") + """
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  jeton_hash TEXT NOT NULL UNIQUE,
  csrf TEXT NOT NULL,
  cree_le INTEGER NOT NULL,
  expire_le INTEGER NOT NULL,
  derniere_activite INTEGER NOT NULL,
  ip TEXT,
  agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(utilisateur_id);
CREATE TABLE IF NOT EXISTS jetons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('verif_email','reset_mdp')),
  jeton_hash TEXT NOT NULL UNIQUE,
  expire_le INTEGER NOT NULL,
  utilise INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS codes_secours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL UNIQUE,
  utilise INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  utilisateur_id INTEGER,
  evenement TEXT NOT NULL,
  ip TEXT,
  detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit(utilisateur_id, id);
CREATE TABLE IF NOT EXISTS activite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  vitrine TEXT NOT NULL,
  type TEXT NOT NULL,
  utilisateur_id INTEGER,
  anonyme TEXT,
  intention TEXT,
  mode TEXT,
  detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_activite_ts ON activite(ts);
CREATE INDEX IF NOT EXISTS idx_activite_v ON activite(vitrine, ts);
CREATE TABLE IF NOT EXISTS memoire (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  vitrine TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  contenu TEXT NOT NULL,
  ts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_memoire ON memoire(utilisateur_id, vitrine, id);
CREATE TABLE IF NOT EXISTS produits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  categorie TEXT NOT NULL DEFAULT 'Services',
  type TEXT NOT NULL DEFAULT 'service',
  duree_jours INTEGER,
  prix_xaf INTEGER,
  image TEXT,
  ordre INTEGER NOT NULL DEFAULT 100,
  actif INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS commandes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  reference TEXT UNIQUE,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente','validee','refusee','annulee')),
  total_xaf INTEGER NOT NULL DEFAULT 0,
  mode_paiement TEXT,
  note TEXT,
  cree_le INTEGER NOT NULL,
  traite_par INTEGER,
  traite_le INTEGER
);
CREATE INDEX IF NOT EXISTS idx_commandes_user ON commandes(utilisateur_id, id);
CREATE TABLE IF NOT EXISTS commande_lignes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  commande_id INTEGER NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
  produit_id INTEGER NOT NULL REFERENCES produits(id),
  nom TEXT NOT NULL,
  quantite INTEGER NOT NULL,
  prix_unitaire INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS logiciels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produit_id INTEGER NOT NULL REFERENCES produits(id),
  version TEXT NOT NULL,
  plateforme TEXT NOT NULL,
  fichier TEXT NOT NULL,
  nom_original TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  taille INTEGER NOT NULL,
  notes TEXT,
  publie INTEGER NOT NULL DEFAULT 0,
  publie_par INTEGER,
  cree_le INTEGER NOT NULL,
  publie_le INTEGER,
  telechargements INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS parametres (
  cle TEXT PRIMARY KEY,
  valeur TEXT NOT NULL,
  modifie_par INTEGER,
  modifie_le INTEGER
);
"""

# nom, description, détails, catégorie, type, durée (jours), ordre. Les prix sont fixés par le super administrateur.
PRODUITS_INITIAUX = [
    ("Accès Premium PEGINTI",
     "Accès à la vitrine premium et à l'assistance développeur avancée.",
     "Donne le rôle premium pour la durée choisie. Chaque unité commandée ajoute une période de 30 jours.",
     "Abonnements", "abonnement", 30, 10),
    ("Studio SDK Peginti Pro",
     "Assistant de construction et de mise en ligne d'applications pour développeurs.",
     "Studio conversationnel pour concevoir, structurer et préparer le déploiement de vos applications. "
     "Chaque unité commandée ajoute une période de 30 jours.",
     "Studio développeur", "abonnement", 30, 20),
]

PARAMETRES_INITIAUX = {
    "paiement_instructions": "Les instructions de paiement seront communiquées par TOMTECH.INC après l'enregistrement "
                             "de votre commande. Conservez la référence de commande.",
}


# --------------------------------------------------------------------------- accès
def get_db() -> sqlite3.Connection:
    if "db" not in g:
        conn = sqlite3.connect(current_app.config["PEGINTI"].db_path, timeout=15)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys=ON")
        conn.execute("PRAGMA journal_mode=WAL")
        g.db = conn
    return g.db


def fermer_db(_exc=None) -> None:
    conn = g.pop("db", None)
    if conn is not None:
        conn.close()


def maintenant() -> int:
    return int(time.time())


def reference_commande(cid: int) -> str:
    return f"PGT-{cid:06d}-{secrets.token_hex(2).upper()}"


def parametre(cle: str, defaut: str = "") -> str:
    r = get_db().execute("SELECT valeur FROM parametres WHERE cle=?", (cle,)).fetchone()
    return r["valeur"] if r else defaut


def definir_parametre(cle: str, valeur: str, par: int | None) -> None:
    db = get_db()
    db.execute("INSERT INTO parametres(cle, valeur, modifie_par, modifie_le) VALUES (?,?,?,?) "
               "ON CONFLICT(cle) DO UPDATE SET valeur=excluded.valeur, modifie_par=excluded.modifie_par, "
               "modifie_le=excluded.modifie_le", (cle, valeur, par, maintenant()))
    db.commit()


# --------------------------------------------------------------------------- migrations
def _table_existe(conn, nom: str) -> bool:
    return conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (nom,)).fetchone() is not None


def _colonnes(conn, table: str) -> set[str]:
    return {r[1] for r in conn.execute(f"PRAGMA table_info({table})")}


def _migrer_avant(chemin: str) -> None:
    """Adapte une base créée par une version précédente (rôles étendus, commandes à lignes, produits)."""
    conn = sqlite3.connect(chemin, timeout=15, isolation_level=None)
    try:
        conn.execute("PRAGMA foreign_keys=OFF")  # indispensable pour reconstruire une table parente
        if _table_existe(conn, "utilisateurs"):
            ddl = conn.execute("SELECT sql FROM sqlite_master WHERE name='utilisateurs'").fetchone()[0]
            if "superadmin" not in ddl:
                communes = [c for c in COLONNES_UTILISATEURS if c in _colonnes(conn, "utilisateurs")]
                cols = ", ".join(communes)
                conn.execute("BEGIN")
                conn.execute(_ddl_utilisateurs("utilisateurs_nouvelle"))
                conn.execute(f"INSERT INTO utilisateurs_nouvelle ({cols}) SELECT {cols} FROM utilisateurs")
                conn.execute("DROP TABLE utilisateurs")
                conn.execute("ALTER TABLE utilisateurs_nouvelle RENAME TO utilisateurs")
                conn.execute("COMMIT")
        if _table_existe(conn, "commandes") and "produit_id" in _colonnes(conn, "commandes"):
            conn.execute("ALTER TABLE commandes RENAME TO commandes_ancienne")
        if _table_existe(conn, "produits"):
            ajouts = {"details": "TEXT", "categorie": "TEXT NOT NULL DEFAULT 'Services'",
                      "type": "TEXT NOT NULL DEFAULT 'service'", "duree_jours": "INTEGER", "image": "TEXT",
                      "ordre": "INTEGER NOT NULL DEFAULT 100"}
            existantes = _colonnes(conn, "produits")
            for col, ddl_col in ajouts.items():
                if col not in existantes:
                    conn.execute(f"ALTER TABLE produits ADD COLUMN {col} {ddl_col}")
    finally:
        conn.close()


def _migrer_apres(db: sqlite3.Connection) -> None:
    if _table_existe(db, "commandes_ancienne"):
        lignes = db.execute(
            "SELECT c.utilisateur_id, c.produit_id, c.statut, c.cree_le, p.nom, p.prix_xaf "
            "FROM commandes_ancienne c LEFT JOIN produits p ON p.id=c.produit_id").fetchall()
        for r in lignes:
            prix = r["prix_xaf"] or 0
            cur = db.execute("INSERT INTO commandes(utilisateur_id, statut, total_xaf, cree_le) VALUES (?,?,?,?)",
                             (r["utilisateur_id"], r["statut"], prix, r["cree_le"]))
            cid = cur.lastrowid
            db.execute("UPDATE commandes SET reference=? WHERE id=?", (reference_commande(cid), cid))
            if r["produit_id"]:
                db.execute("INSERT INTO commande_lignes(commande_id, produit_id, nom, quantite, prix_unitaire) "
                           "VALUES (?,?,?,?,?)", (cid, r["produit_id"], r["nom"] or "Produit", 1, prix))
        db.execute("DROP TABLE commandes_ancienne")
    for nom, desc, details, cat, typ, duree, ordre in PRODUITS_INITIAUX:  # produits de l'ancienne version
        db.execute("UPDATE produits SET details=?, categorie=?, type=?, duree_jours=?, ordre=? "
                   "WHERE nom=? AND type='service' AND details IS NULL", (details, cat, typ, duree, ordre, nom))


def init_app(app) -> None:
    app.teardown_appcontext(fermer_db)
    chemin = Path(app.config["PEGINTI"].db_path)
    chemin.parent.mkdir(parents=True, exist_ok=True)
    try:
        os.chmod(chemin.parent, 0o700)
    except OSError:
        pass
    _migrer_avant(str(chemin))
    with app.app_context():
        db = get_db()
        db.executescript(SCHEMA)
        _migrer_apres(db)
        if db.execute("SELECT COUNT(*) FROM produits").fetchone()[0] == 0:
            db.executemany("INSERT INTO produits(nom, description, details, categorie, type, duree_jours, ordre) "
                           "VALUES (?,?,?,?,?,?,?)", PRODUITS_INITIAUX)
        for cle, valeur in PARAMETRES_INITIAUX.items():
            db.execute("INSERT OR IGNORE INTO parametres(cle, valeur) VALUES (?,?)", (cle, valeur))
        db.commit()
    try:
        os.chmod(chemin, 0o600)
    except OSError:
        pass
