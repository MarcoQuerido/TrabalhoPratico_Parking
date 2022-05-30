"use strict";
module.exports = function (autentication, app) {
    const parqueCtrl = require("../controllers/parqueController");

    // -- rota  /registar    métodos: POST
    app.route("/parque")
        .get(parqueCtrl.listar_parques())
        .post(autentication, parqueCtrl.criar_parque());
};
