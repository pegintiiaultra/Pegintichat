"""Rôles de l'équipe TOMTECH.INC et permissions : le seul endroit où se définissent les limites d'autorisation.

Un rôle n'a que les permissions listées ici. Aucun rôle d'équipe, hors super administrateur, ne voit l'activité
des vitrines ni les comptes de l'équipe.
"""
from __future__ import annotations

ROLES_EQUIPE = ("technique", "admin", "superadmin")
ROLES_AVEC_STUDIO = ("premium", "technique", "admin", "superadmin")

PERMISSIONS: dict[str, frozenset] = {
    "superadmin": frozenset({
        "activite.toutes", "audit.tout", "audit.propre",
        "staff.gerer", "catalogue.lire", "catalogue.gerer", "catalogue.prix",
        "logiciels.publier", "parametres.paiement",
        "utilisateurs.lire", "utilisateurs.moderer", "utilisateurs.premium",
        "commandes.lire", "commandes.valider",
        "systeme.etat", "systeme.maintenance",
    }),
    "admin": frozenset({
        "audit.propre", "catalogue.lire",
        "utilisateurs.lire", "utilisateurs.moderer", "utilisateurs.premium",
        "commandes.lire", "commandes.valider",
        "systeme.etat",
    }),
    "technique": frozenset({
        "audit.propre", "systeme.etat", "systeme.maintenance",
    }),
}

DESCRIPTIONS = {
    "superadmin": {
        "nom": "Super administrateur",
        "charge": "Administration générale de la plateforme.",
        "peut": ["Voir l'activité de toutes les chaînes (chat, Wounanet, premium)",
                 "Créer, modifier et supprimer les comptes administrateur et technique",
                 "Modifier les prix, le catalogue et les instructions de paiement",
                 "Publier et retirer les logiciels Peginti",
                 "Consulter le journal d'audit complet",
                 "Tout ce que font les administrateurs et les techniciens"],
        "ne_peut_pas": ["Être supprimé ou rétrogradé depuis la plateforme (terminal uniquement)"],
    },
    "admin": {
        "nom": "Administrateur",
        "charge": "Gestion des utilisateurs et des commandes.",
        "peut": ["Lister les utilisateurs, les activer, les désactiver, les débloquer",
                 "Accorder ou retirer l'accès premium",
                 "Valider ou refuser les commandes",
                 "Consulter l'état du système et le catalogue (lecture)"],
        "ne_peut_pas": ["Modifier les prix ou le catalogue", "Publier des logiciels",
                        "Gérer les comptes de l'équipe", "Voir l'activité des chaînes",
                        "Agir sur un compte de l'équipe"],
    },
    "technique": {
        "nom": "Technicien",
        "charge": "Exploitation technique de la plateforme.",
        "peut": ["Consulter l'état du système", "Lancer la purge des données périmées",
                 "Relancer la collecte Wounanet"],
        "ne_peut_pas": ["Voir les utilisateurs, les commandes ou l'activité", "Modifier prix ou catalogue",
                        "Publier des logiciels", "Gérer les comptes"],
    },
}


def permissions_de(role: str) -> frozenset:
    return PERMISSIONS.get(role, frozenset())


def a_permission(role: str, permission: str) -> bool:
    return permission in permissions_de(role)


def est_equipe(role: str) -> bool:
    return role in ROLES_EQUIPE


def double_auth_obligatoire(user: dict, domaine_equipe: str = "") -> bool:
    """Obligatoire pour tout compte de l'équipe, et pour toute adresse du domaine de l'équipe."""
    if est_equipe(user.get("role", "")):
        return True
    d = (domaine_equipe or "").lower().lstrip("@")
    return bool(d) and (user.get("email", "").lower().endswith("@" + d))


def role_effectif(role: str, premium_jusqua: int | None, maintenant: int) -> str:
    """Un abonnement premium arrivé à échéance revient au rôle gratuit (sans date : accordé à la main, sans fin)."""
    if role == "premium" and premium_jusqua and premium_jusqua < maintenant:
        return "gratuit"
    return role
