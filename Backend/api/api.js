const express = require('express');
const DBconnetion = require('../database.js');
const argon = require('argon2');
const router = express.Router();

router.get('/test', (req, res) => {
    DBconnetion.query('SELECT * FROM felhasználó', (err, rows) => {
        if (err) {
            res.status(500).json({
                message: 'Hiba tortent lekeres kozben!'
            });
        } else {
            res.status(200).json({
                message: rows
            });
        }
    });
});
//Regisztracio oldalrol hoz ide majd tolti fel az adatokat az adatbazisba
router.post('/regisztracio', async (request, response) => {
    try {
        const hashed = await argon.hash(request.body.jelszo, { type: argon.argon2id });

        felhasznaloObj = {
            email: request.body.email,
            felhasznaloNev: request.body.felhasznaloNev,
            jelszo: hashed
        };

        console.log(felhasznaloObj.jelszo);

        const sqlQuery = 'INSERT INTO felhasználó (Felhasználónév, Email, Jelszó) VALUES (?,?,?)';

        DBconnetion.query(
            sqlQuery,
            [felhasznaloObj.felhasznaloNev, felhasznaloObj.email, felhasznaloObj.jelszo],
            (err, result) => {
                if (err) {
                    response.status(500).json({
                        message: 'Hiba tortent adat feltoltesnel!' + err
                    });
                } else {
                    response.status(200).json({
                        message: 'Sikeres adat feltoltes!',
                        result: result.insertId
                    });
                    console.log(
                        'Adatok melyek felettek toltve: ' +
                            felhasznaloObj.felhasznaloNev +
                            ' ' +
                            felhasznaloObj.email +
                            ' ' +
                            felhasznaloObj.jelszo
                    );
                }
            }
        );
    } catch (err) {
        console.log('Valamilyen extra hiba tortent: ' + err);
    }
});

router.post('/belepes', async (request, response) => {
    try {
        const felhasznaloObj = {
            felhasznalo: request.body.felhasznalo,
            jelszo: request.body.jelszo
        };
        const sqlQuery = 'SELECT * FROM felhasználó WHERE Email LIKE ?';

        DBconnetion.query(sqlQuery, [felhasznaloObj.felhasznalo], async (err, rows) => {
            if (err) {
                response.status(500).json({
                    message: 'Adatbazissal kapcsolatos hiba!'
                });
            } else {
                const felhasznaloDB = rows[0];
                const jelszoEll = await argon.verify(felhasznaloDB.Jelszó, felhasznaloObj.jelszo);

                if (felhasznaloDB == undefined) {
                    response.status(401).json({ message: 'Hibas email!' });
                }

                if (jelszoEll) {
                    response.status(200).json({
                        message: 'Sikeres belepes!'
                    });
                } else {
                    response.status(401).json({
                        message: 'Hibas jelszo'
                    });
                }
            }
        });
    } catch (err) {
        console.log('Valami egyeb hiba tortent: ' + err);
    }
});
module.exports = router;
