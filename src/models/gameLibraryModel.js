module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const GameLibrarySchema = new Schema({
        username: String,
        gameId: Number,
        isLocal: Boolean,
        startedAt: Number,
        timePlayed: Number,
        name: String,
        giftedBy: String
    });
    return mongoose.model('GameLibrary', GameLibrarySchema, 'library')
}
