const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: {type: Schema.Types.ObjectId, ref: 'User'},
    to: {type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
    message: String
});
const Message = mongoose.model('Message', messageSchema);
module.exports = User;