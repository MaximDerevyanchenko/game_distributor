module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const CountrySchema = new Schema({
        name: String,
        code: String
    })
    return mongoose.model('Country', CountrySchema, 'countries')
}
