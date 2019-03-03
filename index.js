const express = require("express");
const bodyParser = require('body-parser');
const url = require("url");
const app = express();
const {log} = console;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const RES_JSON = {status: false, message: ""};
app.use("/api", require("./routers/api"));
app.listen(process.env.port || 6969, () => {
    log("chay roi");
});
// app.use(function (req, res, next) {
//     req.headers['if-none-match'] = '';
//     req.headers['if-modified-since'] = '';
//     const urlnow = url.parse(req.url).pathname;
//     if (!req.url.includes("/api/")) {
//         RES_JSON.status = false;
//         RES_JSON.message = "Có lỗi xảy ra, liên hệ quản trị viên. Mã lỗi: 0x04";
//         res.json(RES_JSON)
//     } else {
//         next();
//     }
// });
