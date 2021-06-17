module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const GameSchema = new Schema({
        gameId: Number,
		name: String,
        isLocal: Boolean
    })
    return mongoose.model('GameSchema', GameSchema, 'games')
}
