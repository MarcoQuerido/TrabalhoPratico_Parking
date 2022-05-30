"use strict";

const mongoose = require("mongoose");
const util = require("./util.js");
const Aluguer = mongoose.model("Aluguer");
const Veiculo = mongoose.model("Veiculo");

exports.registar_saida_veiculo = (
    matricula,
    idParque,
    idUtilizador,
    connection
) => {
    let verificarDados = util.verificarDadosSaida(
        matricula,
        idParque,
        idUtilizador
    );
    verificarDados
        .then(() => {
            const aluguer = new Aluguer();
            aluguer.cliente = mongoose.Types.ObjectId(idUtilizador);
            aluguer.veiculo = mongoose.Types.ObjectId(matricula);
            aluguer.zonaSaida = mongoose.Types.ObjectId(idParque);
            aluguer.save((err) => {
                if (err) {
                    connection.write(
                        JSON.stringify({
                            tipo: 2,
                            message: err,
                        })
                    );
                } else {
                    Veiculo.findById(matricula, (err, veiculo) => {
                        veiculo.setEstado(1);
                    });
                    connection.write(
                        JSON.stringify({
                            tipo: 1,
                            message: "Aluguer registado",
                        })
                    );
                }
            });
        })
        .catch((err) => {
            connection.write(JSON.stringify({ tipo: 2, mensagem: err }));
        });
};

exports.registar_entrada_veiculo = (matricula, idParque, connection) => {
    let verificarDados = util.verificarDadosEntrada(idParque, matricula);
    verificarDados
        .then(() => {
            let condition = {
                veiculo: mongoose.Types.ObjectId(matricula),
                horaFim: null,
                parqueEntrada: null,
            };
            Aluguer.findOne(condition)
                .populate("veiculo")
                .populate("cliente")
                .exec((err, result) => {
                    if (err || !result) {
                        connection.write(
                            JSON.stringify({
                                tipo: 2,
                                message: "Erro ao encontrar aluguer",
                            })
                        );
                    } else {
                        result.horaFim = Date.now();
                        result.zonaEntrega = mongoose.Types.ObjectId(idParque);

                        const numDias =
                            (result.horaFim - result.horaInicio) /
                            (1000 * 60 * 60 * 24);
                        result.valorFinal =
                            result.veiculo.valorDia * Math.ceil(numDias);

                        const saldo = result.cliente.updateSaldo(
                            result.veiculo.valorDia * Math.ceil(numDias)
                        );
                        result.save((err) => {
                            if (err) {
                                connection.write(
                                    JSON.stringify({
                                        tipo: 2,
                                        message: "Erro ao registar entrada",
                                    })
                                );
                            } else {
                                result.veiculo.registarEntrada(
                                    0,
                                    mongoose.Types.ObjectId(idParque)
                                );
                                connection.write(
                                    JSON.stringify({
                                        tipo: 1,
                                        message: "Veiculo entregue com sucesso. " + saldo,
                                    })
                                );
                            }
                        });
                    }
                });
        })
        .catch((err) => {
            connection.write(JSON.stringify({ tipo: 2, mensagem: err }));
        });
};

exports.obter_aluguer = (req, res) => {
    util.obterUtilizador(req, res, (req, res, utilizador) => {
        if (!utilizador)
            return res.status(404).json({ message: "Utilizador não encontrado" });
        const condicao = {
            cliente: utilizador._id,
            horaFim: { $ne: null },
        };
        Aluguer.find(condicao)
            .populate("veiculo")
            .exec((err, result) => {
                if (err)
                    return res
                        .status(404)
                        .json({ message: "Aluguer não encontrado" });
                res.status(200).json(result);
            });
    });
};
