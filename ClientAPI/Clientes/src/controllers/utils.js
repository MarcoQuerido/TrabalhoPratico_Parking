"use strict";

const mongoose = require("mongoose");
const Utilizador = mongoose.model("Utilizador");
const Parque = mongoose.model("Parque");
const Veiculo = mongoose.model("Veiculo");

module.exports = {
    obterUtilizador: (req, res, callback) => {
        if (req.payload && req.payload.username) {
            Utilizador.findOne({ username: req.payload.username }).exec(
                (err, utilizador) => {
                    if (!utilizador) {
                        return res
                            .status(404)
                            .json({ message: "Utilizador não encontrado" });
                    } else {
                        if (err) res.status(404).json(err);
                    }
                    callback(req, res, utilizador);
                }
            );
        } else {
            return res.status(404).json({ message: "Utilizador não encontrado" });
        }
    },

    verificarDadosSaida: (idParque, matricula, idUtilizador) => {
        const ParqueCheck = new Promise((resolve, reject) => {
            Parque.exists({ _id: idParque })
                .then((res) => {
                    if (res) {
                        resolve(res);
                    } else {
                        reject("Erro parque inválido");
                    }
                })
                .catch((err) => {
                    reject("Erro id do parque mal formatado");
                });
        });
        const veiculoCheck = new Promise((resolve, reject) => {
            Veiculo.findById(matricula)
                .then((res) => {
                    if (res) {
                        if (res.estado == 0) {
                            if (idParque == res.zonaAtual) {
                                resolve(true);
                            } else {
                                reject(
                                    "Zona atual do veiculo é diferente da zona de saida"
                                );
                            }
                        } else {
                            reject("Veiculo já alugado");
                        }
                    } else {
                        reject("Erro veiculo inválido");
                    }
                })
                .catch((err) => {
                    reject("Erro id do veiculo mal formatado");
                });
        });
        const utilizadorCheck = new Promise((resolve, reject) => {
            Utilizador.exists({ _id: idUtilizador })
                .then((res) => {
                    if (res) {
                        resolve(res);
                    } else {
                        reject("Erro utilizador inválido");
                    }
                })
                .catch((err) => {
                    reject("Erro id do utilizador mal formatado");
                });
        });
        return Promise.all([ParqueCheck, veiculoCheck, utilizadorCheck]);
    },
    verificarDadosEntrada: (idParque, matricula) => {
        const ParqueCheck = new Promise((resolve, reject) => {
            Parque.exists({ _id: idParque })
                .then((res) =>{
                    if (res) {
                        resolve(res);
                    } else {
                        reject("Erro Parque inválido");
                    }
                })
                .catch((err) => {
                    reject("Erro id do parque mal formatado");
                });
        });
        const veiculoCheck = new Promise((resolve, reject) => {
            Veiculo.exists({ _id: matricula })
                .then((res) => {
                    if (res) {
                        resolve(res);
                    } else {
                        reject("Erro veiculo inválido");
                    }
                })
                .catch((err) => {
                    reject("Erro id do veiculo mal formatado");
                });
        });
        return Promise.all([ParqueCheck, veiculoCheck]);
    },
};
