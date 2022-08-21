const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = function(req, res, next) {
    let authorization = req.headers.authorization.split(' ');
    const type = authorization[0];
    const token = authorization[1];

    if(type !== 'Bearer'){
        res.status(401).send();
        return false;
    }else{
        const payload = jwt.verify(token, process.env.jwtSecret);
        req.user = payload.user;
        next();
    }
}