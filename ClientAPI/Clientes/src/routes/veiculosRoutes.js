"use strict";
module.exports = function (autentication, app) {
    const veiculoCtrl = require("../controllers/veiculoController");

    // -- rota  /registar    métodos: POST
    app.route("/veiculo")
        .get(veiculoCtrl.lista_veiculos_disponiveis)
        .post(autentication, veiculoCtrl.criar_veiculo);

    app.route("/veiculo/:id").get(veiculoCtrl.lista_veiculos_zona);
};
