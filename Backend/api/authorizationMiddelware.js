const DBconnetion = require('../database.js');

function AuthorizaitionMiddleware(req, res, next) {
    const query = 'SELECT Admin FROM felhasználó WHERE FelhID LIKE ?';
    //console.log(req.data.userID);

    DBconnetion.query(query, [req.data.userID], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Hibas adatbazis eleres' });
        }
        //console.log(rows[0].Admin);

        if (req.data && req.data.adminStatus == 1 && rows[0].Admin == 1) {
            next();
        } else {
            res.status(403).json({
                message: 'Nincs jogod'
            });
        }
    });
}
module.exports = AuthorizaitionMiddleware;
