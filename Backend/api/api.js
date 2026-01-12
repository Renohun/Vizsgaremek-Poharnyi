const express = require('express');
const DBconnetion = require('../database.js');
const argon = require('argon2');
const router = express.Router();
const JWT = require('jsonwebtoken');
const authenticationMiddleware = require('./authenticationMiddleware.js');
const authorizationMiddelware = require('./authorizationMiddelware.js');

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

        felhasznaloObjReg = {
            email: request.body.email,
            felhasznaloNev: request.body.felhasznaloNev,
            jelszo: hashed
        };

        //console.log(felhasznaloObjReg.jelszo);

        const sqlQuery = 'INSERT INTO felhasználó (Felhasználónév, Email, Jelszó) VALUES (?,?,?)';

        DBconnetion.query(
            sqlQuery,
            [felhasznaloObjReg.felhasznaloNev, felhasznaloObjReg.email, felhasznaloObjReg.jelszo],
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
                            felhasznaloObjReg.felhasznaloNev +
                            ' ' +
                            felhasznaloObjReg.email +
                            ' ' +
                            felhasznaloObjReg.jelszo
                    );
                }
            }
        );
    } catch (err) {
        console.log('Valamilyen extra hiba tortent: ' + err);
    }
});
//A belepes oldal hoz ide, lekeri azt a sort amiben a felhasznalo adatai vannak, persz ha van ilyen egyaltalan
router.post('/belepes', async (request, response) => {
    try {
        const felhasznaloObj = {
            felhasznalo: request.body.email,
            jelszo: request.body.jelszo
        };
        const sqlQuery = 'SELECT * FROM felhasználó WHERE Email LIKE ?';

        DBconnetion.query(sqlQuery, [felhasznaloObj.felhasznalo], async (err, rows) => {
            if (err) {
                response.status(500).json({
                    message: 'Adatbazissal kapcsolatos hiba!'
                });
            } else {
                //ez az adatbazisbol kapott felhasznaloi sor
                const felhasznaloDB = rows[0];
                //console.log(felhasznaloDB);

                if (felhasznaloDB == undefined) {
                    response.status(200).json({ message: 'Hibas email! Avagy nem letezik ilyen felhasznalo' });
                } else {
                    //megnezi az argon package ellenorzi hogy az eltarolt jelszo megegyezik a beirt jelszoval
                    const jelszoEll = await argon.verify(felhasznaloDB.Jelszó, felhasznaloObj.jelszo);
                    if (jelszoEll) {
                        //web token letrehozasa
                        const WebToken = JWT.sign(
                            {
                                userID: felhasznaloDB.FelhID,
                                adminStatus: felhasznaloDB.Admin
                            },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: '1h'
                            }
                        );

                        //sutibe valo betetele
                        response.cookie('auth_token', WebToken, {
                            httpOnly: 'true',
                            sameSite: 'none',
                            secure: 'true',
                            path: '/'
                        });

                        response.status(200).json({
                            message: 'Sikeres bejelentkezes'
                        });
                    } else {
                        response.status(200).json({
                            message: 'Hibas jelszo'
                        });
                    }
                }
            }
        });
    } catch (err) {
        console.log('Valami egyeb hiba tortent: ' + err);
    }
});

