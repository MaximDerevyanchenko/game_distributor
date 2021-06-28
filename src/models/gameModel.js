module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const GameSchema = new Schema({
        gameId: Number,
		name: String,
        isLocal: Boolean,
        developers: [String],
        publishers: [String],
        is_free: Boolean,
        short_description: String,
        price_overview: {
            final: Number,
            final_formatted: String,
            discount_percent: Number
        },
        header_image: String
    })
    return mongoose.model('GameSchema', GameSchema, 'games')
}
