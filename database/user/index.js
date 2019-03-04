const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, index: {unique: true}},
    password:String,
    date: {type: Date, default: Date.now},
    token: String,
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});
const User = mongoose.model('User', userSchema);
module.exports = User;