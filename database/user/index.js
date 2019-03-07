const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, index: {unique: true}},
    password: String,
    date: {type: Date, default: Date.now},
    token: String,
    connected: {type: Schema.Types.ObjectId, ref: 'User'},
    messages: [{
        from: {type: Schema.Types.ObjectId, ref: 'User'},
        date: {type: Date, default: Date.now},
        message: String,
        system: {type: Boolean, default: false}
    }]
});
const User = mongoose.model('User', userSchema);
module.exports = User;