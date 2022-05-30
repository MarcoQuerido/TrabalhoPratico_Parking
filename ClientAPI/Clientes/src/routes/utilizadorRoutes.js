"use strict";
module.exports = function (auth, app) {
    const utilizadorCtrl = require("../controllers/utilizadorController");

    // -- rota  /registar    métodos: POST
    app.route("/registar").post(utilizadorCtrl.registar_utilizador);

    // -- rota  /login    métodos: POST
    app.route("/login").post(utilizadorCtrl.autenticar);

    app.route("/verificarToken").get(auth, utilizadorCtrl.verificar_token);

    app.route("/utilizador").get(auth, utilizadorCtrl.obter_utilizador);

    app.route("/saldo")
        .get(auth, utilizadorCtrl.verificar_saldo)
        .post(auth, utilizadorCtrl.adicionar_saldo);
};
