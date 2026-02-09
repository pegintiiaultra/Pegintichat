#!/bin/bash

APP="index.js"
LOG="peginti.log"
PORT=4000

case "$1" in
  start)
    echo "🚀 Démarrage de PEGINTICHAT API sur le port $PORT..."
    export PORT=$PORT
    nohup node $APP > $LOG 2>&1 &
    ;;
  stop)
    echo "🛑 Arrêt du serveur PEGINTICHAT..."
    pkill -f "node $APP"
    ;;
  logs)
    echo "📜 Affichage des logs..."
    tail -f $LOG
    ;;
  status)
    echo "🔍 Vérification du statut..."
    curl -s http://localhost:$PORT/api/status
    ;;
  restart)
    echo "🔄 Redémarrage du serveur PEGINTICHAT..."
    $0 stop
    sleep 1
    $0 start
    ;;
  *)
    echo "Usage: $0 {start|stop|logs|status|restart}"
    ;;
esac
