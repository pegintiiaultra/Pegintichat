#!/data/data/com.termux/files/usr/bin/bash
tmux kill-session -t peginti 2>/dev/null && echo "PEGINTI arrêté." || echo "Rien à arrêter."
command -v termux-wake-unlock >/dev/null && termux-wake-unlock
