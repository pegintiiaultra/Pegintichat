#!/usr/bin/env python3
"""Contrôle multiplateforme : demarrer | arreter | etat | superadmin (utilisé par les lanceurs de l'installateur)."""
import os
import signal
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ICI = Path(__file__).resolve().parent
PID = ICI / "data" / "peginti.pid"
JOURNAL = ICI / "data" / "peginti.log"


def port():
    p = os.environ.get("PORT")
    env = ICI / ".env"
    if not p and env.exists():
        for l in env.read_text(encoding="utf-8").splitlines():
            if l.startswith("PORT="):
                p = l.split("=", 1)[1].strip()
    return p or "4000"


def pid_vivant():
    try:
        pid = int(PID.read_text())
    except (OSError, ValueError):
        return None
    try:
        if os.name == "nt":
            out = subprocess.run(["tasklist", "/FI", f"PID eq {pid}"], capture_output=True, text=True).stdout
            return pid if str(pid) in out else None
        os.kill(pid, 0)
        return pid
    except OSError:
        return None


def demarrer():
    if pid_vivant():
        print("Déjà lancé.")
        return
    (ICI / "data").mkdir(exist_ok=True)
    journal = open(JOURNAL, "ab")
    kw = {"creationflags": 0x00000008 | 0x00000200} if os.name == "nt" else {"start_new_session": True}
    p = subprocess.Popen([sys.executable, "serve.py"], cwd=ICI, stdout=journal, stderr=journal, **kw)
    PID.write_text(str(p.pid))
    for _ in range(20):
        time.sleep(0.5)
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{port()}/api/sante", timeout=2).read()
            print(f"PEGINTI IA lancé : http://127.0.0.1:{port()}  (journal : {JOURNAL})")
            return
        except Exception:
            if p.poll() is not None:
                break
    print(f"Le serveur ne répond pas : consultez {JOURNAL}")


def arreter():
    pid = pid_vivant()
    if not pid:
        print("Rien à arrêter.")
        return
    if os.name == "nt":
        subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True)
    else:
        os.kill(pid, signal.SIGTERM)
    PID.unlink(missing_ok=True)
    print("PEGINTI arrêté.")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "etat"
    if cmd == "demarrer":
        demarrer()
    elif cmd == "arreter":
        arreter()
    elif cmd == "superadmin":
        os.execv(sys.executable, [sys.executable, "manage.py", "creer-superadmin", *sys.argv[2:]])
    else:
        print(f"En marche (PID {pid_vivant()})." if pid_vivant() else "Arrêté.")
