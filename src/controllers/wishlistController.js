module.exports = function (mongoose, _, axios) {
    const GameWishlist = mongoose.model('GameWishlist')
    const GameSchema = mongoose.model('GameSchema')

    module.exports.addToWishlist = function (req, res) {
        GameWishlist.create({username: req.cookies.username, gameId: req.body.gameId})
            .then(gameCart => res.status(201).json(gameCart))
            .catch(err => res.send(err))
    }

    module.exports.getWishlist = function (req, res) {
        GameWishlist.find({username: req.params.username})
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
                                } else
                                    return g
                            }))
                })
                Promise.all(promises)
                    .then(games => res.json(games))
                    .catch(err => res.send(err))
            })
            .catch(err => res.send(err))
    }

    module.exports.deleteFromWishlist = function (req, res) {
        GameWishlist.deleteOne({username: req.cookies.username, gameId: req.params.gameId})
            .then(() => res.json())
            .catch(err => res.send(err))
    }
}
