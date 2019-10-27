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

module.exports = verifyToken;