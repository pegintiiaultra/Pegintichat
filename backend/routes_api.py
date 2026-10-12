"""Routes métier : santé, chat public, Wounanet, vitrine premium."""
from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint, current_app, g, jsonify, request

from . import activite, permissions as perm
from .commun import ErreurAPI, cfg, corps_json, exiger_connexion, ip_client, limiter, texte
from .config import VERSION
from .core import memoire, orchestrateur

bp = Blueprint("api", __name__, url_prefix="/api")

VITRINES_HISTORIQUE = ("CHAT_INTERACTIF", "WOUNANET", "PREMIUM")


@bp.get("/sante")
def sante():
    # Volontairement minimal : aucune information interne n'est divulguée.
    return jsonify({"statut": "EN_LIGNE", "plateforme": "PEGINTI IA", "version": VERSION,
                    "horodatage": datetime.now(timezone.utc).isoformat()})


# --------------------------------------------------------------------------- chat interactif (public)
@bp.post("/chat")
def chat():
    d = corps_json()
    message = texte(d, "message", 4000, 1)
    # Chat libre et gratuit : AUCUN quota de messages. Seule une garde anti-rafale (robots) subsiste :
    # 30 requêtes par 10 s par client, inatteignable à la main. CHAT_ANTIFLOOD=0 la supprime.
    if cfg().chat_antiflood > 0:
        limiter(f"chat:{'u' + str(g.user['id']) if g.user else 'ip' + ip_client()}", cfg().chat_antiflood, 10)
    rep = orchestrateur.traiter(message, "CHAT_INTERACTIF", g.user, d.get("historique"))
    return jsonify(rep)


@bp.get("/historique")
@exiger_connexion()
def historique():
    vitrine = request.args.get("vitrine", "CHAT_INTERACTIF")
    if vitrine not in VITRINES_HISTORIQUE:
        raise ErreurAPI("Vitrine inconnue.", 400)
    return jsonify({"messages": memoire.contexte(g.user["id"], vitrine, 30)})


@bp.delete("/historique")
@exiger_connexion()
def effacer_historique():
    vitrine = request.args.get("vitrine", "CHAT_INTERACTIF")
    if vitrine not in VITRINES_HISTORIQUE:
        raise ErreurAPI("Vitrine inconnue.", 400)
    memoire.effacer(g.user["id"], vitrine)
    return jsonify({"message": "Historique effacé."})


# --------------------------------------------------------------------------- wounanet (compte requis)
@bp.get("/wounanet/actualites")
def wounanet_actualites():
    # Fil de dépêches en lecture publique (données en cache, aucun coût de moteur).
    limiter(f"wou:act:{ip_client()}", 60, 60)
    svc = current_app.extensions["wounanet"]
    activite.enregistrer("WOUNANET", "consultation", g.user, detail="fil des dépêches")
    return jsonify({"depeches": svc.actualites(12), "etat": svc.etat()})


@bp.post("/wounanet/rechercher")
@exiger_connexion()
def wounanet_rechercher():
    limiter(f"wou:{g.user['id']}", 30, 600)
    sujet = texte(corps_json(), "sujet", 300, 2)
    return jsonify(orchestrateur.traiter(sujet, "WOUNANET", g.user))


# --------------------------------------------------------------------------- studio premium
@bp.post("/premium/studio")
@exiger_connexion(*perm.ROLES_AVEC_STUDIO)
def studio():
    limiter(f"studio:{g.user['id']}", 40, 600)
    message = texte(corps_json(), "message", 8000, 1)
    return jsonify(orchestrateur.traiter(message, "PREMIUM", g.user))
