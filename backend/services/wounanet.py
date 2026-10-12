"""WOUNANET — service de collecte continue (flux RSS publics + API NewsData optionnelle).

Aucune donnée fictive : si aucune source n'est joignable, la liste est vide et la réponse le dit.
Sécurité : seules des URL fixes https sont interrogées (pas de SSRF), lecture plafonnée à 2 Mo,
contenu nettoyé du HTML, liens limités à http/https.
"""
from __future__ import annotations

import html
import json
import logging
import re
import threading
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

from ..core.bip import normaliser

log = logging.getLogger("wounanet")

FLUX = (
    ("RFI Afrique", "https://www.rfi.fr/fr/afrique/rss"),
    ("Jeune Afrique", "https://www.jeuneafrique.com/feed/"),
    ("Africanews", "https://fr.africanews.com/feed/"),
)
TTL = 300  # secondes
MAX_OCTETS = 2 * 1024 * 1024
UA = "Mozilla/5.0 (compatible; WOUNANET-Bot/4.0; +https://www.pegintichat.online)"


def _nettoyer(s: str | None, maxi: int = 400) -> str:
    s = html.unescape(re.sub(r"<[^>]*>", " ", s or ""))
    return re.sub(r"\s+", " ", s).strip()[:maxi]


def _lien_sur(url: str | None) -> str:
    return url.strip() if url and urllib.parse.urlparse(url.strip()).scheme in ("http", "https") else ""


def _iso(date_txt: str | None) -> str:
    try:
        d = parsedate_to_datetime(date_txt) if date_txt else None
        if d is None:
            d = datetime.fromisoformat(date_txt.replace("Z", "+00:00"))
        if d.tzinfo is None:
            d = d.replace(tzinfo=timezone.utc)
        return d.astimezone(timezone.utc).isoformat()
    except Exception:
        return ""


def _telecharger(url: str, entetes: dict | None = None, timeout: int = 6) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(entetes or {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:  # noqa: S310 (URL fixes https)
        return r.read(MAX_OCTETS)


def analyser_rss(xml_octets: bytes, nom_source: str, maxi: int = 15) -> list[dict]:
    racine = ET.fromstring(xml_octets)
    items = []
    for it in racine.iter("item"):
        titre = _nettoyer(it.findtext("title"), 200)
        if not titre:
            continue
        items.append({"titre": titre, "source": nom_source,
                      "lien": _lien_sur(it.findtext("link")),
                      "date": _iso(it.findtext("pubDate")),
                      "resume": _nettoyer(it.findtext("description"))})
        if len(items) >= maxi:
            break
    return items


class ServiceWounanet:
    def __init__(self, cle_newsdata: str = "") -> None:
        self.cle_newsdata = cle_newsdata
        self._cache: list[dict] = []
        self._ts = 0.0
        self._verrou = threading.Lock()
        self._pilote: threading.Thread | None = None

    # -- collecte --------------------------------------------------------------------------
    def rafraichir(self) -> int:
        collecte: list[dict] = []
        for nom, url in FLUX:
            try:
                collecte += analyser_rss(_telecharger(url), nom)
            except Exception as e:  # une source en panne ne bloque pas les autres
                log.warning("Flux %s indisponible : %s", nom, type(e).__name__)
        collecte.sort(key=lambda x: x["date"], reverse=True)
        with self._verrou:
            if collecte:
                self._cache = collecte
            self._ts = time.time()
        return len(collecte)

    def _newsdata(self, sujet: str) -> list[dict]:
        if not self.cle_newsdata:
            return []
        try:
            q = urllib.parse.urlencode({"apikey": self.cle_newsdata, "q": sujet[:100], "size": 8,
                                        "language": "fr,en"})
            data = json.loads(_telecharger(f"https://newsdata.io/api/1/news?{q}"))
            return [{"titre": _nettoyer(a.get("title"), 200), "source": a.get("source_id") or "NewsData",
                     "lien": _lien_sur(a.get("link")), "date": _iso(a.get("pubDate")),
                     "resume": _nettoyer(a.get("description"))}
                    for a in data.get("results", []) if a.get("title")]
        except Exception as e:
            log.warning("NewsData indisponible : %s", type(e).__name__)
            return []

    # -- interrogation ---------------------------------------------------------------------
    def actualites(self, maxi: int = 12) -> list[dict]:
        if time.time() - self._ts > TTL:
            self.rafraichir()
        with self._verrou:
            return list(self._cache[:maxi])

    def rechercher(self, sujet: str, maxi: int = 8) -> list[dict]:
        jetons = {m for m in normaliser(sujet).split() if len(m) > 3}
        trouves = self._newsdata(sujet)
        base = self.actualites(60)

        def score(a):
            texte = normaliser(a["titre"] + " " + a["resume"])
            return sum(1 for j in jetons if j in texte)

        pertinents = sorted((a for a in base if score(a) > 0), key=score, reverse=True)
        resultat = trouves + [a for a in pertinents if a["lien"] not in {t["lien"] for t in trouves}]
        if not resultat:
            resultat = base[:5]  # aucun recoupement : on donne l'actualité récente, étiquetée par la narration
        return resultat[:maxi]

    # -- pilote continu --------------------------------------------------------------------
    def demarrer_pilote(self, intervalle: int = TTL) -> None:
        if self._pilote and self._pilote.is_alive():
            return

        def boucle():
            time.sleep(2)
            while True:
                try:
                    self.rafraichir()
                except Exception:
                    log.exception("Balayage Wounanet")
                time.sleep(intervalle)

        self._pilote = threading.Thread(target=boucle, name="wounanet-pilote", daemon=True)
        self._pilote.start()

    def etat(self) -> dict:
        with self._verrou:
            return {"depeches_en_cache": len(self._cache),
                    "dernier_balayage": datetime.fromtimestamp(self._ts, timezone.utc).isoformat()
                    if self._ts else None,
                    "sources_configurees": len(FLUX) + (1 if self.cle_newsdata else 0)}
