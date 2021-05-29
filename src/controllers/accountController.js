const mongoose = require('mongoose')
Account = require('../models/accountModel')(mongoose)

exports.login = function (req, res) {
    Account.findOne({ userId: req.body.userId, password: req.body.password }, function (err, acc) {
        if (err)
            res.send(err)
        else {
            res.json(acc)
        }
    })
}

exports.signup = function (req, res) {
    Account.findOne({ userId: req.body.userId }, function (err, acc) {
        if (err)
            res.send(err)
        if (acc != null) {
            let alreadyExistsResponse = {
                userId: acc.userId
            }
            res.json(alreadyExistsResponse)
        } else {
            const new_Account = new Account(req.body)
            new_Account.save(function (err, account) {
                if (err)
                    res.send(err)
                res.status(201).json(account)
            })
        }
    })
}

