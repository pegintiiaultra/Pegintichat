#!/data/data/com.termux/files/usr/bin/bash

ACTION=$1

case "$ACTION" in
  start)
    echo "🚀 Lancement PEGINTICHAT + Bo’oivini tunnel..."
    pm2 start ~/PEGINTICHAT/ecosystem.config.js
    ;;
  stop)
    echo "🛑 Arrêt PEGINTICHAT + Bo’oivini tunnel..."
    pm2 stop pegintichat
    pm2 stop bo-oivini-tunnel
    ;;
  restart)
    echo "🔄 Redémarrage PEGINTICHAT + Bo’oivini tunnel..."
    pm2 restart pegintichat
    pm2 restart bo-oivini-tunnel
    ;;
  status)
    echo "📊 Statut doctrinal PEGINTICHAT + Bo’oivini tunnel..."
    pm2 status
    ;;
  logs)
    echo "📜 Logs doctrinaux PEGINTICHAT + Bo’oivini tunnel..."
    pm2 logs pegintichat
    pm2 logs bo-oivini-tunnel
    ;;
  *)
    echo "Usage: ./peginti.sh {start|stop|restart|status|logs}"
    ;;
esac
