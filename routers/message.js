const router = require('express').Router();
const Queue = require("../queue");
const Utils = require('../utils')
const Database = require("../database");
const {getToken, verifyToken} = require("../utils")
router.get("/", (req, res) => {
    let user = verifyToken(req.headers.usertoken)
    Database.getMessage(user._id, (msg) => {
        res.json(msg);
    });
});
router.get("/endchat", (req, res) => {
    let user = verifyToken(req.headers.usertoken);
    Database.findUser(user._id, u => {
        Database.endChat(u._id, u.connected._id, () => {
            res.json({status: true, message: "OK"});
            Database.findUser(user._id, (u) => {
                Utils.pushNotification(u.token, "Thông báo", message, {
                    title: "Người lạ",
                    body: "Cuộc trò truyện đã kết thúc, ấn /end để bắt đầu"
                });
            });
            Database.findUser(u._id, (u) => {
                Utils.pushNotification(u.token, "Thông báo", message, {
                    title: "Người lạ",
                    body: "Cuộc trò truyện đã kết thúc, ấn /end để bắt đầu"
                });
            });
        })
    });
});
router.get('/goqueue', (req, res) => {
    let user = verifyToken(req.headers.usertoken);
    Database.findUser(user._id, (u) => {
        if (u.connected) {
            res.json({status: false, message: "Bạn vui lòng end cuộc trò truyện"});
        } else {
            Queue.addMember(user._id);
            res.json({status: true, message: "Thành công"});
        }
    })


});
router.post("/send", (req, res) => {
    let user = verifyToken(req.headers.usertoken);
    let {message} = req.body;
    if (!message || message.trim()) {
        return res.json({status: false, message: "Nội dung trống"})
    }
    message = message.trim();
    Database.findUser(user._id, (doc) => {
        let obj = doc.toObject();
        if (obj) {
            let to = doc.connected;
            if (to) {
                Database.addMessage(user._id, to._id, message, () => {
                    res.json({status: true, message: "thành công!"});
                    //TODO: THÔNG BÁO noti đến thằng nhận  thôi nhé
                    Database.findUser(to._id, (u) => {
                        Utils.pushNotification(u.token, "Người lạ", message, {title: "Người lạ", body: message})
                    });
                });
            } else {
                res.json({status: false, message: "Cuộc trò truyện đã kết thúc, /end để bắt đầu."})
            }

        }
    })
})
module.exports = router;