//jelentesek endpoint
router.post('/AdminPanel/jelentesek', authenticationMiddleware, authorizationMiddelware, async (req, res) => {
    try {
        let query =
            'SELECT JelentettTartalomID,JelentesTipusa,JelentesIdopontja,JelentesAllapota, JelentoID, JelentettID FROM jelentesek WHERE JelentesAllapota LIKE 0';
        let kommentjel = 'SELECT Keszito,Tartalom FROM komment WHERE KommentID LIKE ?';
        let felhjel = 'SELECT FelhID, Felhasználónév FROM felhasználó WHERE FelhID LIKE ?';
        let kokteljel = 'SELECT * FROM koktél WHERE KoktélID LIKE ?';
        //Adattárolók
        let jelentesek = [];
        let komment = [];
        let koktel = [];
        let ember = [];

        await DBconnetion.promise()
            .query(query)
            .then(([rows]) => {
                jelentesek.push(rows);
            });

        console.log(jelentesek[0]);
        for (let i = 0; i < jelentesek[0].length; i++) {
            if (jelentesek[0][i].JelentesTipusa == 'Koktél') {
                await DBconnetion.promise()
                    .query(kokteljel, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        koktel.push(rows);
                    });
            } else if (jelentesek[0][i].JelentesTipusa == 'Felhasználó') {
                await DBconnetion.promise()
                    .query(felhjel, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        ember.push(rows);
                    });
            } else {
                await DBconnetion.promise()
                    .query(kommentjel, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        komment.push(rows);
                    });
            }
        }

        res.status(200).json({
            kommentek: komment,
            koktelok: koktel,
            felhasznalok: ember
        });
    } catch (err) {
        res.status(500).json({
            message: 'Hibas vegpont eleres',
            error: err
        });
    }
});

//
//
//
//ADATLAP
//
//
//
router.get('/AdatlapLekeres/FelhAdatok/:id', async (request, response) => {
    //A Lekérés definiálása
    let query =
        'SELECT Felhasználónév,Email,Jelszó,ProfilkepUtvonal,RegisztracioDatuma from felhasználó WHERE FelhID LIKE ?;SELECT COUNT(KiKedvelteID) AS KEDVID from kedvencek where KiKedvelteID like ? ;SELECT COUNT(Keszito) AS KOMMID from komment where Keszito like ?;SELECT COUNT(Keszito) AS RATEID from ertekeles where Keszito like ?;SELECT COUNT(Keszito) AS MAKEID from koktél where Keszito like ?;';
    let ertekek = [];
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    for (let i = 0; i < 5; i++) {
        ertekek.push(request.params.id);
    }
    //Lekérdezés
    DBconnetion.query(query, ertekek, async (err, rows) => {
        if (err) {
            response.status(500).json({
                message: 'Hiba tortent lekeres kozben!',
                hiba: err
            });
        } else {
            response.status(200).json({
                message: 'Sikeres Lekérés!',
                tartalom: rows
            });
        }
    });
});

router.get('/AdatlapLekeres/Kedvencek/:id', async (request, response) => {
    //A Lekérés definiálása
    let query1 = 'SELECT KoktélID,KoktelCim,BoritoKepUtvonal from koktél where Keszito like ?';
    let query2 = 'SELECT AVG(Ertekeles) as Osszert from ertekeles where HovaIrták like ?';
    let query3 = 'SELECT Osszetevő from koktelokosszetevoi where KoktélID like ?';
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    let felhaszanalo = request.params.id;
    let kokteladatok;
    let ertekelesek = [];
    let osszetevok = [];
    //Lekérdezés
    try {
        await DBconnetion.promise()
            .query(query1, felhaszanalo)
            .then(([rows]) => {
                kokteladatok = rows;
            });
        for (let i = 0; i < kokteladatok.length; i++) {
            await DBconnetion.promise()
                .query(query2, kokteladatok[i].KoktélID)
                .then(([rows]) => {
                    ertekelesek.push(rows);
                });
            await DBconnetion.promise()
                .query(query3, kokteladatok[i].KoktélID)
                .then(([rows]) => {
                    osszetevok.push(rows);
                });
        }
        response.status(200).json({
            message: 'siker!',
            adat: kokteladatok,
            ertek: ertekelesek,
            ossztev: osszetevok
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba'
        });
    }
});
router.get('/AdatlapLekeres/Koktelok/:id', async (request, response) => {
    //A Lekérés definiálása
    let query1 = 'SELECT KoktélID,KoktelCim,BoritoKepUtvonal from koktél where Keszito like ?';
    let query2 = 'SELECT AVG(Ertekeles) as Osszert from ertekeles where HovaIrták like ?';
    let query3 = 'SELECT Count(HovaIrták) as KommNum from komment where HovaIrták like ?';
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    let felhaszanalo = request.params.id;
    let kokteladatok;
    let ertekelesek = [];
    let kommentek = [];
    //Lekérdezés
    try {
        await DBconnetion.promise()
            .query(query1, felhaszanalo)
            .then(([rows]) => {
                kokteladatok = rows;
            });
        for (let i = 0; i < kokteladatok.length; i++) {
            await DBconnetion.promise()
                .query(query2, kokteladatok[i].KoktélID)
                .then(([rows]) => {
                    ertekelesek.push(rows);
                });
            await DBconnetion.promise()
                .query(query3, kokteladatok[i].KoktélID)
                .then(([rows]) => {
                    kommentek.push(rows);
                });
        }
        response.status(200).json({
            message: 'siker!',
            adat: kokteladatok,
            ertek: ertekelesek,
            kommnum: kommentek
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba'
        });
    }
});

