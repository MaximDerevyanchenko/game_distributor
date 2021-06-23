module.exports = function (mongoose, io) {
    const GameCart = require('../models/gameCartModel')(mongoose)
    const axios = require('axios')

    module.exports.addToCart = function (req, res) {
        GameCart.create({username: req.cookies.username, gameId: req.body.steam_appid})
            .then(gameCart => res.status(201).json(gameCart))
            .catch(err => res.send(err))
    }

    module.exports.getCart = function (req, res) {
        GameCart.find({username: req.cookies.username})
            .then(games => {
                const promises = []
                games.forEach(game =>
                    promises.push(
                        axios.get("https://store.steampowered.com/api/appdetails?appids=" + game.gameId)
                            .then(response => {
                                if (response.data[game.gameId].success)
                                    return response.data[game.gameId].data
                                else
                                    return 204
                            })
                            .catch(err => res.send(err))))
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
}
