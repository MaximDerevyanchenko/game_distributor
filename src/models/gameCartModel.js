module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const GameCartSchema = new Schema({
        username: String,
        gameId: Number
    })
    return mongoose.model('GameCart', GameCartSchema, 'cart')
}
