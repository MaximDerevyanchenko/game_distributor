module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const GameWishlistSchema = new Schema({
        username: String,
        gameId: Number
    })
    return mongoose.model('GameWishlist', GameWishlistSchema, 'wishlist')
}
