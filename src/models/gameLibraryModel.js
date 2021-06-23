module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const GameLibrarySchema = new Schema({
        username: String,
        gameId: Number,
        timePlayed: Number,
        name: String
    });
    return mongoose.model('GameLibrary', GameLibrarySchema, 'library')
}
