"""Client Gemini via REST (aucune dépendance). La clé est envoyée en en-tête, jamais dans l'URL."""
from __future__ import annotations

import json
import logging
import urllib.request

log = logging.getLogger("llm")


def generer(cfg, systeme: str, historique: list[dict], message: str, json_mode: bool = False) -> str | None:
    """Retourne le texte généré, ou None si le moteur est absent/indisponible."""
    if not cfg.gemini_key:
        return None
    contents = [{"role": "model" if m["role"] == "assistant" else "user",
                 "parts": [{"text": m["contenu"][:2000]}]} for m in historique[-8:]]
    contents.append({"role": "user", "parts": [{"text": message}]})
    corps = {"systemInstruction": {"parts": [{"text": systeme}]}, "contents": contents,
             "generationConfig": {"temperature": 0.6, "maxOutputTokens": 4096}}
    if json_mode:
        corps["generationConfig"]["responseMimeType"] = "application/json"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{cfg.gemini_model}:generateContent"
    req = urllib.request.Request(url, data=json.dumps(corps).encode("utf-8"), method="POST",
                                 headers={"Content-Type": "application/json",
                                          "x-goog-api-key": cfg.gemini_key})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:  # noqa: S310
            data = json.loads(r.read(4 * 1024 * 1024))
        return "".join(p.get("text", "") for p in data["candidates"][0]["content"]["parts"]).strip() or None
    except Exception as e:
        log.warning("Gemini indisponible : %s", type(e).__name__)  # jamais l'URL/clé dans les logs
        return None
