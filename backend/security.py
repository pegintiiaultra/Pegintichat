"""Primitives de sécurité (bibliothèque standard uniquement : compatible Termux sans compilation)."""
from __future__ import annotations

import base64
import hashlib
import hmac
import re
import secrets
import struct
import threading
import time
from collections import deque

# --------------------------------------------------------------------------- mots de passe
SCRYPT_N, SCRYPT_R, SCRYPT_P, DKLEN = 2**14, 8, 1, 32


def _b64(b: bytes) -> str:
    return base64.b64encode(b).decode("ascii")


def _prehash(pepper: bytes, mot_de_passe: str) -> bytes:
    # Le "poivre" (secret serveur hors base) rend un vol de base seule inexploitable.
    return hmac.new(pepper, mot_de_passe.encode("utf-8"), hashlib.sha256).digest()


def hasher_mot_de_passe(mot_de_passe: str, pepper: bytes) -> str:
    sel = secrets.token_bytes(16)
    h = hashlib.scrypt(_prehash(pepper, mot_de_passe), salt=sel, n=SCRYPT_N, r=SCRYPT_R,
                       p=SCRYPT_P, dklen=DKLEN, maxmem=64 * 1024 * 1024)
    return f"scrypt${SCRYPT_N}${SCRYPT_R}${SCRYPT_P}${_b64(sel)}${_b64(h)}"


def verifier_mot_de_passe(mot_de_passe: str, stocke: str, pepper: bytes) -> bool:
    try:
        algo, n, r, p, sel, attendu = stocke.split("$")
        if algo != "scrypt":
            return False
        h = hashlib.scrypt(_prehash(pepper, mot_de_passe), salt=base64.b64decode(sel), n=int(n),
                           r=int(r), p=int(p), dklen=DKLEN, maxmem=64 * 1024 * 1024)
        return hmac.compare_digest(h, base64.b64decode(attendu))
    except Exception:
        return False


_FAUX_HASH: dict[bytes, str] = {}


def faux_hash(pepper: bytes) -> str:
    """Hash factice : égalise le temps de réponse quand le compte n'existe pas (anti-énumération)."""
    if pepper not in _FAUX_HASH:
        _FAUX_HASH[pepper] = hasher_mot_de_passe(secrets.token_hex(8), pepper)
    return _FAUX_HASH[pepper]


_COMMUNS = ("password", "motdepasse", "azerty", "qwerty", "123456", "abcdef", "peginti",
            "tomtech", "admin", "letmein", "welcome", "bonjour")


def verifier_politique_mdp(mdp: str, email: str = "", pseudo: str = "") -> list[str]:
    erreurs: list[str] = []
    if not isinstance(mdp, str):
        return ["Mot de passe invalide."]
    if len(mdp) < 12:
        erreurs.append("12 caractères minimum.")
    if len(mdp) > 128:
        erreurs.append("128 caractères maximum.")
    classes = sum([bool(re.search(r"[a-z]", mdp)), bool(re.search(r"[A-Z]", mdp)),
                   bool(re.search(r"\d", mdp)), bool(re.search(r"[^\w\s]|_", mdp))])
    if classes < 3:
        erreurs.append("Mélangez au moins 3 types : minuscules, majuscules, chiffres, symboles.")
    bas = re.sub(r"[^a-z0-9]", "", mdp.lower())
    if any(c in bas for c in _COMMUNS):
        erreurs.append("Mot de passe trop courant ou lié au service.")
    if re.search(r"(.)\1{3,}", mdp):
        erreurs.append("Évitez de répéter 4 fois le même caractère.")
    local = (email or "").split("@")[0].lower()
    if len(local) >= 3 and local in mdp.lower():
        erreurs.append("Ne réutilisez pas votre adresse e-mail.")
    if pseudo and len(pseudo) >= 3 and pseudo.lower() in mdp.lower():
        erreurs.append("Ne réutilisez pas votre pseudo.")
    return erreurs


_EMAIL_RE = re.compile(r"^[^@\s]{1,64}@[^@\s]{1,189}\.[^@\s]{2,}$")
_PSEUDO_RE = re.compile(r"^[\w .\-]{3,32}$")


def normaliser_email(v) -> str:
    return v.strip().lower() if isinstance(v, str) else ""


def email_valide(v: str) -> bool:
    return bool(v) and len(v) <= 254 and bool(_EMAIL_RE.match(v))


def pseudo_valide(v) -> bool:
    return isinstance(v, str) and bool(_PSEUDO_RE.match(v.strip()))


# --------------------------------------------------------------------------- jetons
def generer_jeton(octets: int = 32) -> str:
    return secrets.token_urlsafe(octets)


