module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const GameLibrarySchema = new Schema({
        username: String,
        gameId: String
    });
    return mongoose.model('GameLibrary', GameLibrarySchema, 'library')
}
