const router = require('express').Router();
const Database = require("../database");
const Utils = require("../utils");
router.get("/", (req, res) => {
    res.send("hi")
});
router.post("/login", (req, res) => {
    const {username, password, token} = req.body;
    Database.login(username.toLowerCase(), Utils.md5(password), token, (err, doc) => {
        let json = {status: true, message: "Xu ly thanh cong", token: ""};
        if (err) {
            json.status = false;
            json.message = "Có lỗi xảy ra";
        } else if (!doc) {
            json.message = "Tên tài khoản hoặc mật khẩu không đúng";
            json.status = false;
        } else {
            let user = doc.toObject();
            delete user.messages;
            json.token = Utils.getToken(user);
        }
        res.json(json);
    });
});
router.post("/register", (req, res) => {
    const {username, password} = req.body;
    Database.register(username.toLowerCase(), Utils.md5(password), (err, user) => {
        const obj = {status: true, message: "Xu ly thanh cong"};
        if (err) {
            obj.message = err;
            obj.status = false;
            if (err.code === 11000) {
                obj.message = "Username đã tồn tại, vui lòng thử với tên khác."
            }
        }
        res.json(obj);
    });
});
module.exports = router;