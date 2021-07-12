module.exports = function (mongoose, _) {
    const Country = mongoose.model('Country')

    module.exports.getCountries = function (req, res) {
        Country.find()
            .then(countries => res.json(countries))
            .catch(err => res.send(err))
    }
}
