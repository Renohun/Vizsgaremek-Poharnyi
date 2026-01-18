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
                    } 
                    else {
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

//AdminPanel - jelentesek endpoint
router.post('/AdminPanel/jelentesek', authenticationMiddleware, authorizationMiddelware, async (req, res) => {
    try {
        let query =
            'SELECT JelentesID, JelentettTartalomID,JelentesTipusa,JelentesIdopontja,JelentesAllapota FROM jelentesek WHERE JelentesAllapota LIKE 0 ORDER BY JelentesMennyisege DESC';

        let jelentesIndokaQuery = 'SELECT JelentesIndoka FROM jelentők WHERE JelentésID LIKE ?';

        let kommentjel =
            'SELECT felhasználó.Felhasználónév, Tartalom FROM komment INNER JOIN felhasználó ON felhasználó.FelhID = komment.Keszito WHERE KommentID LIKE ? AND MilyenDologhoz LIKE "Koktél"';
        let felhjel = 'SELECT FelhID, Felhasználónév, Email, RegisztracioDatuma FROM felhasználó WHERE FelhID LIKE ?';
        let kokteljel =
            'SELECT koktél.KoktélID, koktél.Keszito, koktél.KeszitesDatuma, koktél.KoktelCim, koktél.Alap, koktél.Recept, felhasználó.FelhasználóNév FROM koktél INNER JOIN felhasználó ON felhasználó.FelhID = koktél.Keszito WHERE koktél.KoktélID LIKE ?';
        let koktelOsszeetevokQuery =
            'SELECT koktelokosszetevoi.Osszetevő FROM koktelokosszetevoi INNER JOIN koktél ON koktél.KoktélID = koktelokosszetevoi.KoktélID WHERE koktél.KoktélID LIKE ?';
        let ErtekelesQuery =
            'SELECT AVG(Ertekeles) as Osszert from ertekeles where HovaIrták like ? AND MilyenDologhoz LIKE "Koktél"';
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

        //Tombon beluli tombrol van szo
        //console.log(jelentesek[0]);

        for (let i = 0; i < jelentesek[0].length; i++) {
            if (jelentesek[0][i].JelentesTipusa == 'Koktél') {
                let koktelOsszevtokTomb = [];
                let jelentesIndokaTomb = [];
                let eretekelTomb = [];

                //console.log(jelentesek[0][i].JelentesID);

                await DBconnetion.promise()
                    .query(ErtekelesQuery, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        //jelentesek[0][i].push(rows);
                        eretekelTomb.push(rows);
                    });

                await DBconnetion.promise()
                    .query(jelentesIndokaQuery, jelentesek[0][i].JelentesID)
                    .then(([rows]) => {
                        //console.log(rows);
                        jelentesIndokaTomb.push(rows);
                    });

                await DBconnetion.promise()
                    .query(koktelOsszeetevokQuery, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        //console.log(rowsOsszetecok);
                        koktelOsszevtokTomb.push(rows);
                    });

                await DBconnetion.promise()
                    .query(kokteljel, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        //console.log(rows[0]);
                        koktel.push(jelentesek[0][i].JelentesID);
                        //console.log(koktelOsszevtokTomb);
                        rows[0].ertekeles = eretekelTomb;
                        rows[0].jelentesIndokok = jelentesIndokaTomb;
                        rows[0].osszetevok = koktelOsszevtokTomb;
                        koktel.push(rows);
                    });
            } else if (jelentesek[0][i].JelentesTipusa == 'Felhasználó') {
                let jelentesIndokaTomb = [];

                await DBconnetion.promise()
                    .query(jelentesIndokaQuery, jelentesek[0][i].JelentesID)
                    .then(([rows]) => {
                        //console.log(rows);
                        jelentesIndokaTomb.push(rows);
                    });

                await DBconnetion.promise()
                    .query(felhjel, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        ember.push(jelentesek[0][i].JelentesID);
                        rows[0].jelentesIndokok = jelentesIndokaTomb;
                        ember.push(rows);
                    });
            } else {
                let jelentesIndokaTomb = [];

                await DBconnetion.promise()
                    .query(jelentesIndokaQuery, jelentesek[0][i].JelentesID)
                    .then(([rows]) => {
                        //console.log(rows);
                        jelentesIndokaTomb.push(rows);
                    });

                await DBconnetion.promise()
                    .query(kommentjel, jelentesek[0][i].JelentettTartalomID)
                    .then(([rows]) => {
                        komment.push(jelentesek[0][i].JelentesID);
                        rows[0].jelentesIndokok = jelentesIndokaTomb;
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
//AdnminPanel - jelentesek - elfogadas
router.post(
    '/AdminPanel/jelentesek/elfogadas/:jelentesID',
    authenticationMiddleware,
    authorizationMiddelware,
    (req, res) => {
        try {
            const { jelentesID } = req.params;

            const tipusQuery = 'SELECT JelentesTipusa FROM jelentesek WHERE JelentesID LIKE ?';

            DBconnetion.query(tipusQuery, [jelentesID], (err, rowsTipus) => {
                if (err) {
                    res.status(500).json({ message: 'Nincs ilyen felhasznalo', error: err });
                } else {
                    const query = 'UPDATE Jelentesek SET JelentesAllapota = 2 WHERE JelentesID LIKE ?';
                    DBconnetion.query(query, [jelentesID], (err) => {
                        if (err) {
                            res.status(500).json({
                                error: err,
                                message: 'Adatbazissal kapcsolatos hiba tortent!'
                            });
                        } else {
                            res.status(200).json({
                                message: 'Adat megvaltoztatva sikeresen',
                                tipus: rowsTipus,
                                bool: true
                            });
                        }
                    });
                }
            });
        } catch (err) {
            res.status(500).json({
                error: err
            });
        }
    }
);
//AdminPanel - Jelentesek - elutasitasa
router.post(
    '/AdminPanel/jelentesek/elutasitas/:jelentesID',
    authenticationMiddleware,
    authorizationMiddelware,
    (req, res) => {
        try {
            const { jelentesID } = req.params;

            const tipusQuery = 'SELECT JelentesTipusa FROM jelentesek WHERE JelentesID LIKE ?';

            DBconnetion.query(tipusQuery, [jelentesID], (err, rowsTipus) => {
                if (err) {
                    res.status(500).json({ message: 'Nincs ilyen felhasznalo', error: err });
                } else {
                    const query = 'UPDATE Jelentesek SET JelentesAllapota = 3 WHERE JelentesID LIKE ?';
                    DBconnetion.query(query, [jelentesID], (err) => {
                        if (err) {
                            res.status(500).json({
                                error: err,
                                message: 'Adatbazissal kapcsolatos hiba tortent!'
                            });
                        } else {
                            res.status(200).json({
                                message: 'Adat megvaltoztatva sikeresen',
                                tipus: rowsTipus,
                                bool: true
                            });
                        }
                    });
                }
            });
            //Imadom amikor elirok 1 darab betut, amit nem veszek eszre egy jo 30percig es megy a hajtovadaszat
        } catch (err) {
            res.status(500).json({
                error: err
            });
        }
    }
);
//
//
//
//ADATLAP
//
//
//
const test = require("fs/promises");
const path = require("path");
router.get('/AdatlapLekeres/FelhAdatok/kutya', async (request, response) => {
        let temp=await test.readFile(path.join(__dirname,"../images/dog.png"),"utf8")
        response.status(200).json({
            message: 'Sikeres Lekérés!',
            kutya:temp
        });
})
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
                tartalom: rows,
            });
        }
    });
});

