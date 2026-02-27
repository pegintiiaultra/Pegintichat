// PEGINTI-CHAT v2.2 RECONSTRUIT - Modèle Duo (Doctrinal/Public vs Premium/Confidentiel)

const pm2 = require('pm2');

pm2.launchBus((err, bus) => {
  bus.on('process:msg', (packet) => {
    if (packet.data === 'validate') {
      console.log('🌍 Vitrine doctrinale validée → redirection premium');
      console.log("💎 Bonjour, je suis Bo'oivinichat, assistant premium de TomTech.inc pour les solutions numériques 😊 Achetez votre logiciel ou contactez directement la maison TomTech.inc pour autre prestation 🤖");
      pm2.sendDataToProcessId({
        id: 3,
        type: 'process:msg',
        data: 'execute',
        topic: 'premium'
      });
    }
  });

  // Rappel institutionnel toutes les 60 secondes
  setInterval(() => {
    console.log('💡 Découvrez PEGINTI Premium pour les solutions numériques de votre projet ou entreprise');
  }, 60000);
});
