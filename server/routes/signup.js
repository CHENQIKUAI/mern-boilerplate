var express = require('express');
const config = require('config-lite')(__dirname);//读取配置
const jwt = require("jsonwebtoken");
const { userModel } = require("../lib/mongo")
var router = express.Router();

//jwt secretKey 
const SECRETKEY = config.SECRETKEY;
const EXPIRESIN = config.EXPIRESIN;

//FORMAT OF TOKEN
// Authorization: Bearer <access_token>

//需要生成token， 在注册和登录业务中
router.post('/', async (req, res, next) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }

    const theUser = await userModel.findOne({
        username: user.username
    })

    if (theUser === null) {//如果用户不存在，则将数据存入数据库，并且生成token
        //1. 则将数据存入数据库
        const createdUser = await userModel.create(user);
        console.log(createdUser, "created...");
        

        //2. 并且生成token
        const payload = { username: user.username };
        jwt.sign(payload, SECRETKEY, { expiresIn: EXPIRESIN }, (err, token) => {
            //3. 返回token
            res.json({
                token
            });
        });
    } else {//如果用户名存在，则返回错误信息
        res.status(422).send({
            message: '用户名已被使用'
        });
    }
});

module.exports = router;
