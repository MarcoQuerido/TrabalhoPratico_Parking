"use strict";
module.exports = function (auth, app) {
    const aluguerCtrl = require("../controllers/aluguerController");
    // -- rota  /registar    métodos: POST
    app.route("/aluguer").get(auth, aluguerCtrl.obter_aluguer);
};
