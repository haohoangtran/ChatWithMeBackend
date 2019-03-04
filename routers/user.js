const router = require('express').Router();
const Database = require("../database");
const Utils = require("../utils");
router.get("/", (req, res) => {
    res.send("hi")
});
router.post("/login", (req, res) => {
    const {username, password, token} = req.body;
    Database.login(username, Utils.md5(password), token, (err, doc) => {
        let json = {status: true, message: "Xu ly thanh cong", token: ""};
        if (err) {
            json.status = false;
            json.message = "Có lỗi xảy ra";
        } else if (!doc) {
            json.message = "Tên tài khoản hoặc mật khẩu không đúng";
            json.status = false;
        } else json.token = Utils.getToken(doc.toObject());
        res.json(json);
    });
});
router.post("/register", (req, res) => {
    const {username, password} = req.body;
    Database.register(username, Utils.md5(password), (err) => {
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