def hash_jeton(jeton: str) -> str:
    """Seul le hash est stocké : une fuite de la base ne donne aucune session exploitable."""
    return hashlib.sha256(jeton.encode("utf-8")).hexdigest()


# --------------------------------------------------------------------------- TOTP (RFC 6238)
def totp_nouveau_secret() -> str:
    return base64.b32encode(secrets.token_bytes(20)).decode("ascii").rstrip("=")


def _hotp(secret_b32: str, compteur: int, chiffres: int = 6) -> str:
    cle = base64.b32decode(secret_b32 + "=" * (-len(secret_b32) % 8), casefold=True)
    d = hmac.new(cle, struct.pack(">Q", compteur), hashlib.sha1).digest()
    o = d[-1] & 0x0F
    code = (struct.unpack(">I", d[o:o + 4])[0] & 0x7FFFFFFF) % (10 ** chiffres)
    return f"{code:0{chiffres}d}"


def totp_code(secret_b32: str, maintenant: float | None = None) -> str:
    return _hotp(secret_b32, int((maintenant or time.time()) // 30))


def totp_verifier(secret_b32: str, code: str, dernier_pas: int = 0,
                  maintenant: float | None = None) -> int | None:
    """Retourne le pas de temps validé (à mémoriser pour bloquer le rejeu) ou None."""
    code = re.sub(r"\s", "", str(code or ""))
    if not re.fullmatch(r"\d{6}", code):
        return None
    pas = int((maintenant or time.time()) // 30)
    for p in (pas - 1, pas, pas + 1):
        if p > dernier_pas and hmac.compare_digest(_hotp(secret_b32, p), code):
            return p
    return None


# Chiffrement du secret TOTP au repos (chiffrement-puis-MAC, flux HMAC-SHA256 en mode compteur).
def _cles(pepper: bytes) -> tuple[bytes, bytes]:
    base = hashlib.sha256(b"peginti-totp-v1" + pepper).digest()
    return (hmac.new(base, b"enc", hashlib.sha256).digest(),
            hmac.new(base, b"mac", hashlib.sha256).digest())


def _flux(cle: bytes, nonce: bytes, n: int) -> bytes:
    out = b""
    i = 0
    while len(out) < n:
        out += hmac.new(cle, nonce + struct.pack(">I", i), hashlib.sha256).digest()
        i += 1
    return out[:n]


def chiffrer_secret(texte: str, pepper: bytes) -> str:
    ke, km = _cles(pepper)
    nonce = secrets.token_bytes(16)
    brut = texte.encode("utf-8")
    ct = bytes(a ^ b for a, b in zip(brut, _flux(ke, nonce, len(brut))))
    tag = hmac.new(km, nonce + ct, hashlib.sha256).digest()
    return _b64(nonce + ct + tag)


def dechiffrer_secret(blob: str, pepper: bytes) -> str | None:
    try:
        ke, km = _cles(pepper)
        raw = base64.b64decode(blob)
        nonce, ct, tag = raw[:16], raw[16:-32], raw[-32:]
        if not hmac.compare_digest(tag, hmac.new(km, nonce + ct, hashlib.sha256).digest()):
            return None
        return bytes(a ^ b for a, b in zip(ct, _flux(ke, nonce, len(ct)))).decode("utf-8")
    except Exception:
        return None


# --------------------------------------------------------------------------- codes de secours 2FA
_ALPHABET_SECOURS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # sans 0, O, 1, I, pour éviter les confusions


def generer_codes_secours(n: int = 8) -> list[str]:
    return ["".join(secrets.choice(_ALPHABET_SECOURS) for _ in range(5)) + "-"
            + "".join(secrets.choice(_ALPHABET_SECOURS) for _ in range(5)) for _ in range(n)]


def hash_code_secours(code: str, pepper: bytes) -> str:
    propre = re.sub(r"[^A-Z0-9]", "", str(code or "").upper())
    return hmac.new(pepper, b"secours:" + propre.encode("utf-8"), hashlib.sha256).hexdigest()


# --------------------------------------------------------------------------- limitation de débit
class LimiteurDebit:
    """Fenêtre glissante en mémoire (processus unique, threads)."""

    def __init__(self) -> None:
        self._h: dict[str, deque] = {}
        self._verrou = threading.Lock()

    def autoriser(self, cle: str, maxi: int, fenetre: int) -> tuple[bool, int]:
        now = time.monotonic()
        with self._verrou:
            q = self._h.setdefault(cle, deque())
            while q and q[0] <= now - fenetre:
                q.popleft()
            if len(q) >= maxi:
                return False, int(q[0] + fenetre - now) + 1
            q.append(now)
            if len(self._h) > 50000:
                for k in [k for k, v in self._h.items() if not v]:
                    del self._h[k]
            return True, 0
