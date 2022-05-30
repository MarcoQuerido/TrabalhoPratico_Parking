"use strict";

const mongoose = require("mongoose");
const Veiculo = mongoose.model("Veiculo");
const Parque = mongoose.model("Parque");
const util = require("./utils.js");

exports.lista_veiculos_disponiveis = (req, res) => {
    let condicao = { estado: 0 };

    Veiculo.find(condicao)
        .populate("zonaAtual")
        .exec((err, veiculos) => {
            if (err) return res.status(404).json(err);
            res.status(200).json(veiculos);
        });
};

exports.criar_veiculo = (req, res) => {
    util.obterUtilizador(req, res, (req, res, utilizador) => {
        if (utilizador.tipo === 1) {
            const rb = req.body;
            const todosParams =
                rb.nome &&
                rb.marca &&
                rb.matricula &&
                rb.parqueId;
            if (!todosParams) {
                return res
                    .status(400)
                    .json({ message: "Todos os campos são necessários" });
            }
            const veiculo = new Veiculo();
            veiculo.nome = rb.nome;
            veiculo.marca = rb.marca;
            veiculo.matricula = rb.matricula;
            veiculo.parqueId = rb.parqueId;
            if (rb.estado) {
                veiculo.estado = rb.estado;
            }
            Parque.findById(rb.parqueId, (err, zona) => {
                if (zona) {
                    veiculo.save((err) => {
                        if (err) {
                            return res.status(400).json(err);
                        } else {
                            return res.status(200).json({
                                tipo: "sucesso",
                                message: "Veiculo criado",
                            });
                        }
                    });
                } else {
                    return res
                        .status(400)
                        .json({ message: "A zona não está definida" });
                }
            });
        } else {
            res.status(401).json({
                message: "Não está autorizado a criar veiculos",
            });
        }
    });
};

exports.lista_veiculos_zona = (req, res) => {
    const id_parque = req.params.id;
    Parque.findById(id_parque, (err, zona) => {
        if (err) return res.status(404).json({ message: "Parque não encontrado" });
        const condition = { zonaAtual: id_parque };
        Veiculo.find(condition, (err, veiculo) => {
            if (err)
                return res
                    .status(404)
                    .json({ message: "Erro ao pesquisar veiculo" });
            res.status(200).json(veiculo);
        });
    });
};
