module.exports = function(mongoose) {
    const Schema = mongoose.Schema
    const AccountSchema = new Schema({
        username: String,
        password: String,
        email: String,
        nickname: String,
        friends: [String],
        pendingRequests: [String],
        friendRequests: [String],
        state: String,
        inGame: String,
        isDeveloper: Boolean
    })
    return mongoose.model('AccountSchema', AccountSchema, 'accounts')
}
