module.exports = function (mongoose, io) {

    const GameWishlist = require('../models/gameWishlistModel')(mongoose)

    module.exports.addToWishlist = function (req, res) {
        GameWishlist.create({username: req.cookies.username, gameId: req.body.data.steam_appid})
            .then(gameCart => res.status(201).json(gameCart))
            .catch(err => res.send(err))
    }

    module.exports.getWishlist = function (req, res) {
        GameWishlist.find({username: req.params.username})
            .then(games => res.json(games))
            .catch(err => res.send(err))
    }

    module.exports.deleteFromWishlist = function (req, res) {
        GameWishlist.deleteOne({username: req.cookies.username, gameId: req.params.gameId})
            .then(() => res.json())
            .catch(err => console.log(err))
    }
}
