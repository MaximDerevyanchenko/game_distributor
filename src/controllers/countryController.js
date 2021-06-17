module.exports = function (mongoose, io) {
    const Country = require("../models/countryModel.js")(mongoose)

    module.exports.getCountries = function (req, res) {
        Country.find()
            .then(countries => res.json(countries))
            .catch(err => res.send(err))
    }
}
