"""Client Gemini via REST (aucune dépendance) avec rotation automatique entre plusieurs clés.

* Tourniquet : chaque requête démarre sur la clé suivante (la charge se répartit entre les clés).
  GEMINI_STRATEGIE=sequentiel : on garde la 1re clé tant qu'elle fonctionne, les autres servent de relais.
* Quota atteint (429) ou service saturé : la clé est mise en pause (Retry-After, sinon 60 s, puis 5 min,
  puis 1 h si elle échoue encore) et la requête passe immédiatement à la clé suivante.
* Clé refusée (400/401/403) : mise de côté 6 h. Erreur réseau/5xx : pause courte de 20 s.
* Les clés ne sont jamais écrites dans les logs ni dans l'URL (envoyées en en-tête uniquement).
"""
from __future__ import annotations

import json
import logging
import threading
import time
import urllib.error
import urllib.request

log = logging.getLogger("llm")

PAUSE_QUOTA = (60, 300, 3600)   # paliers successifs en cas de 429 répétés
PAUSE_REFUSEE = 6 * 3600
PAUSE_RESEAU = 20
DELAI_APPEL = 15      # secondes par appel Gemini
BUDGET_TOTAL = 70     # secondes max par message, tous essais confondus


class ReserveDeCles:
    def __init__(self):
        self._verrou = threading.Lock()
        self._prochain = 0
        self._pause: dict[str, float] = {}   # clé -> instant de reprise
        self._echecs: dict[str, int] = {}    # clé -> nombre de 429 consécutifs

    def ordre(self, cles: tuple[str, ...], sequentiel: bool) -> list[str]:
        """Clés disponibles, dans l'ordre d'essai."""
        with self._verrou:
            now = time.monotonic()
            if sequentiel:
                base = list(cles)
            else:
                n = len(cles)
                debut = self._prochain % n
                self._prochain = (self._prochain + 1) % n
                base = [cles[(debut + i) % n] for i in range(n)]
            return [k for k in base if self._pause.get(k, 0) <= now]

    def succes(self, cle: str) -> None:
        with self._verrou:
            self._echecs.pop(cle, None)
            self._pause.pop(cle, None)

    def mettre_en_pause(self, cle: str, secondes: float) -> None:
        with self._verrou:
            self._pause[cle] = time.monotonic() + secondes

    def echec_quota(self, cle: str, retry_after: float | None) -> float:
        with self._verrou:
            n = self._echecs.get(cle, 0)
            self._echecs[cle] = n + 1
            s = max(retry_after or 0, PAUSE_QUOTA[min(n, len(PAUSE_QUOTA) - 1)])
            self._pause[cle] = time.monotonic() + s
            return s

    def disponibles(self, cles: tuple[str, ...]) -> int:
        with self._verrou:
            now = time.monotonic()
            return sum(1 for k in cles if self._pause.get(k, 0) <= now)


RESERVE = ReserveDeCles()


def cles_de(cfg) -> tuple[str, ...]:
    return tuple(getattr(cfg, "gemini_keys", ()) or ((cfg.gemini_key,) if cfg.gemini_key else ()))


def etat_moteur(cfg) -> dict:
    cles = cles_de(cfg)
    return {"cles": len(cles), "disponibles": RESERVE.disponibles(cles) if cles else 0}


def modeles_de(cfg) -> list[str]:
    """GEMINI_MODEL accepte une liste séparée par des virgules : chaque modèle sert de relais au précédent
    (utile quand Google retire ou renomme un modèle)."""
    liste = [m.strip() for m in str(cfg.gemini_model).split(",") if m.strip()]
    return liste or ["gemini-flash-latest"]


CAUSE = {"modele_introuvable": False}
DERNIER_OK = {"modele": None}  # le dernier modèle qui a répondu passe en premier (évite d'attendre un modèle saturé)