router.get('/AdatlapLekeres/Kedvencek/:id', async (request, response) => {
    //A Lekérés definiálása
    let query1 = 'SELECT KoktélID,KoktelCim,BoritoKepUtvonal from koktél where Keszito like ?';
    let query2 =
        'SELECT AVG(Ertekeles) as Osszert from ertekeles where HovaIrták like ? AND MilyenDologhoz LIKE "Koktél"';
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
        if (kokteladatok.length == 0) {
            response.status(200).json({
                message: 'Nincs Kedvenc!'
            });
        } else {
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
        }
    } catch (error) {
        response.status(500).json({
            message: 'Hiba'
        });
    }
});
router.get('/AdatlapLekeres/Koktelok/:id', async (request, response) => {
    //A Lekérés definiálása
    let query1 = 'SELECT KoktélID,KoktelCim,BoritoKepUtvonal from koktél where Keszito like ?';
    let query2 =
        'SELECT AVG(Ertekeles) as Osszert from ertekeles WHERE HovaIrták like ? AND MilyenDologhoz LIKE "Koktél"';
    let query3 =
        'SELECT Count(HovaIrták) as KommNum from komment WHERE HovaIrták like ? AND MilyenDologhoz LIKE "Koktél"';
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
        if (kokteladatok.length == 0) {
            response.status(200).json({
                message: 'Nincs Koktélod!'
            });
        } else {
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
        }
    } catch (error) {
        response.status(500).json({
            message: 'Hiba'
        });
    }
});

