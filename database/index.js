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
        const user = new User({
            username,
            password
        });
        user.save((err) => {
            User.update(
                {_id: user._id},
                {
                    $push: {
                        messages: {
                            from: mongoose.Types.ObjectId(user._id),
                            message: CONFIG.DEFAULT_HELP["/help"],
                            system: true,
                        }
                    }
                }, (err, doc) => {
                    console.log(err, user)
                }
            );
            callback(err);
        })
    }

    updateConnected(from, to, callback) {
        User.findOneAndUpdate({_id: from}, {
            connected: mongoose.Types.ObjectId(to),
            $push: {
                messages: {
                    from: mongoose.Types.ObjectId(from),
                    message: "Người lạ đã tham gia cuộc trò truyện!",
                    system: true
                }
            }
        }, {new: true}, () => {
            User.findOneAndUpdate({_id: to}, {
                connected: mongoose.Types.ObjectId(from),
                $push: {
                    messages: {
                        from: mongoose.Types.ObjectId(to),
                        message: "Người lạ đã tham gia cuộc trò truyện!",
                        system: true
                    }
                }
            }, {new: true}, callback);
        });
    }

    goqueue(from, callback) {
        User.findOneAndUpdate({_id: from}, {
            $push: {
                messages: {
                    from: mongoose.Types.ObjectId(from),
                    message: "Đang tìm kiếm, vui lòng đợi...",
                    system: true
                }
            }
        }, {new: true}, callback);
    }

    addMessage(from, to, message, callback) {
        User.update(
            {_id: from},
            {
                $push: {
                    messages: {
                        from: mongoose.Types.ObjectId(from),
                        message: message
                    }
                }
            }, (err, doc) => {
                User.update(
                    {_id: to},
                    {
                        $push: {
                            messages: {
                                from: mongoose.Types.ObjectId(from),
                                message: message
                            }
                        }
                    }, callback
                );
            }
        );

    }

    findUser(_id, callback) {
        User.findOne({_id}, (err, doc) => {
            callback(doc);
        })
    }

    endChat(from, to, callback) {
        User.findOneAndUpdate({_id: from}, {
            connected: null, $push: {
                messages: {
                    from: mongoose.Types.ObjectId(from),
                    message: "Cuộc trò truyện đã kết thúc, /start để bắt đầu",
                    system: true
                }
            }
        }, {new: true}, () => {
            User.findOneAndUpdate({_id: to}, {
                connected: null, $push: {
                    messages: {
                        from: mongoose.Types.ObjectId(from),
                        message: "Cuộc trò truyện đã kết thúc, /start để bắt đầu",
                        system: true
                    }
                }
            }, {new: true}, callback);
        });
    }

    getMessage(_id, callback) {
        User.findOne({_id}, (err, doc) => {
            callback(doc ? doc.messages.reverse() : [])
        })
        // .populate('messages')
        // .exec(function (err, doc) {
        //
        // });
    }
}

module.exports = new Database();



