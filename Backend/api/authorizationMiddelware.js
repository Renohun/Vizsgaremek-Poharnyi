const DBconnetion = require('../database.js');
const jwt = require('jsonwebtoken');

//Lenyege a rendszernek, hogy ha a felhasznalo egyszer bejelentkezik akkor a 1 napig biztosan ne kelljen ujra,
// ez a refersh token segitsegevel oldhato meg,
// tehat ahanyszor egy olyan dolgot csinal amihez kell bejelentkezes annyiszor megnezzuk hogy be volt e mar jelentekezve,
// ha igen akkor mindenkeppen kap egy uj token amiben benne vannak az adatai amelyek a weboldalon esetleg hasznalunk kellene

async function AuthorizaitionMiddleware(req, res, next) {
    try {
        //hosszu tavu suti lekerese a requestbol
        const tokenAccess = req.cookies.auth_token_access;
        const tokenRefresh = req.cookies.auth_token;
        //extra ellenorzes reven van ez itt, ha esetleg valaki atirja a sutiben szereprlo erteket
        const query = 'SELECT Admin FROM felhasználó WHERE FelhID LIKE ?';
        //console.log('Jogositas: ' + JSON.stringify(jwt.decode(req.cookies.auth_token)));
        const payload = jwt.verify(tokenAccess, process.env.JWT_SECRET);
        const refreshPayload = jwt.decode(tokenRefresh);

        const [rows] = await DBconnetion.promise().query(query, [payload.userID]);
        const [rowsRefresh] = await DBconnetion.promise().query(query, [refreshPayload.userID]);

        if (rows[0].Admin == 0 && rowsRefresh[0].Admin == 0) {
            //atiranyotjuk ha a felhasznalo jogosultsaga nem meg felelo
            res.redirect('/jogosultsag');
        } else {
            next();
        }
    } catch (error) {
        //kotelezo bejelentkezes hiba eseten -- sutik torlesre kerulnek -- kidobjuk a felhasznalot
        res.clearCookie('auth_token');
        res.clearCookie('auth_token_access');
        console.log(error);
        res.redirect('/LepjBe');
    }
}
module.exports = AuthorizaitionMiddleware;
