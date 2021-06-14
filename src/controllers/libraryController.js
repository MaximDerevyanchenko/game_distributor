module.exports = function (mongoose, io) {
    const GameLibrary = require('../models/gameLibraryModel')(mongoose)
    const GameCart = mongoose.model('GameCart')
    const GameWishlist = mongoose.model('GameWishlist')

    module.exports.addToLibrary = function (req, res) {
        GameLibrary.insertMany(req.body)
            .then(_ => GameCart.deleteMany({username: req.cookies.username})
                .then(_ => res.status(201).json())
                .catch(err => res.send(err)))
            .catch(err => res.send(err))
    }

    module.exports.getLibrary = function (req, res) {
        GameLibrary.find({username: req.cookies.username})
            .then(library => res.json(library))
            .catch(err => res.send(err))
    }

    module.exports.buyForFriend = function (req, res) {
        GameLibrary.create(req.body)
            .then(_ => GameWishlist.deleteOne({username: req.body.username, gameId: req.body.gameId})
                .then(_ => {
                    io.emit('gameGifted')
                    res.status(201).json()
                })
                .catch(err => res.send(err)))
            .catch(err => res.send(err))
    }
}
