var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");


//jwt secretKey 
const SECRETKEY = "SECRETKEY";
const EXPIRESIN = "30s";

//FORMAT OF TOKEN
// Authorization: Bearer <access_token>

const verifyToken = (req, res, next) => {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Checkif bearer is undefined 
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        // Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        next();
    } else {
        //Forbidden
        res.json({
            status: "faild",
            msg: "verifToken错误",
        })
    }
}

//需要生成token， 在注册和登录业务中
router.post('/', function (req, res, next) {
    const user = {
        id: 1,
        username: "bearer",
        email: 'bearer@gmail.com'
    }
    jwt.sign({ user }, SECRETKEY, { expiresIn: EXPIRESIN }, (err, token) => {
        res.json({
            token
        });
    });
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
