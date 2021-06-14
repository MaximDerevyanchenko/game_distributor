module.exports = function (mongoose, io) {
    let Account = require('../models/accountModel')(mongoose)

    module.exports.login = function (req, res) {
        Account.findOne({username: req.body.username, password: req.body.password})
            .then(acc => res.json(acc))
            .catch(err => res.send(err))
    }

    module.exports.changeState = function (req, res) {
        Account.findOneAndUpdate({username: req.cookies.username}, { state: req.body.state}, { new: true})
            .then(acc => {
                io.emit('friendStateChanged', acc)
                res.json(acc)
            })
            .catch(err =>
                res.send(err)
            )
    }

    module.exports.getMyAccount = function (req, res) {
        Account.findOne({username: req.cookies.username})
            .then(acc => res.json(acc))
            .catch(err => res.send(err))
    }

    module.exports.signup = function (req, res) {
        Account.findOne({username: req.body.username})
            .then(acc => {
                if (acc != null)
                    res.json({username: acc.username})
                else
                    Account.create(req.body)
                        .then(account => res.status(201).json(account))
                        .catch(err => res.send(err))
            })
            .catch(err => res.send(err))
    }

    module.exports.getFriends = function (req, res) {
        Account.findOne({username: req.cookies.username})
            .then(acc => {
                let promises = []
                acc.friends.forEach(friend =>
                    promises.push(
                        Account.findOne({username: friend})
                            .then(fr => fr)
                            .catch(err => res.send(err))))
                Promise.all(promises)
                    .then(friends => res.json(friends))
                    .catch(err => res.send(err))
            })
            .catch(err => res.send(err))
    }

    module.exports.getFriendRequests = function (req, res) {
        Account.findOne({username: req.cookies.username})
            .then(acc => {
                let promises = []
                acc.friendRequests.forEach(friend =>
                    promises.push(
                        Account.findOne({username: friend})
                            .then(fr => fr)
                            .catch(err => res.send(err))))
                Promise.all(promises)
                    .then(friends => res.json(friends))
                    .catch(err => res.send(err))
            })
            .catch(err => res.send(err))
    }

    module.exports.getPendingRequests = function (req, res) {
        Account.findOne({username: req.cookies.username})
            .then(acc => {
                let promises = []
                acc.pendingRequests.forEach(friend =>
                    promises.push(
                        Account.findOne({username: friend})
                            .then(fr => fr)
                            .catch(err => res.send(err))))
                Promise.all(promises)
                    .then(friends => res.json(friends))
                    .catch(err => res.send(err))
            })
            .catch(err => res.send(err))
    }

    module.exports.addFriend = function (req, res) {
        Account.updateOne({username: req.cookies.username}, {$addToSet: {pendingRequests: [req.body.username]}})
            .then(() =>
                Account.findOneAndUpdate({username: req.body.username}, {$addToSet: {friendRequests: [req.cookies.username]}})
                    .then(friend => {
                        io.emit('friendAdded')
                        res.json(friend)
                    })
                    .catch(err => res.send(err)))
            .catch(err => res.send(err))
    }

    module.exports.removeFriend = function (req, res) {
        Account.updateOne({username: req.cookies.username}, {$pull: {friends: req.params.friend}})
            .then(() => {
                Account.updateOne({username: req.params.friend }, {$pull: {friends: req.cookies.username }})
                    .then(acc => {
                        io.emit('friendRemoved')
                        res.json(acc)
                    })
                    .catch(err => res.send(err))
            })
            .catch(err => res.send(err))
    }

    module.exports.acceptFriend = function (req, res) {
        Account.updateOne({username: req.cookies.username}, {
            $addToSet: {friends: [req.body.username]},
            $pull: {friendRequests: req.body.username}
        })
            .then(() =>
                Account.findOneAndUpdate({username: req.body.username}, {
                    $addToSet: {friends: [req.cookies.username]},
                    $pull: {pendingRequests: req.cookies.username}
                })
                    .then(friend => {
                        io.emit('friendAccept')
                        res.json(friend)
                    })
                    .catch(err => res.send(err)))
            .catch(err => res.send(err))
    }

    module.exports.updateMyAccount = function (req, res) {
        Account.findOneAndUpdate({username: req.cookies.username}, req.body, {new: true})
            .then(acc => {
                io.emit('friendStateChanged', acc)
                res.json(acc)
            })
            .catch(err => res.send(err))
    }

    module.exports.becomeDeveloper = function (req, res){
        Account.updateOne({username: req.cookies.username}, req.body)
            .then(acc => res.json(acc))
            .catch(err => res.send(err))
    }
}
