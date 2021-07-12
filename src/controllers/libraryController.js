module.exports = function (mongoose, io) {
    const GameLibrary = mongoose.model('GameLibrary')
    const GameSchema = mongoose.model('GameSchema')
    const GameCart = mongoose.model('GameCart')
    const GameWishlist = mongoose.model('GameWishlist')
    const Accounts = mongoose.model('AccountSchema')
    const millisToMinutes = 1000 * 60

    module.exports.addToLibrary = function (req, res) {
        GameLibrary.insertMany(req.body)
            .then(games => {
                GameCart.deleteMany({username: req.cookies.username, gameId: { $in: games.map(g => g.gameId) }})
                    .then(_ => {
                        res.status(201).json()
                        games.forEach(game => {
                            if (game.isLocal) {
                                GameSchema.find({ gameId: game.gameId })
                                    .then(response => io.emit('gameBought', req.cookies.username, response))
                                    .catch(error => res.send(error))
                            }
                        })
                    })
                    .catch(err => res.send(err))
                GameWishlist.deleteMany({ username: req.cookies.username, gameId: { $in: games.map(g => g.gameId) }})
                    .then(() => {})
                    .catch(err => res.send(err))
            })
            .catch(err => res.send(err))
    }

    module.exports.getLibrary = function (req, res) {
        GameLibrary.find({username: req.params.username})
            .then(library => res.json(library))
            .catch(err => res.send(err))
    }

    module.exports.buyForFriend = function (req, res) {
        GameLibrary.create(req.body)
            .then(game => GameWishlist.deleteOne({ username: req.body.username, gameId: req.body.gameId })
                .then(_ => {
                    io.emit('gameGifted', req.body.giftedBy, game)
                    res.status(201).json()
                })
                .catch(err => res.send(err)))
            .catch(err => res.send(err))
    }

    module.exports.getFriendsWithGame = function (req, res) {
        Accounts.find({ username: req.params.username })
            .then(userAccount => {
                GameLibrary.find({ gameId : req.params.gameId, username: { $in: userAccount[0].friends } })
                    .then(friendsWithGame => {
                        const friendsUsernames = []
                        friendsWithGame.forEach(user => friendsUsernames.push(user.username))
                        Accounts.find({ username: { $in: friendsUsernames } })
                            .then(accounts => res.json(accounts))
                            .catch(err => res.send(err))
                    })
                    .catch(err => res.send(err))
            })
            .catch(err => res.send(err))

    }

    module.exports.startGame = function (req, res) {
        GameLibrary.findOneAndUpdate({ username: req.params.username, gameId: req.params.gameId }, { startedAt: req.body.started })
                .then(_ => res.sendStatus(200))
                .catch(err => res.send(err))
    }

    module.exports.closedGame = function (req, res) {
        GameLibrary.findOne({ username: req.params.username, gameId: req.params.gameId })
            .then(userGame => {
                let totalTimePlayed = userGame.timePlayed
                const timePlayed = Date.now() - userGame.startedAt
                totalTimePlayed = totalTimePlayed + Math.floor((timePlayed / millisToMinutes))
                GameLibrary.findOneAndUpdate({ username: req.params.username, gameId: req.params.gameId }, { timePlayed: totalTimePlayed })
                    .then(_ => res.sendStatus(200))
                    .catch(err => res.send(err))
            })
    }
}
