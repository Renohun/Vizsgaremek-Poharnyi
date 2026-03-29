const DBconnetion = require('../database.js');
const jwt = require('jsonwebtoken');

function AuthorizaitionMiddleware(req, res, next) {
    const query = 'SELECT Admin FROM felhasználó WHERE FelhID LIKE ?';
    console.log('Jogositas: ' + JSON.stringify(jwt.decode(req.cookies.auth_token)));

    DBconnetion.query(query, [req.data.userID], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Hibas adatbazis eleres' });
        }
        //console.log(rows[0].Admin);

        if (req.data && req.data.adminStatus == 1 && rows[0].Admin == 1) {
            next();
        } else {
            //ehelyett majd egy koktelHiba szeru helyre kell atvinni a user-t
            res.redirect('/jogosultsag');
        }
    });
}
module.exports = AuthorizaitionMiddleware;
