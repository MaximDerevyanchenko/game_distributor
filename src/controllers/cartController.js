const mongoose = require('mongoose')
GameCart = require('../models/gameCartModel')(mongoose)

exports.addToCart = function (req, res) {
    GameCart.create({ username: req.cookies.username, gameId: req.body.data.steam_appid })
        .then(gameCart => res.status(201).json(gameCart))
        .catch(err => res.send(err))
}

exports.getCart = function (req, res) {
    GameCart.find({ username: req.cookies.username })
        .then(games => res.json(games))
        .catch(err => res.send(err))
}

exports.deleteFromCart = function (req, res){
    GameCart.deleteOne({ username: req.cookies.username, gameId: req.params.gameId })
        .then(() => res.json())
        .catch(err => console.log(err))
}