def _appel(cfg, cle: str, corps: dict, modele: str | None = None) -> str | None:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{modele or modeles_de(cfg)[0]}:generateContent"
    req = urllib.request.Request(url, data=json.dumps(corps).encode("utf-8"), method="POST",
                                 headers={"Content-Type": "application/json", "x-goog-api-key": cle})
    with urllib.request.urlopen(req, timeout=DELAI_APPEL) as r:  # noqa: S310
        data = json.loads(r.read(4 * 1024 * 1024))
    return "".join(p.get("text", "") for p in data["candidates"][0]["content"]["parts"]).strip() or None


def generer(cfg, systeme: str, historique: list[dict], message: str, json_mode: bool = False) -> str | None:
    """Retourne le texte généré, ou None si aucun moteur n'est disponible (toutes les clés épuisées)."""
    cles = cles_de(cfg)
    if not cles:
        return None
    contents = [{"role": "model" if m["role"] == "assistant" else "user",
                 "parts": [{"text": m["contenu"][:2000]}]} for m in historique[-8:]]
    contents.append({"role": "user", "parts": [{"text": message}]})
    corps = {"systemInstruction": {"parts": [{"text": systeme}]}, "contents": contents,
             "generationConfig": {"temperature": 0.6, "maxOutputTokens": 4096}}
    if json_mode:
        corps["generationConfig"]["responseMimeType"] = "application/json"

    sequentiel = getattr(cfg, "gemini_strategie", "tourniquet") == "sequentiel"
    modeles = modeles_de(cfg)
    if DERNIER_OK["modele"] in modeles:
        modeles = [DERNIER_OK["modele"]] + [m for m in modeles if m != DERNIER_OK["modele"]]
    CAUSE["modele_introuvable"] = False
    introuvables = essais = 0
    fin = time.monotonic() + BUDGET_TOTAL
    for cle in RESERVE.ordre(cles, sequentiel):
        num = cles.index(cle) + 1  # on journalise le numéro, jamais la clé
        incident_reseau = False
        for modele in modeles:
            if time.monotonic() > fin:
                CAUSE["modele_introuvable"] = False
                return None
            essais += 1
            try:
                texte = _appel(cfg, cle, corps, modele)
                RESERVE.succes(cle)
                if texte:
                    DERNIER_OK["modele"] = modele
                    return texte
                break  # réponse vide (filtre de sécurité…) : pas la faute de la clé, on passe à la suivante
            except urllib.error.HTTPError as e:
                if e.code == 404:  # modèle inconnu : on essaie le modèle suivant avec la même clé
                    introuvables += 1
                    log.error("Gemini : modèle « %s » introuvable (404) — vérifiez GEMINI_MODEL", modele)
                    continue
                if e.code == 429:
                    try:
                        ra = float(e.headers.get("Retry-After", "") or 0)
                    except ValueError:
                        ra = None
                    s = RESERVE.echec_quota(cle, ra)
                    log.warning("Gemini : clé n°%d épuisée (429), pause %ds, bascule sur la suivante", num, s)
                    break
                if e.code in (400, 401, 403):
                    RESERVE.mettre_en_pause(cle, PAUSE_REFUSEE)
                    log.warning("Gemini : clé n°%d refusée (%d), écartée 6 h", num, e.code)
                    break
                # 500/502/503/504 : modèle surchargé côté Google -> on tente le modèle suivant
                incident_reseau = True
                log.warning("Gemini : modèle « %s » surchargé (HTTP %d) avec la clé n°%d, modèle suivant",
                            modele, e.code, num)
            except Exception as e:  # réseau, délai, JSON invalide : modèle suivant
                incident_reseau = True
                log.warning("Gemini : modèle « %s » sans réponse (%s) avec la clé n°%d, modèle suivant",
                            modele, type(e).__name__, num)
        else:
            if incident_reseau:
                RESERVE.mettre_en_pause(cle, PAUSE_RESEAU)
    CAUSE["modele_introuvable"] = essais > 0 and introuvables == essais
    return None
