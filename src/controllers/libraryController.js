const mongoose = require('mongoose')
GameLibrary = require('../models/gameLibraryModel')(mongoose)
GameCart = mongoose.model('GameCart')

exports.addToLibrary = function (req, res) {
    GameLibrary.insertMany(req.body)
        .then(_ => GameCart.deleteMany({ username: req.cookies.username })
                .then(_ => res.status(201).json())
                .catch(err => res.send(err)))
        .catch(err => res.send(err))
}

exports.getLibrary = function (req, res){
    GameLibrary.find({ username: req.cookies.username})
        .then(library => res.json(library))
        .catch(err => res.send(err))
}
