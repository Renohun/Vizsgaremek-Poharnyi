const jwt = require('jsonwebtoken');
const DBconnetion = require('../database.js');

//Authenticator Middleware
async function AuthMiddleware(req, res, next) {
    const tokenAccess = req.cookies.auth_token_access;
    //console.log('Auth: ' + JSON.stringify(jwt.decode(token)));

    if (tokenAccess == null) {
        res.redirect('/LepjBe');
    } else {
        try {
            //ervenyesseg ellorzese (lejart, alairas)
            const payload = jwt.verify(tokenAccess, process.env.JWT_SECRET);

            //mivel a payload-ban csak a userID van eltarolva ezert az AdminStatuszt le kell kernunk az adatbazisbol!
            const query = 'SELECT Admin FROM felhasználó WHERE FelhID LIKE ?';
            const [rows] = await DBconnetion.promise().query(query, [payload.userID]);

            //uj tokent generalunk
            const newRefreshToken = jwt.sign(
                { userID: payload.userID, adminStatus: rows[0].Admin },
                process.env.JWT_SECRET_REFRESH,
                { expiresIn: '15m' }
            );

            res.cookie('auth_token', newRefreshToken, { httpOnly: true, sameSite: 'none', secure: true, path: '/' });

            next();
        } catch (error) {
            //kotelezo bejelentkezes hiba eseten -- sutik torlesre kerulnek
            console.log(error);
            res.clearCookie('auth_token');
            res.clearCookie('auth_token_access');
            res.redirect('/LepjBe');
        }
    }
}
module.exports = AuthMiddleware;
