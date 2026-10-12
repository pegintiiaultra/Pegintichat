"""Envoi d'e-mails (SMTP). Sans SMTP configuré, le message est écrit dans le journal serveur (mode dev)."""
from __future__ import annotations

import smtplib
import ssl
from email.message import EmailMessage

from flask import current_app


def envoyer(destinataire: str, sujet: str, corps: str) -> bool:
    smtp = current_app.config["PEGINTI"].smtp
    if not smtp["hote"]:
        current_app.logger.warning("SMTP non configuré — message pour %s : %s\n%s",
                                   destinataire, sujet, corps)
        return False
    msg = EmailMessage()
    msg["From"], msg["To"], msg["Subject"] = smtp["expediteur"], destinataire, sujet
    msg.set_content(corps)
    try:
        ctx = ssl.create_default_context()
        if smtp["port"] == 465:
            with smtplib.SMTP_SSL(smtp["hote"], 465, context=ctx, timeout=15) as s:
                if smtp["utilisateur"]:
                    s.login(smtp["utilisateur"], smtp["mot_de_passe"])
                s.send_message(msg)
        else:
            with smtplib.SMTP(smtp["hote"], smtp["port"], timeout=15) as s:
                s.starttls(context=ctx)
                if smtp["utilisateur"]:
                    s.login(smtp["utilisateur"], smtp["mot_de_passe"])
                s.send_message(msg)
        return True
    except Exception:
        current_app.logger.exception("Échec d'envoi SMTP")
        return False
