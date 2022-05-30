"use strict";
const mongoose = require("mongoose");
require("mongoose-double")(mongoose);
const Schema = mongoose.Schema;

const aluguerSchema = new Schema(
    {
        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Utilizador",
            required: "Cliente",
        },
        parque: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parques",
            required: "Parque",
        },
        horaInicio: {
            type: Date,
            default: Date.now,
        },
        horaFim: {
            type: Date,
            default: null,
        },
        valorFinal: {
            type: mongoose.Schema.Types.Double,
            default: 1.5,
        },
    },
    { collection: "AluguerCollection" }
);

module.exports = mongoose.model("Aluguer", aluguerSchema);
