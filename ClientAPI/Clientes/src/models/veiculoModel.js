"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const veiculoSchema = new Schema(
    {
        matricula: {
            type: String,
            required: "Matricula do veiculo",
        },
    },
    { collection: "VeiculosCollection" }
);


veiculoSchema.methods.registarEntrada = function (hora_inicial, idParque) {
    this.parque = idParque;
    this.hora_inicial = hora_inicial;
    this.save();
};

veiculoSchema.methods.registarSaida = function (hora_final, idParque) {
    this.parque = idParque;
    this.hora_final = hora_final;
    this.save();
};

// --------------------------------------------------
// - export the Utilizador Schema
module.exports = mongoose.model("Veiculo", veiculoSchema);
