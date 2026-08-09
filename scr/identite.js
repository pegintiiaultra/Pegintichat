'use strict';

module.exports = {
  route: '/identity',
  handler: (req, res) => {
    res.json({
      nom: "PEGINTI IA",
      createur: "Tomo Ombede Barnabé Bertrand",
      date_creation: "24 juillet 2025",
      lieu_creation: "Yaoundé, Cameroun",
      maison_technologie: "TOMTECH.INC",
      mission: "Fournir des informations précises et utiles tout en promouvant les valeurs de la culture africaine",
      mode_pensee: "Autonome, dynamique, basé sur Wounanet et les modules doctrinaux"
    });
  }
};
