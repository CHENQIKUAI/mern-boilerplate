var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const jwt = require("jsonwebtoken");
const sha1 = require("sha1")
const verifyToken = require("../middlewares/verifyToken")
const { userModel } = require("../lib/mongo")
var router = express.Router();

//jwt secretKey 
const SECRETKEY = config.SECRETKEY;
const EXPIRESIN = config.EXPIRESIN;

//FORMAT OF TOKEN
// Authorization: Bearer <access_token>

//登录
router.post('/', async (req, res, next) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }

    const theUser = await userModel.findOne({
        username: user.username
    })

    if (theUser !== null) {
        const isEqual = sha1(user.password) === theUser.password;
        if (isEqual) {
            const payload = { username: user.username };
            jwt.sign(payload, SECRETKEY, { expiresIn: EXPIRESIN }, (err, token) => {
                res.json({
                    token
                });
            });
        } else {
            res.json({
                message: '密码或账号错误'
            })
        }
        
    } else {
        res.status(422).send({
            message: '用户名不存在'
        });
    }
});

// 需要验证token，在注册成功后和登录成功后 使用软件功能的过程中
router.get('/', verifyToken, function (req, res, next) {
    jwt.verify(req.token, SECRETKEY, (err, authData) => {
        if (err) {
            console.log('error in verifyToken');
            res.json({
                status: "faild",
                msg: "token验证错误",
                err
            })
            res.sendStatus(403);
        } else {
            res.json({
                message: "Post created...",
                authData,
            })
        }
    })
});

module.exports = router;
