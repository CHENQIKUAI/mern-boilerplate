var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken")
const { userModel } = require("../lib/mongo")
var router = express.Router();

//jwt secretKey 
const SECRETKEY = config.SECRETKEY;


//验证是否有token，token是否正确
router.get('/', verifyToken, (req, res, next) => {
    jwt.verify(req.token, SECRETKEY, async (err, authData) => {
        if (err) {
            res.json({
                status: "faild",
                msg: "token验证错误",
                err
            })
            res.sendStatus(403);
        } else {
            const { username } = authData;
            const theUser = await userModel.findOne({ username });
            res.json({
                message: 'the profile message...',
                theUser,
            })
        }
    })
});

module.exports = router;
