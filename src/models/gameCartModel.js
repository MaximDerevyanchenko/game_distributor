module.exports = function(mongoose) {
    const Schema = mongoose.Schema;
    const GameCartSchema = new Schema({
        username: String,
        gameId: String
    });
    return mongoose.model('GameCart', GameCartSchema, 'cart');
};
