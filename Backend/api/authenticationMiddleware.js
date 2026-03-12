const jwt = require('jsonwebtoken');

//Authenticator Middleware
function AuthMiddleware(req, res, next) {
    const token = req.cookies.auth_token;
    console.log('Auth: ' + JSON.stringify(jwt.decode(token)));

    if (!token) {
        res.redirect('/LepjBe');
    } else {
        try {
            //ervenyesseg ellorzese (lejart, alairas)
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.data = payload;
            next();
        } catch (error) {
            res.redirect('/KoktelHiba');
        }
    }
}
module.exports = AuthMiddleware;
