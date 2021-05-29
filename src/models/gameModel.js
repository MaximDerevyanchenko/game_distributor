module.exports = function(mongoose) {
    const Schema = mongoose.Schema;
    const GameSchema = new Schema({
        appid: Number,
		name: String
    });
    return mongoose.model('GameSchema', GameSchema, 'games');
};
