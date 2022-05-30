"use strict";

const mongoose = require("mongoose");
const Parque = mongoose.model("Parque");
const util = require("./util.js");

exports.listar_parques = (req, res) => {
    Parque.find((err, Parques) =>{
        if (err) return res.status(401).json(err);
        res.status(200).json(Parques);
    });
};

exports.criar_parque = (req, res) => {
    util.obterUtilizador(req, res, (req, res, utilizador) => {
        if (utilizador.tipo === 1) {
            const rb = req.body;
            const todosParams = rb.nome && rb.rua && rb.lotacao;
            if (!todosParams) {
                return res
                    .status(400)
                    .json({ message: "Todos os campos são necessários" });
            }
            const parque = new Parque();
            parque.nome = rb.nome;
            parque.rua = rb.rua;
            parque.lotacao=rb.lotacao;
            parque.save((err) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    res.status(200).json({
                        tipo: "sucesso",
                        message: "Parque criado",
                    });
                }
            });
        } else {
            res.status(401).json({
                message: "Não está autorizado a criar parques",
            });
        }
    });
};
