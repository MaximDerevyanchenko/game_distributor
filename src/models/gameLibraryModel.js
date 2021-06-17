module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const GameLibrarySchema = new Schema({
        username: String,
        gameId: Number,
        name: String
    });
    return mongoose.model('GameLibrary', GameLibrarySchema, 'library')
}
