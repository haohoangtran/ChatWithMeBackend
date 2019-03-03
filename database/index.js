const mongoose = require('mongoose');
const CONFIG = require('../config');
const User = require("./user");
mongoose.set('useCreateIndex', true);
mongoose.connect(CONFIG.CONNECTION_STRING, {useNewUrlParser: true}, err => {
    console.log(err ? err : "Kết nối db")
});

class Database {
    login(username, password, callback) {
        User.findOne({username, password}, callback);
    }

    register(username, password, callback) {
        const user = new User({username, password});
        user.save(callback)
    }
}

module.exports = new Database();



