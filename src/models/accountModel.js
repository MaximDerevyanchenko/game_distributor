module.exports = function(mongoose) {
    const Schema = mongoose.Schema;
    const AccountSchema = new Schema({
        userId: String,
        password: String,
        email: String,
        nickname: String
    });
    return mongoose.model('AccountSchema', AccountSchema, 'accounts');
};
