const jwt = require('jsonwebtoken');
const secretKey = "secretkey";

function verifyToken(req, res, next) {
    jwt.verify(req.cookies.jwttoken, secretKey, async (err, authData) => {
        if (err) {
            req.token = 0;
            next();
        } else {
            req.token = 1;
            req.authData = authData;
            next();
        }
    });
}

module.exports = verifyToken;