router.get('/AdatlapLekeres/Jelentesek/:id', async (request, response) => {
    //A Lekérések definiálása
    let mitjelentetto = 'SELECT JelentésID,JelentesIndoka FROM Jelentők WHERE JelentőID LIKE ?';
    let query =
        'SELECT JelentettTartalomID,JelentesTipusa,JelentesIdopontja,JelentesAllapota FROM jelentesek WHERE JelentesID LIKE ?';
    let kommentjel = 'SELECT Keszito,Tartalom FROM komment WHERE KommentID LIKE ?';
    let felhjel = 'SELECT Felhasználónév FROM Felhasználó WHERE FelhID LIKE ?';
    let kokteljel = 'SELECT KoktelCim,Keszito FROM koktél WHERE KoktélID LIKE ?';
    //Adattárolók
    let felhaszanalo = request.params.id;
    let oJelentette;
    let jelentesek = [];
    let jelentTar = [];
    //Lekérdezés
    try {
        await DBconnetion.promise()
            .query(mitjelentetto, felhaszanalo)
            .then(([rows]) => {
                oJelentette = rows;
            });
        if (oJelentette.length == 0) {
            response.status(200).json({
                message: 'Nincs Jelentésed!'
            });
        } else {
            for (let i = 0; i < oJelentette.length; i++) {
                await DBconnetion.promise()
                    .query(query, oJelentette[i].JelentésID)
                    .then(([rows]) => {
                        let temp = rows;
                        temp.push(oJelentette[i]);
                        jelentesek.push(temp);
                    });
            }

            for (let i = 0; i < jelentesek.length; i++) {
                //Ideiglenesen üresen létrehozzuk a helyét a jelentésnek a sorrend megtartása érdekében
                jelentTar.push('');

                if (jelentesek[i][0].JelentesTipusa == 'Koktél') {
                    let temp = [];
                    await DBconnetion.promise()
                        .query(kokteljel, jelentesek[i][0].JelentettTartalomID)
                        .then(([rows]) => {
                            //amikor megtudjuk mi van ott, kicseréljük az üreset a tényleges jelentésre
                            temp.push(rows[0]);
                        });
                    await DBconnetion.promise()
                        .query(felhjel, temp[0].Keszito)
                        .then(([rows]) => {
                            temp.push(rows[0]);
                        });
                    //amikor megtudjuk mi van ott, kicseréljük az üreset a tényleges jelentésre
                    jelentTar[i] = temp;
                } else if (jelentesek[i][0].JelentesTipusa == 'Felhasználó') {
                    await DBconnetion.promise()
                        .query(felhjel, jelentesek[i][0].JelentettTartalomID)
                        .then(([rows]) => {
                            //amikor megtudjuk mi van ott, kicseréljük az üreset a tényleges jelentésre
                            jelentTar[i] = rows;
                        });
                } else {
                    let temp = [];
                    await DBconnetion.promise()
                        .query(kommentjel, jelentesek[i][0].JelentettTartalomID)
                        .then(([rows]) => {
                            //amikor megtudjuk mi van ott, kicseréljük az üreset a tényleges jelentésre
                            temp.push(rows[0]);
                        });
                    await DBconnetion.promise()
                        .query(felhjel, temp[0].Keszito)
                        .then(([rows]) => {
                            temp.push(rows[0]);
                        });

                    //amikor megtudjuk mi van ott, kicseréljük az üreset a tényleges jelentésre
                    jelentTar[i] = temp;
                }
            }

            for (let i = 0; i < jelentesek[0].length; i++) {
                //Ideiglenesen üresen létrehozzuk a helyét a jelentésnek a sorrend megtartása érdekében
                jelentTar.push('');
                if (jelentesek[0][i].JelentesTipusa == 'Koktél') {
                    await DBconnetion.promise()
                        .query(kokteljel, jelentesek[0][i].JelentettTartalomID)
                        .then(([rows]) => {
                            //amikor megtudjuk mi van ott, kicseréljük az üreset a tényleges jelentésre
                            jelentTar[i] = rows;
                        });
                } else if (jelentesek[0][i].JelentesTipusa == 'Felhasználó') {
                    await DBconnetion.promise()
                        .query(felhjel, jelentesek[0][i].JelentettTartalomID)
                        .then(([rows]) => {
                            //amikor megtudjuk mi van ott, kicseréljük az üreset a tényleges jelentésre
                            jelentTar[i] = rows;
                        });
                } else {
                    await DBconnetion.promise()
                        .query(kommentjel, jelentesek[0][i].JelentettTartalomID)
                        .then(([rows]) => {
                            //amikor megtudjuk mi van ott, kicseréljük az üreset a tényleges jelentésre
                            jelentTar[i] = rows;
                        });
                }
            }

            //sorrendbe rendezve..
            response.status(200).json({
                message: 'siker!',
                adat: jelentesek,
                rep: jelentTar
            });
        }
    } catch (error) {
        console.log(error);
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

router.post('/AdatlapLekeres/Kosarurites', async (request, response) => {
    let mit = request.body.tartalom;
    let MelyikKosár = 'SELECT SessionID FROM kosár WHERE UserID LIKE ?';
    let MelyikKosárAz;
    let KosárÜrítés = 'DELETE FROM KosárTermék WHERE KosarID LIKE ?';
    try {
        await DBconnetion.promise()
            .query(MelyikKosár, mit)
            .then(([rows]) => {
                MelyikKosárAz = rows[0].SessionID;
            });
        await DBconnetion.promise().query(KosárÜrítés, MelyikKosárAz);
        response.status(200).json({
            message: 'Sikeres Törlés!'
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba Történt!',
            hiba: error
        });
    }
});
router.post('/AdatlapLekeres/TermekUrites', async (request, response) => {
    let mit = request.body.termék;
    let honnan=request.body.kosár
    let TermékTörlés = 'DELETE FROM KosárTermék WHERE KosarID LIKE ? AND TermekID LIKE ?';
    console.log(mit);
    console.log(honnan);
    
    
    try {
        await DBconnetion.promise().query(TermékTörlés,[honnan,mit]);
        response.status(200).json({
            message: 'Sikeres Törlés!'
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba Történt!',
            hiba: error
        });
    }
});
router.post('/AdatlapLekeres/TermekFrissites', async (request, response) => {
    let mit = request.body.termék;
    let honnan=request.body.kosár
    let mennyit=request.body.count
    let TermékTöltés = 'UPDATE KosárTermék SET Darabszam = ? WHERE KosarID LIKE ? AND TermekID LIKE ?';
    console.log(mit);
    console.log(honnan);
    
    
    try {
        await DBconnetion.promise().query(TermékTöltés,[mennyit,honnan,mit]);
        response.status(200).json({
            message: 'Sikeres Frissítés!'
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba Történt!',
            hiba: error
        });
    }
});
router.post('/AdatlapLekeres/JelentesTorles', async (request, response) => {
    let ki=request.body.id
    let mit = request.body.tettes;
    let milyen=request.body.tipus
    let JelentésTörlés = 'DELETE FROM Jelentők WHERE JelentőID LIKE ? AND JelentésID LIKE ?';
    console.log(ki);
    console.log(mit);
    
    
    
    try {
        await DBconnetion.promise().query(JelentésTörlés,[ki,mit,milyen]);
        response.status(200).json({
            message: 'Sikeres Frissítés!'
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
