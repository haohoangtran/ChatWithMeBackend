const router = require('express').Router();
router.use("/user", require('./user'));
router.use("/message", require('./message'));
module.exports = router;
