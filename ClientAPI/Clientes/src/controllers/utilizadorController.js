'use strict';

const passport = require('passport')
const mongoose = require('mongoose')
const Utilizador = mongoose.model('Utilizador');


exports.registar_utilizador = (req, res) => {
    const rb = req.body
    const todosParams = rb.username && rb.nome
                       && rb.email && rb.password ;
    if (!todosParams) {
        return res
                .status(400)
                .json({"message" : "todos os campos são necessários"})
    }
    const utilizador = new Utilizador()
    utilizador.username = req.body.username
    utilizador.nome = req.body.nome
    utilizador.email = req.body.email
    utilizador.dadosPassword = {hash:'', salt:''}
    utilizador.setDadosPassword(req.body.password)
    // guardar
    utilizador.save( (err) => {
            if (err) {
                res.status(404).json(err)
            } else {
                const token = utilizador.gerarJwt();
                res.status(201).json(token);
            }
    })

    }

exports.autenticar = (req, res) => {
    const rb = req.body
    const todosParams = rb.username
        && rb.password;
    if (!todosParams) {
        return res
            .status(400)
            .json({"message": "todos os campos são necessários"})
    }

    passport.authenticate('local', (err, utilizador, info) => {
        if (err) {
            return res.status(404).json(err)
        }
        if (utilizador) {
            const token = utilizador.gerarJwt();
            res.status(200).json({token});
        } else {
            res.status(401) // não está autorizado
                .json(info)
        }
    })(req, res)
}


exports.obtem_um_utilizador = function (req, res) {
    Utilizador.findById(req.params.userid, function (err, utilizador) {
        if (err)
            res.send(err);
        res.json(utilizador);
    });
};