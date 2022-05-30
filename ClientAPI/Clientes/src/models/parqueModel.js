"use strict";
const mongoose = require("mongoose");
require("mongoose-double")(mongoose);
const Schema = mongoose.Schema;

const parqueSchema = new Schema(
    {
        nome: {
            type: String,
            required: "Nome",
        },
        rua: {
            type: String,
            required: "Rua",
        },
        lotacao: {
            type: Number,
            default: 0.0,
        },
        latitude: {
            type: mongoose.Schema.Types.Double,
            default: 0,
        },
        longitude: {
            type: mongoose.Schema.Types.Double,
            default: 0,
        },
    },
    { collection: "parqueCollection" }
);

// --------------------------------------------------
// - Schema Methods: definição de métodos associados ao modelo
// ------------------------------

// - setEstado(password): Alterar estado
parqueSchema.methods.setEstado = (novoEstado) => {
    this.estado = novoEstado;
};

const ParquesModel =  mongoose.model('NovoParque', inscricaoSchema);
// --------------------------------------------------
// -
const ParquesIniciaisArray = [
    {nome: "Parque AAA", estado: "aberto",
        Created_date: new Date("2020-04-30T11:24:44.007+00:00")},

    {nome: "Parque BBB", estado: "fechado",
        Created_date: new Date("2020-04-30T11:24:44.007+00:00")},

    {nome: "Parque CCC", estado: "aberto",
        Created_date: new Date("2020-04-30T11:24:44.007+00:00") },

    {nome: "Parque DDD", estado: "aberto",
        Created_date: new Date("2020-04-30T11:24:44.007+00:00") },
];

// de forma a definir valores iniciais (caso não exista a collection)
// Model.init()  https://mongoosejs.com/docs/api.html#model_Model.init
ParquesModel.init().then(function (model) {
    model.countDocuments({}, function (err, count) {
        if (count == 0) { // ainda não tem registos...
            try {
                ParquesModel.insertMany( ParquesIniciaisArray );
            } catch (e) {
                console.log(e);
            }
        }
    });
});
// - export the Utilizador Schema
module.exports = mongoose.model("Parque", parqueSchema);
