const mongoose = require('mongoose');
const CONFIG = require('../config');
const User = require("./user");
const Message = require("./message");
mongoose.set('useCreateIndex', true);
mongoose.connect(CONFIG.CONNECTION_STRING, {useNewUrlParser: true}, err => {
    console.log(err ? err : "Kết nối db")
});

class Database {
    login(username, password, token, callback) {
        User.findOneAndUpdate({username, password}, {token}, {new: true}, callback);
    }

    register(username, password, callback) {
        const user = new User({username, password});
        user.save(callback)
    }
}

module.exports = new Database();



