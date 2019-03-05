const router = require('express').Router();
const Queue = require("../queue");
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
            res.json({status: true, message: "OK"})
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
    Database.findUser(user._id, (doc) => {
        let obj = doc.toObject();
        if (obj) {
            let to = doc.connected;
            if (to) {
                Database.addMessage(user._id, to._id, message, () => {
                    res.json({status: true, message: "thành công!"});
                    //TODO: THÔNG BÁO
                });
            } else {
                res.json({status: false, message: "Cuộc trò truyện đã kết thúc, /end để bắt đầu."})
            }

        }
    })
})
module.exports = router;
