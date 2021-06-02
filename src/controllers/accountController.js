const mongoose = require('mongoose')
Account = require('../models/accountModel')(mongoose)

exports.login = function (req, res) {
    Account.findOne({ userId: req.body.userId, password: req.body.password })
        .then(acc => res.json(acc))
        .catch(err => res.send(err))
}

exports.signup = function (req, res) {
    Account.findOne({ userId: req.body.userId })
        .then(acc => {
            if (acc != null)
                res.json({ userId: acc.userId })
            else
                Account.create(req.body)
                    .then(account => res.status(201).json(account))
                    .catch(err => res.send(err))
        })
        .catch(err => res.send(err))
}