router.get('/AdatlapLekeres/Jelentesek/:id', async (request, response) => {
    //A Lekérések definiálása
    let query =
        'SELECT JelentettTartalomID,JelentesTipusa,JelentesIdopontja,JelentesAllapota FROM jelentesek WHERE JelentoID LIKE ?';
    let kommentjel = 'SELECT Keszito,Tartalom FROM komment WHERE KommentID LIKE ?';
    let felhjel = 'SELECT Felhasználónév FROM felhasználó WHERE FelhID LIKE ?';
    let kokteljel = 'SELECT KoktelCim,Keszito FROM koktél WHERE KoktélID LIKE ?';
    //Adattárolók
    let felhaszanalo = request.params.id;
    let jelentesek = [];
    let komment = [];
    let koktel = [];
    let ember = [];
    //Lekérdezés
    try {
        await DBconnetion.promise()
            .query(query, felhaszanalo)
            .then(([rows]) => {
                jelentesek.push(rows);
            });
        console.log(jelentesek[0]);
        for (let i = 0; i < jelentesek[0].length; i++) {
            if (jelentesek[0][i].JelentesTipusa == 'Koktél') {
                await DBconnetion.promise()
                    .query(kokteljel, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        koktel.push(rows);
                    });
            } else if (jelentesek[0][i].JelentesTipusa == 'Felhasználó') {
                await DBconnetion.promise()
                    .query(felhjel, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        ember.push(rows);
                    });
            } else {
                await DBconnetion.promise()
                    .query(kommentjel, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        komment.push(rows);
                    });
            }
        }

        //sorrendbe rendezve..
        response.status(200).json({
            message: 'siker!',
            adat: jelentesek
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba',
            hiba: error
        });
    }
});
router.get('/AdatlapLekeres/Kosar/:id', async (request, response) => {
    //Lekérések
    let KosarLekeres = 'SELECT SessionID FROM kosár WHERE UserID LIKE ?';
    let KosarTermekLekeres = 'SELECT TermekID,Darabszam,EgysegAr FROM kosártermék WHERE KosarID LIKE ?';
    let TermekLekeres = 'SELECT TermekCim,TermekLeiras FROM webshoptermek WHERE TermekID LIKE ?';
    //Adattárolók
    let vasarlo = request.params.id;
    let kosar;
    let kosartermekek;
    let termekek = [];
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?

    //Lekérdezés
    try {
        await DBconnetion.promise()
            .query(KosarLekeres, vasarlo)
            .then(([rows]) => {
                kosar = rows[0].SessionID;
            });
        await DBconnetion.promise()
            .query(KosarTermekLekeres, kosar)
            .then(([rows]) => {
                kosartermekek = rows;
            });
        for (let i = 0; i < kosartermekek.length; i++) {
            await DBconnetion.promise()
                .query(TermekLekeres, kosartermekek[i].TermekID)
                .then(([rows]) => {
                    termekek.push(rows[0]);
                });
        }
        response.status(200).json({
            message: 'Sikeres Lekérés!',
            kosár: kosartermekek,
            termekek: termekek
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba Történt!',
            hiba: error
        });
    }
});
//
//
//
//ADATLAP VÉGE
//
//
//
module.exports = router;
