module.exports = function (mongoose, io) {
    const GameCart = require('../models/gameCartModel')(mongoose)
    const GameSchema = mongoose.model('GameSchema')
    const axios = require('axios')

    module.exports.addToCart = function (req, res) {
        GameCart.create({username: req.cookies.username, gameId: req.body.gameId})
            .then(gameCart => res.status(201).json(gameCart))
            .catch(err => res.send(err))
    }

    module.exports.getCart = function (req, res) {
        GameCart.find({username: req.cookies.username})
            .then(games => {
                const promises = []
                games.forEach(game => {
                    promises.push(
                    GameSchema.findOne({gameId: game.gameId})
                        .then(g => {
                            if (!g.isLocal) {
                                return axios.get("https://store.steampowered.com/api/appdetails?appids=" + g.gameId)
                                    .then(response => {
                                        if (response.data[g.gameId].success) {
                                            let result = response.data[g.gameId].data
                                            result.gameId = result.steam_appid
                                            return result
                                        } else
                                            return 204
                                    })
                                    .catch(err => res.send(err))
                            } else {
                                return g
                            }
                    }))
                })
                Promise.all(promises)
                    .then(games => res.json(games))
                    .catch(err => res.send(err))
            })
            .catch(err => res.send(err))
    }

    module.exports.deleteFromCart = function (req, res) {
        GameCart.deleteOne({username: req.cookies.username, gameId: req.params.gameId})
            .then(() => res.json())
            .catch(err => console.log(err))
    }

    module.exports.deleteManyFromCart = function (req, res) {
        GameCart.deleteMany({username: req.cookies.username})
            .then(() => res.json())
            .catch(err => console.log(err))
    }
}
