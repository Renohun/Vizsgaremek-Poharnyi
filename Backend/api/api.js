const express = require('express');
const DBconnetion = require('../database.js');
const argon = require('argon2');
const router = express.Router();
const JWT = require('jsonwebtoken');
const authenticationMiddleware = require('./authenticationMiddleware.js');
const authorizationMiddelware = require('./authorizationMiddelware.js');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const path = require('path');
const fajlkezelo = require('fs/promises');
const { error } = require('console');
const datum = new Date();
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../images/'));
    },
    filename: async (req, file, callback) => {
        let mappa = await fajlkezelo.readdir(path.join(__dirname, '../images/'));

        const fajlformatum = file.originalname.split('.');
        callback(
            null,
            `${datum.getFullYear()}.${datum.getMonth() + 1}.${datum.getDate()}-${fajlformatum[0]}-${mappa.length}.${fajlformatum[fajlformatum.length - 1]}`
        );
    }
});
let fileStorage = multer({ storage: storage });

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
//Koktelok vegpontok
router.post('/sutiJelenlete', (req, res) => {
    if (!req.cookies.auth_token) {
        res.status(200).json({ message: false });
    } else {
        res.status(200).json({ message: true });
    }
});

router.get('/Koktelok/Jelvenyek', async (req, res) => {
    try {
        let jelvenyObj = {};

        const queryIzek = 'SELECT JelvényNeve FROM jelvények WHERE JelvenyKategoria LIKE "ízek"';
        const queryAllergenek = 'SELECT JelvényNeve FROM jelvények WHERE JelvenyKategoria LIKE "Allergének"';
        const queryErosseg = 'SELECT JelvényNeve FROM jelvények WHERE JelvenyKategoria LIKE "Erősség"';

        DBconnetion.query(queryIzek, (err, rows) => {
            if (err) {
                res.status(500).json({ message: 'Sikeretelen adatbazisbol valo lekeres' });
            }
            //console.log(rows);

            jelvenyObj.izek = rows;

            //console.log(jelvenyObj);

            DBconnetion.query(queryAllergenek, (err, rows) => {
                if (err) {
                    res.status(500).json({ message: 'Sikeretelen adatbazisbol valo lekeres' });
                }
                jelvenyObj.allergenek = rows;

                DBconnetion.query(queryErosseg, (err, rows) => {
                    if (err) {
                        res.status(500).json({ message: 'Sikeretelen adatbazisbol valo lekeres' });
                    }
                    jelvenyObj.erosseg = rows;
                    res.status(200).json({ data: jelvenyObj });
                });
            });
        });
    } catch (err) {
        res.status(500).json({ message: 'Hiba vegpont eleres', error: err });
    }
});

router.get('/Koktelok/lekeres', async (req, res) => {
    try {
        const queryKoktelok = 'SELECT * FROM koktél ORDER BY KoktelNepszeruseg DESC';
        const queryKoktelOsszetevok = 'SELECT Osszetevő, Mennyiség FROM koktelokosszetevoi WHERE KoktélID = ?';
        //Majd ide kell tennem a szuroket, de viszont elotte viszont at kell alakitani a kapott szueresi felteteleket id-kra
        const queryKoktelJelvenyek = 'SELECT JelvényID FROM koktélokjelvényei WHERE KoktélID = ?';
        const queryJelvenyek = 'SELECT JelvényNeve, JelvenyKategoria FROM jelvények WHERE JelvényID IN (?)';
        const queryErtekelesek =
            'SELECT AVG(Ertekeles) as Osszert FROM ertekeles WHERE MilyenDologhoz = "Koktél" AND HovaIrták = ?';
        //promise().igeret amit esku hogy megcsinalok - MIERT NEM MUKODOTT ALAPBOL: mert a query callback alapu igy egy CALLBACK HELL-t csinaltam es azt nem lehet await-elni
        //promise() egy igeretet tesz es csak ezt lehet await-ni callbacket nem, ezert kellett promise() igy az atalakitja callbackbol promise-ba
        const [koktelok] = await DBconnetion.promise().query(queryKoktelok);
        //Promise.all: akkor adja vissza ha az erteke ha az osszes belso promise beteljesul
        const eredmeny = await Promise.all(
            koktelok.map(async (koktel) => {
                //promiseolja a query-t: megvarjuk az igeretet ami a query? a [] az azert kell mert ha nem tesszuk oda akkor mast is vissaz ad (a visszadott tartalom nevet es adattipusat SQL)
                //a [] egy destruktor, barmi is legyen az, nem feltetlenul tudom hogy de igy annak a segitesgevel a helyes adat kerul bele a valtozoba
                const [osszetevok] = await DBconnetion.promise().query(queryKoktelOsszetevok, [koktel.KoktélID]);
                koktel.osszetevok = osszetevok;

                // Jelvények - itt a koktel jelvenyeit lekeri, de ugye csak ID-kat ad, ezert kell a kovetkezo lekeres
                const [jelvenyIds] = await DBconnetion.promise().query(queryKoktelJelvenyek, [koktel.KoktélID]);

                if (jelvenyIds.length > 0) {
                    //itt kiszedi az ID-kat es egy tombbe teszi, hogy a lekeresben mukodjon
                    const ids = jelvenyIds.map((j) => j.JelvényID);
                    const [jelvenyek] = await DBconnetion.promise().query(queryJelvenyek, [ids]);
                    koktel.jelvenyek = jelvenyek;
                } else {
                    koktel.jelvenyek = [];
                }

                // Értékelés
                const [ertekeles] = await DBconnetion.promise().query(queryErtekelesek, [koktel.KoktélID]);

                koktel.ertekeles =
                    ertekeles.length === 0 ? 'Még nincs értékelve' : Math.round(ertekeles[0].Osszert * 10) / 10;
                //itt a visszaadja a map tartalmait, melyek egy tombbe lesznak fuzve a ugye a map() miatt
                return koktel;
            })
        );

        res.status(200).json({ koktelokAdat: eredmeny });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sikertelen végpont elérés' });
    }
});

router.get('/Koktelok/lekeres/:koktelNev', async (req, res) => {
    try {
        let { koktelNev } = req.params;
        //console.log(koktelNev);
        koktelNev = '%' + koktelNev + '%';

        const queryKoktelok = 'SELECT * FROM koktél WHERE KoktelCim LIKE ?';
        const queryKoktelOsszetevok = 'SELECT Osszetevő, Mennyiség FROM koktelokosszetevoi WHERE KoktélID = ?';
        //Majd ide kell tennem a szuroket, de viszont elotte viszont at kell alakitani a kapott szueresi felteteleket id-kra
        const queryKoktelJelvenyek = 'SELECT JelvényID FROM koktélokjelvényei WHERE KoktélID = ?';
        const queryJelvenyek = 'SELECT JelvényNeve, JelvenyKategoria FROM jelvények WHERE JelvényID IN (?)';
        const queryErtekelesek =
            'SELECT AVG(Ertekeles) as Osszert FROM ertekeles WHERE MilyenDologhoz = "Koktél" AND HovaIrták = ?';
        //promise().igeret amit esku hogy megcsinalok - MIERT NEM MUKODOTT ALAPBOL: mert a query callback alapu igy egy CALLBACK HELL-t csinaltam es azt nem lehet await-elni
        //promise() egy igeretet tesz es csak ezt lehet await-ni callbacket nem, ezert kellett promise() igy az atalakitja callbackbol promise-ba
        const [koktelok] = await DBconnetion.promise().query(queryKoktelok, [koktelNev]);
        //Promise.all: akkor adja vissza ha az erteke ha az osszes belso promise beteljesul
        const eredmeny = await Promise.all(
            koktelok.map(async (koktel) => {
                //promiseolja a query-t: megvarjuk az igeretet ami a query? a [] az azert kell mert ha nem tesszuk oda akkor mast is vissaz ad (a visszadott tartalom nevet es adattipusat SQL)
                //a [] egy destruktor, barmi is legyen az, nem feltetlenul tudom hogy de igy annak a segitesgevel a helyes adat kerul bele a valtozoba
                const [osszetevok] = await DBconnetion.promise().query(queryKoktelOsszetevok, [koktel.KoktélID]);
                koktel.osszetevok = osszetevok;

                // Jelvények - itt a koktel jelvenyeit lekeri, de ugye csak ID-kat ad, ezert kell a kovetkezo lekeres
                const [jelvenyIds] = await DBconnetion.promise().query(queryKoktelJelvenyek, [koktel.KoktélID]);

                if (jelvenyIds.length > 0) {
                    //itt kiszedi az ID-kat es egy tombbe teszi, hogy a lekeresben mukodjon
                    const ids = jelvenyIds.map((j) => j.JelvényID);
                    const [jelvenyek] = await DBconnetion.promise().query(queryJelvenyek, [ids]);
                    koktel.jelvenyek = jelvenyek;
                } else {
                    koktel.jelvenyek = [];
                }

                // Értékelés
                const [ertekeles] = await DBconnetion.promise().query(queryErtekelesek, [koktel.KoktélID]);

                koktel.ertekeles =
                    ertekeles.length === 0 ? 'Még nincs értékelve' : Math.round(ertekeles[0].Osszert * 10) / 10;
                //itt a visszaadja a map tartalmait, melyek egy tombbe lesznak fuzve a ugye a map() miatt
                return koktel;
            })
        );

        res.status(200).json({ koktelokAdat: eredmeny });
    } catch (err) {
        res.status(500).json({ message: 'Hibas koktel lekeres', error: err });
    }
});

router.post('/Koktelok/lekeres/parameteres', async (req, res) => {
    try {
        //console.log(koktelNev);

        const { erosseg } = req.body;
        const { ize } = req.body;
        const { allergenek } = req.body;
        const { alkoholosE } = req.body;
        const { rendezes } = req.body;

        //console.log(szuresTomb);

        let queryKoktelok = 'SELECT * FROM koktél';

        if (alkoholosE == 'Alkoholos') {
            queryKoktelok += ' WHERE Alkoholos LIKE TRUE';
        } else if (alkoholosE == 'Alkoholmentes') {
            queryKoktelok += ' WHERE Alkoholos LIKE FALSE';
        }

        if (rendezes == 'Nepszeruseg novekvo') {
            queryKoktelok += ' ORDER BY KoktelNepszeruseg ASC';
        } else if (rendezes == 'Nepszeruseg csokkeno') {
            queryKoktelok += ' ORDER BY KoktelNepszeruseg DESC';
        } else if (rendezes == 'Legkorabban keszitett') {
            queryKoktelok += ' ORDER BY KeszitesDatuma ASC';
        } else if (rendezes == 'Legkesobb keszitett') {
            queryKoktelok += ' ORDER BY KeszitesDatuma DESC';
        }

        console.log(queryKoktelok);

        //const querySzuresID = 'SELECT JelvényID FROM jelvények WHERE JelvényNeve IN (?)';

        //itt most at lett alakitva a kapott jelvenyek ID-kra

        const queryKoktelOsszetevok = 'SELECT Osszetevő, Mennyiség FROM koktelokosszetevoi WHERE KoktélID = ?';
        //Majd ide kell tennem a szuroket, de viszont elotte viszont at kell alakitani viszont a kapott szueresi felteteleket id-kra
        //const querySzuresID = 'SELECT JelvényID, JelvenyKategoria FROM jelvények WHERE JelvényNeve IN (?)';
        const queryJelvenyek = 'SELECT JelvényNeve, JelvenyKategoria FROM jelvények WHERE JelvényID IN (?)';
        const queryKoktelJelvenyek = 'SELECT JelvényID FROM koktélokjelvényei WHERE KoktélID = ?';
        const queryErtekelesek =
            'SELECT AVG(Ertekeles) as Osszert FROM ertekeles WHERE MilyenDologhoz = "Koktél" AND HovaIrták = ?';
        //promise().igeret amit esku hogy megcsinalok - MIERT NEM MUKODOTT ALAPBOL: mert a query callback alapu igy egy CALLBACK HELL-t csinaltam es azt nem lehet await-elni
        //promise() egy igeretet tesz es csak ezt lehet await-ni callbacket nem, ezert kellett promise() igy az atalakitja callbackbol promise-ba
        const [koktelok] = await DBconnetion.promise().query(queryKoktelok);
        //Promise.all: akkor adja vissza ha az erteke ha az osszes belso promise beteljesul
        const eredmeny = await Promise.all(
            koktelok.map(async (koktel) => {
                //promiseolja a query-t: megvarjuk az igeretet ami a query? a [] az azert kell mert ha nem tesszuk oda akkor mast is vissaz ad (a visszadott tartalom nevet es adattipusat SQL)
                //a [] egy destruktor, barmi is legyen az, nem feltetlenul tudom hogy de igy annak a segitesgevel a helyes adat kerul bele a valtozoba
                const [osszetevok] = await DBconnetion.promise().query(queryKoktelOsszetevok, [koktel.KoktélID]);
                koktel.osszetevok = osszetevok;

                // Jelvények - itt a koktel jelvenyeit lekeri, de ugye csak ID-kat ad, ezert kell a kovetkezo lekeres
                //const [jelvenyIds] = await DBconnetion.promise().query(queryKoktelJelvenyek, [koktel.KoktélID]);

                let szuresTomb = [];
                //itt egy tombe teszi a kapott parametereket
                if (erosseg != '') {
                    szuresTomb.push(erosseg);
                }
                if (ize != '') {
                    szuresTomb.push(ize);
                }
                if (allergenek != '') {
                    szuresTomb.push(allergenek);
                }
                console.log(szuresTomb);

                //console.log(szuresTomb);
                //a parametereket at kene alakitania ID-ka, hogy azt majd hasznalhassam hogy melyik koktel melyik jelveny tartalmazza, igy melyik koktel felel meg a parametereknek
                //const [szuresID] = await DBconnetion.promise().query(querySzuresID, [szuresTomb]);
                const [jelvenyIds] = await DBconnetion.promise().query(queryKoktelJelvenyek, [koktel.KoktélID]);
                //itt kiszedi az ID-kat es egy tombbe teszi, hogy a lekeresben mukodjon
                if (szuresTomb.length > 0) {
                    //itt kiszedi az ID-kat es egy tombbe teszi, hogy a lekeresben mukodjon
                    const ids = jelvenyIds.map((j) => j.JelvényID);
                    const [jelvenyek] = await DBconnetion.promise().query(queryJelvenyek, [ids]);

                    //ellenorizni kell hogy a ellenorizendo tomb es a szuresTomb megegyezik e
                    let ellenorizendoTomb = jelvenyek.map((jelveny) => jelveny.JelvényNeve);
                    //console.log(ellenorizendoTomb);

                    //ABC sorrend
                    szuresTomb.sort();
                    ellenorizendoTomb.sort();
                    //At kell irni includos megoldasra
                    const tombOsszehasonlitas = (a, b) => {
                        return JSON.stringify(a) === JSON.stringify(b);
                    };

                    if (tombOsszehasonlitas(szuresTomb, ellenorizendoTomb)) {
                        koktel.jelvenyek = jelvenyek;

                        const [ertekeles] = await DBconnetion.promise().query(queryErtekelesek, [koktel.KoktélID]);

                        koktel.ertekeles =
                            ertekeles.length === 0 ? 'Még nincs értékelve' : Math.round(ertekeles[0].Osszert * 10) / 10;
                        //itt a visszaadja a map tartalmait, melyek egy tombbe lesznak fuzve a ugye a map() miatt

                        //console.log(koktel);

                        return koktel;
                    }
                } else {
                    if (jelvenyIds.length > 0) {
                        const ids = jelvenyIds.map((j) => j.JelvényID);
                        const [jelvenyek] = await DBconnetion.promise().query(queryJelvenyek, [ids]);
                        koktel.jelvenyek = jelvenyek;
                    } else {
                        koktel.jelvenyek = [];
                    }
                    const [ertekeles] = await DBconnetion.promise().query(queryErtekelesek, [koktel.KoktélID]);

                    koktel.ertekeles =
                        ertekeles.length === 0 ? 'Még nincs értékelve' : Math.round(ertekeles[0].Osszert * 10) / 10;

                    return koktel;
                }
            })
        );

        res.status(200).json({ koktelokAdat: eredmeny });
    } catch (err) {
        console.log(err);

        res.status(400).json({ message: 'Hibas koktel lekeres', error: err });
    }
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
        console.log(request.body);

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
//
//
//
//
//AdminPanel - jelentesek endpoint
//
//
//
//
router.post('/AdminPanel/jelentesek', authenticationMiddleware, authorizationMiddelware, async (req, res) => {
    try {
        let query =
            'SELECT JelentesID, JelentettTartalomID,JelentesTipusa,JelentesIdopontja,JelentesAllapota FROM jelentesek WHERE JelentesAllapota LIKE 0 ORDER BY JelentesMennyisege DESC';

        let jelentesIndokaQuery = 'SELECT JelentesIndoka FROM jelentők WHERE JelentésID LIKE ?';

        let kommentjel =
            'SELECT felhasználó.Felhasználónév, Tartalom FROM komment INNER JOIN felhasználó ON felhasználó.FelhID = komment.Keszito WHERE KommentID LIKE ? AND MilyenDologhoz LIKE "Koktél"';
        let felhjel = 'SELECT FelhID, Felhasználónév, Email, RegisztracioDatuma FROM felhasználó WHERE FelhID LIKE ?';
        let kokteljel =
            'SELECT koktél.KoktélID, koktél.Keszito, BoritoKepUtvonal, koktél.KeszitesDatuma, koktél.KoktelCim, koktél.Alap, koktél.Recept, felhasználó.FelhasználóNév FROM koktél INNER JOIN felhasználó ON felhasználó.FelhID = koktél.Keszito WHERE koktél.KoktélID LIKE ?';
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
//
//AdminPnael - koktelhozzadasa vegpont
//
//
//
//

router.post('/AdminPanel/JelvenyekLetoltese', authenticationMiddleware, authorizationMiddelware, (req, res) => {
    let erossegTomb = [];
    let izTomb = [];
    let allergenTomb = [];

    const jelvenyQuery = 'SELECT JelvényNeve, JelvenyKategoria FROM jelvények';

    DBconnetion.query(jelvenyQuery, (err, rows) => {
        if (err) {
            res.status(500).json({
                message: 'Hiba tortent az adatbazis lekeressel'
            });
        } else {
            rows.forEach((row) => {
                if (row.JelvenyKategoria == 'Erősség') {
                    erossegTomb.push(row);
                } else if (row.JelvenyKategoria == 'ízek') {
                    izTomb.push(row);
                } else if (row.JelvenyKategoria == 'Allergének') {
                    allergenTomb.push(row);
                }
            });

            res.status(200).json({
                erossegek: erossegTomb,
                izek: izTomb,
                allergenek: allergenTomb
            });
        }
    });
});

router.post(
    '/AdminPanel/KoktelFeltoltes/NevEllenorzes',
    authenticationMiddleware,
    authorizationMiddelware,
    async (req, res) => {
        try {
            //console.log(req);
            const { nev } = req.body;
            console.log(nev);

            const nevQuery = 'SELECT KoktelCim FROM koktél WHERE KoktelCim LIKE ?';

            const [nevTomb] = await DBconnetion.promise().query(nevQuery, [nev]);

            if (nevTomb.length > 0) {
                res.status(200).json({ duplikacio: true });
            } else {
                res.status(200).json({ duplikacio: false });
            }
        } catch (err) {
            res.status(500).json({ message: 'Unexpected error', error: err });
        }
    }
);

router.post('/AdminPanel/KoktelFeltoltes', authenticationMiddleware, authorizationMiddelware, (req, res) => {
    try {
        const payload = jwt.decode(req.cookies.auth_token);
        console.log(req.body);

        const { nev } = req.body;
        const { alapMennyiseg } = req.body;
        const { alap } = req.body;
        const { jelveny } = req.body;
        const { alkoholos } = req.body;
        const { osszetevok } = req.body;
        const { recept } = req.body;
        const { fajlNeve } = req.body;

        //console.log('vegpont: ' + nev);

        const query =
            'INSERT INTO koktél(Keszito,Alkoholos,Közösségi,KoktelCim,BoritoKepUtvonal,Alap,Recept,AlapMennyiseg) VALUES(?,?,?,?,?,?,?,?)';
        const queryKoktel = 'SELECT KoktélID FROM koktél ORDER BY KoktélID DESC LIMIT 1';
        const queryJelvenyek = 'SELECT JelvényID FROM `jelvények` WHERE JelvényNeve IN (?)';
        const queryKoktelOsszetevok =
            'INSERT INTO koktelokosszetevoi(KoktélID,Osszetevő,Mennyiség, Mertekegyseg) VALUES(?,?,?,?)';
        const queryKoktelJelvenyInsert = 'INSERT INTO koktélokjelvényei(KoktélID, JelvényID) VALUES(?,?)';

        DBconnetion.query(query, [payload.userID, alkoholos, 0, nev, fajlNeve, alap, recept, alapMennyiseg], (err) => {
            if (err) {
                res.status(500).json({ message: 'Sikertelen adat feltoltes' });
            }
            DBconnetion.query(queryKoktel, (err, rows) => {
                if (err) {
                    res.status(500).json({ message: 'Sikertelen adat feltoltes' });
                }
                let feltoltottKoktelID = rows[0].KoktélID;

                for (let i = 0; i < osszetevok.length; i++) {
                    DBconnetion.query(
                        queryKoktelOsszetevok,
                        [
                            feltoltottKoktelID,
                            osszetevok[i].osszetevo,
                            osszetevok[i].mennyiseg,
                            osszetevok[i].mertekegyseg
                        ],
                        (err) => {
                            if (err) {
                                res.status(500).json({ message: 'Sikertelen adat feltoltes' });
                            }
                        }
                    );
                }

                //console.log(feltoltottKoktelID);
                let jelvenyID = [];
                //console.log(jelvenyReq);
                //aszinkronos pokol
                DBconnetion.query(queryJelvenyek, [jelveny], (err, rows) => {
                    if (err) {
                        res.status(500).json({ message: 'gatya van' });
                    }
                    //console.log(feltoltottKoktelID);

                    for (let i = 0; i < rows.length; i++) {
                        jelvenyID.push(rows[i].JelvényID);
                    }

                    for (let i = 0; i < jelvenyID.length; i++) {
                        DBconnetion.query(queryKoktelJelvenyInsert, [feltoltottKoktelID, jelvenyID[i]], (err) => {
                            if (err) {
                                res.status(500).json({ message: 'Sikertelen adata feltoltes' });
                            }
                        });
                    }

                    //console.log(jelvenyID);
                });
            });
        });
    } catch (err) {
        console.log(err);
    }
});

//
//
//AdminPanel - koktelTorles

router.get('/koktelNevek', (req, res) => {
    try {
        const nevQuery = 'SELECT KoktelCim FROM koktél';
        DBconnetion.query(nevQuery, (err, rows) => {
            if (err) {
                throw new Error('Hiba van a lekeresben');
            }
            res.status(200).json({ lekertAdat: rows });
        });
    } catch (err) {
        res.status(400).json({ message: 'Hiba tortent a vegpontban' });
    }
});
router.post('/koktelTorles/:nev', (req, res) => {
    try {
        const { nev } = req.params;

        const idLekeres = 'SELECT KoktélID FROM koktél WHERE KoktelCim LIKE ?';
        const torlesQuery = 'DELETE FROM koktél WHERE KoktélID LIKE ?';
        const jelvenyTorlesQuery = 'DELETE FROM koktélokjelvényei WHERE KoktélID LIKE ?';
        const osszetevoTorlesQuery = 'DELETE FROM koktelokosszetevoi WHERE KoktélID LIKE ?';
        const ertekelesTorlesQuery = 'DELETE FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
        const kommentQuery = 'DELETE FROM komment WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';

        const jelentesTorlesQuery = 'DELETE FROM jelentesek WHERE JelentesID LIKE ?';
        const jeletnesIDQuery =
            'SELECT JelentesID FROM jelentesek WHERE JelentettTartalomID LIKE ? AND JelentesTipusa LIKE ?';
        const jelentokTorles = 'DELETE FROM jelentők WHERE JelentésID LIKE ?';

        const kedvencTorlesQuery = 'DELETE FROM kedvencek WHERE MitkedveltID LIKE ?';

        DBconnetion.query(idLekeres, [nev], (err, rows) => {
            const koktelID = rows[0].KoktélID;

            DBconnetion.query(jeletnesIDQuery, [koktelID, 'Koktél'], async (err, rows) => {
                if (rows[0] != undefined) {
                    const jelentesID = rows[0].JelentesID;

                    await DBconnetion.promise().query(jelentokTorles, [jelentesID]);
                    await DBconnetion.promise().query(jelentesTorlesQuery, [jelentesID]);
                }
            });

            DBconnetion.query(jelvenyTorlesQuery, [koktelID]);
            DBconnetion.query(osszetevoTorlesQuery, [koktelID]);
            DBconnetion.query(ertekelesTorlesQuery, [koktelID, 'Koktél']);

            DBconnetion.query(kommentQuery, [koktelID, 'Koktél']);

            DBconnetion.query(kedvencTorlesQuery, [koktelID]);

            DBconnetion.query(torlesQuery, [koktelID]);
        });
        res.status(200).json({ message: 'Sikeres adatbazis torlesek', result: true });
    } catch (err) {
        res.status(400).json({ message: 'Sikertelen koktel torles', result: false });
    }
});

//adminpanel - termekfeltoltes

router.post('/AdminPanel/TermekFeltoltes', async (req, res) => {
    try {
        //console.log(req.body);

        const {
            fajlNeve,
            termekNev,
            termekLeiras,
            termekKiszereles,
            termekKeszlet,
            termekMarka,
            termekSzarmazas,
            termekAra,
            termekKategoria
        } = req.body;

        if (termekKategoria != 'Alkholok') {
            const termekQuery =
                'INSERT INTO webshoptermek (TermekCim, TermekLeiras, TermekKiszereles, TermekKeszlet, TermekKepUtvonal, TermekKategoria, TermekMarka, TermekSzarmazas, Ar) VALUES (?,?,?,?,?,?,?,?,?)';
            await DBconnetion.promise().query(termekQuery, [
                termekNev,
                termekLeiras,
                termekKiszereles,
                termekKeszlet,
                fajlNeve,
                termekKategoria,
                termekMarka,
                termekSzarmazas,
                termekAra
            ]);
        } else {
            const termekQuery =
                'INSERT INTO webshoptermek (TermekCim, TermekLeiras, TermekKiszereles, TermekKeszlet, TermekKepUtvonal, TermekKategoria, TermekMarka, TermekSzarmazas, TermekAlkoholSzazalek, TermekKora, Ar) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
            await DBconnetion.promise().query(termekQuery, [
                termekNev,
                termekLeiras,
                termekKiszereles,
                termekKeszlet,
                fajlNeve,
                termekKategoria,
                termekMarka,
                termekSzarmazas,
                req.body.termekAlkohol,
                req.body.termekKora,
                termekAra
            ]);
        }
    } catch (error) {
        res.status(500).json({ message: 'Hiba tortent a vegponton', error: error });
    }
});

router.get('/AdminPanel/TermekLekeres', authenticationMiddleware, authorizationMiddelware, async (req, res) => {
    try {
        const query = 'SELECT TermekID,TermekCim FROM webshoptermek';
        const [rows] = await DBconnetion.promise().query(query);
        res.status(200).json({ result: rows });
    } catch (err) {
        res.status(500).json({ message: 'Hiba tortent a vegpontban', error: err });
    }
});

router.get(
    '/AdminPanel/TermekNev/Ellenorzes/:nev',
    authenticationMiddleware,
    authorizationMiddelware,
    async (req, res) => {
        try {
            const { nev } = req.params;

            const nevQuery = 'SELECT TermekCim FROM webshoptermek WHERE TermekCim LIKE ?';

            const [rows] = await DBconnetion.promise().query(nevQuery, [nev]);

            if (rows.length > 0) {
                res.status(200).json({ duplikacio: true });
            } else {
                res.status(200).json({ duplikacio: false });
            }
        } catch (error) {
            res.status(500).json({ message: 'Hibas vegpont', error: error });
        }
    }
);

router.get(
    '/AdminPanel/TermekLearazas/:id/:ertek',
    authenticationMiddleware,
    authorizationMiddelware,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { ertek } = req.params;

            console.log(id);
            console.log(ertek);

            const frissetesQuery = 'UPDATE webshoptermek SET TermekDiscount = ? WHERE TermekCim LIKE ?';

            await DBconnetion.promise().query(frissetesQuery, [ertek, id]);

            res.status(200).json({ result: 'Learazas sikeresen frissitve' });
        } catch (error) {
            res.status(500).json({ message: 'Hiba tortent a vegpontban', error: err });
        }
    }
);

router.delete('/AdminPanel/TermekTorles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const queryWebShop = 'DELETE FROM webshoptermek WHERE TermekID LIKE ?';
        const queryKosar = 'DELETE FROM kosártermék WHERE TermekID LIKE ?';
        await DBconnetion.promise().query(queryKosar, [id]);
        await DBconnetion.promise().query(queryWebShop, [id]);

        res.status(200).json({ message: 'Sikeres torles' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Sikertelen vegpont eleres', err: error });
    }
});

//
//
//
//ADATLAP
//
//
//
async function lekeres(query, param) {
    let result;
    await DBconnetion.promise()
        .query(query, param)
        .then(([rows]) => {
            result = rows;
        });
    return result;
}
router.get('/AdatlapLekeres/FelhAdatok/', async (request, response) => {
    //A Lekérés definiálása
    let query =
        'SELECT Felhasználónév,Email,JelszóHossza,RegisztracioDatuma from felhasználó WHERE FelhID LIKE ?;SELECT COUNT(KiKedvelteID) AS KEDVID from kedvencek where KiKedvelteID like ? ;SELECT COUNT(Keszito) AS KOMMID from komment where Keszito like ?;SELECT COUNT(Keszito) AS RATEID from ertekeles where Keszito like ?;SELECT COUNT(Keszito) AS MAKEID from koktél where Keszito like ?;';
    let ertekek = [];
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?

    for (let i = 0; i < 5; i++) {
        ertekek.push(jwt.decode(request.cookies.auth_token).userID);
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

router.get('/AdatlapLekeres/Kedvencek/', async (request, response) => {
    //A Lekérés definiálása
    let KedvencekLekeres = 'SELECT MitKedveltID from kedvencek WHERE KikedvelteID LIKE ?';
    let koktelLekeres = 'SELECT KoktélID,KoktelCim from koktél where KoktélID like ?';
    let ertekelesAtlagLekeres =
        'SELECT AVG(Ertekeles) as Osszert from ertekeles where HovaIrták like ? AND MilyenDologhoz LIKE "Koktél"';
    let osszetevokLekerese = 'SELECT Osszetevő from koktelokosszetevoi where KoktélID like ?';
    let koktélbadgek = 'SELECT JelvényID FROM koktélokjelvényei WHERE KoktélID LIKE ?';
    let badgek = 'SELECT JelvényNeve,JelvenyKategoria FROM jelvények WHERE JelvényID LIKE ?';
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    let felhaszanalo = jwt.decode(request.cookies.auth_token).userID;
    let kokteladatok;
    let ertekeles;
    let osszetevok;
    let jelvenyadatok;

    //Lekérdezés
    try {
        kedvencek = await lekeres(KedvencekLekeres, felhaszanalo);
        if (kedvencek.length == 0) {
            response.status(203).json({
                message: 'Üres Lekérés!'
            });
        } else {
            let koktel = [];
            console.log(kedvencek);

            for (let i = 0; i < kedvencek.length; i++) {
                let koktelbadgek = [];
                kokteladatok = await lekeres(koktelLekeres, kedvencek[i].MitKedveltID);
                ertekeles = await lekeres(ertekelesAtlagLekeres, kedvencek[i].MitKedveltID);
                osszetevok = await lekeres(osszetevokLekerese, kedvencek[i].MitKedveltID);
                jelvenyadatok = await lekeres(koktélbadgek, kedvencek[i].MitKedveltID);

                for (let j = 0; j < jelvenyadatok.length; j++) {
                    koktelbadgek.push(await lekeres(badgek, jelvenyadatok[j].JelvényID));
                }
                koktel.push({ kokteladatok, ertekeles, osszetevok, koktelbadgek });
            }
            response.status(200).json({
                message: 'siker!',
                adat: koktel
            });
        }
    } catch (error) {
        console.log(error);

        response.status(500).json({
            message: 'Hiba'
        });
    }
});

router.get('/AdatlapLekeres/Koktelok/', async (request, response) => {
    //A Lekérés definiálása
    let koktelLekeres = 'SELECT KoktélID,KoktelCim,BoritoKepUtvonal from koktél where Keszito like ?';
    let ertekelesLekeres =
        'SELECT AVG(Ertekeles) as Osszert from ertekeles WHERE HovaIrták like ? AND MilyenDologhoz LIKE "Koktél"';
    let kommentLekeres =
        'SELECT Count(HovaIrták) as KommNum from komment WHERE HovaIrták like ? AND MilyenDologhoz LIKE "Koktél"';
    let koktélbadgek = 'SELECT JelvényID FROM koktélokjelvényei WHERE KoktélID LIKE ?';
    let badgek = 'SELECT JelvényNeve FROM jelvények WHERE JelvényID LIKE ?';
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    let felhaszanalo = jwt.decode(request.cookies.auth_token).userID;
    let kokteladatok;
    let jelvenyadatok;
    let ertekelesek = [];
    let kommentek = [];
    let jelvenyek = [];
    //Lekérdezés
    try {
        kokteladatok = await lekeres(koktelLekeres, felhaszanalo);
        if (kokteladatok.length == 0) {
            response.status(204);
        } else {
            for (let i = 0; i < kokteladatok.length; i++) {
                ertekelesek.push(await lekeres(ertekelesLekeres, kokteladatok[i].KoktélID));
                kommentek.push(await lekeres(kommentLekeres, kokteladatok[i].KoktélID));
                jelvenyadatok = await lekeres(koktélbadgek, kokteladatok[i].KoktélID);
                for (let j = 0; j < jelvenyadatok.length; j++) {
                    jelvenyek.push(await lekeres(badgek, jelvenyadatok[j].JelvényID));
                }
            }
            response.status(200).json({
                message: 'siker!',
                adat: kokteladatok,
                ertek: ertekelesek,
                kommnum: kommentek,
                badgek: jelvenyek
            });
        }
    } catch (error) {
        response.status(500).json({
            message: 'Hiba'
        });
    }
});

router.get('/AdatlapLekeres/Jelentesek/', async (request, response) => {
    //A Lekérések definiálása
    let mitjelentetto = 'SELECT JelentésID,JelentesIndoka FROM Jelentők WHERE JelentőID LIKE ?';
    let jelentesAdat =
        'SELECT JelentettTartalomID,JelentesTipusa,JelentesIdopontja,JelentesAllapota FROM jelentesek WHERE JelentesID LIKE ?';
    let kommentjel = 'SELECT Keszito,Tartalom FROM komment WHERE KommentID LIKE ?';
    let felhjel = 'SELECT Felhasználónév FROM Felhasználó WHERE FelhID LIKE ?';
    let kokteljel = 'SELECT KoktelCim,Keszito FROM koktél WHERE KoktélID LIKE ?';
    //Adattárolók
    let felhaszanalo = jwt.decode(request.cookies.auth_token).userID;
    let oJelentette;
    let jelentesek = [];
    let jelentTar = [];
    //Lekérdezés
    try {
        oJelentette = await lekeres(mitjelentetto, felhaszanalo);
        if (oJelentette.length == 0) {
            response.status(204);
        } else {
            for (let i = 0; i < oJelentette.length; i++) {
                let temp = await lekeres(jelentesAdat, oJelentette[i].JelentésID);
                temp.push(oJelentette[i]);
                jelentesek.push(temp);
            }
            for (let i = 0; i < jelentesek.length; i++) {
                //Ideiglenesen üresen létrehozzuk a helyét a jelentésnek a sorrend megtartása érdekében
                jelentTar.push('');
                let temp = [];
                if (jelentesek[i][0].JelentesTipusa == 'Koktél') {
                    temp.push(await lekeres(kokteljel, jelentesek[i][0].JelentettTartalomID));
                    temp.push(await lekeres(felhjel, temp[0][0].Keszito));
                    jelentTar[i] = temp;
                } else if (jelentesek[i][0].JelentesTipusa == 'Felhasználó') {
                    jelentTar[i] = await lekeres(felhjel, jelentesek[i][0].JelentettTartalomID);
                } else if (jelentesek[i][0].JelentesTipusa == 'Komment') {
                    temp.push(await lekeres(kommentjel, jelentesek[i][0].JelentettTartalomID));
                    temp.push(await lekeres(felhjel, temp[0][0].Keszito));
                    jelentTar[i] = temp;
                }
            }
            response.status(200).json({
                message: 'siker!',
                adat: jelentesek,
                rep: jelentTar
            });
        }
    } catch (error) {
        response.status(500).json({
            message: 'Hiba',
            hiba: error
        });
    }
});
router.get('/AdatlapLekeres/Kosar/', async (request, response) => {
    //Lekérések
    let KosarLekeres = 'SELECT SessionID FROM kosár WHERE UserID LIKE ?';
    let KosarTermekLekeres = 'SELECT TermekID,Darabszam,EgysegAr FROM kosártermék WHERE KosarID LIKE ?';
    let TermekLekeres = 'SELECT TermekCim,TermekLeiras FROM webshoptermek WHERE TermekID LIKE ?';
    //Adattárolók
    let vasarlo = jwt.decode(request.cookies.auth_token).userID;
    let kosar;
    let kosartermekek;
    let termekek = [];
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    //Lekérdezés
    try {
        console.log(vasarlo);

        kosar = await lekeres(KosarLekeres, vasarlo);
        if (kosar.length == 0) {
            response.status(204);
        } else {
            kosartermekek = await lekeres(KosarTermekLekeres, kosar[0].SessionID);

            for (let i = 0; i < kosartermekek.length; i++) {
                let temp = await lekeres(TermekLekeres, kosartermekek[i].TermekID);
                termekek.push(temp[0]);
            }
            response.status(200).json({
                message: 'Sikeres Lekérés!',
                kosár: kosartermekek,
                termekek: termekek
            });
        }
    } catch (error) {
        console.log(error);

        response.status(500).json({
            message: 'Hiba Történt!',
            hiba: error
        });
    }
});

router.post('/AdatlapLekeres/Kosarurites', async (request, response) => {
    let mit = jwt.decode(request.cookies.auth_token).userID;
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
    let honnan = request.body.kosár;
    let TermékTörlés = 'DELETE FROM KosárTermék WHERE KosarID LIKE ? AND TermekID LIKE ?';
    console.log(mit);
    console.log(honnan);

    try {
        await DBconnetion.promise().query(TermékTörlés, [honnan, mit]);
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
    let honnan = request.body.kosár;
    let mennyit = request.body.count;
    let TermékTöltés = 'UPDATE KosárTermék SET Darabszam = ? WHERE KosarID LIKE ? AND TermekID LIKE ?';
    console.log(mit);
    console.log(honnan);

    try {
        await DBconnetion.promise().query(TermékTöltés, [mennyit, honnan, mit]);
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
    let ki = request.body.id;
    let mit = jwt.decode(request.cookies.auth_token).userID;
    let milyen = request.body.tipus;
    let JelentésTörlés = 'DELETE FROM Jelentők WHERE JelentőID LIKE ? AND JelentésID LIKE ?';
    try {
        await DBconnetion.promise().query(JelentésTörlés, [ki, mit, milyen]);
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

router.post('/AdatlapLekeres/KepFeltoltes', fileStorage.array('profilkep'), async (request, response) => {
    try {
        response.status(200).json({
            message: request.files[0].filename
        });
    } catch (error) {
        response.status(500).json({
            message: error
        });
    }
});
router.post('/AdatlapLekeres/KoktelKepLekeres/:melyik', async (request, response) => {
    try {
        let melyik = request.params.melyik;
        let kepkereses = 'SELECT BoritoKepUtvonal FROM Koktél WHERE KoktélID LIKE ?';
        let kinek = await lekeres(kepkereses, melyik);
        response.sendFile(path.join(__dirname, '..', 'images', kinek[0].BoritoKepUtvonal));
    } catch (error) {
        console.log(error);
    }
});

router.post('/AdatlapLekeres/TermekKepLekeres/:melyik', async (request, response) => {
    try {
        let melyik = request.params.melyik;
        let kepkereses = 'SELECT TermekKepUtvonal FROM WebshopTermek WHERE TermekID LIKE ?';
        let kinek = await lekeres(kepkereses, melyik);
        response.sendFile(path.join(__dirname, '..', 'images', kinek[0].TermekKepUtvonal));
    } catch (error) {
        console.log(error);
    }
});

router.post('/AdatlapLekeres/KepLekeres/', async (request, response) => {
    try {
        let profil = jwt.decode(request.cookies.auth_token).userID;
        let kepkereses = 'SELECT ProfilkepUtvonal FROM felhasználó WHERE FelhID LIKE ?';
        let kinek = await lekeres(kepkereses, profil);
        response.sendFile(path.join(__dirname, '..', 'images', kinek[0].ProfilkepUtvonal));
    } catch (error) {
        console.log(error);
    }
});

router.post('/AdminPanel/KepLekeres/:id', async (request, response) => {
    try {
        //console.log(request.body);
        let { id } = request.params;
        let kepkereses = 'SELECT BoritoKepUtvonal FROM koktél WHERE KoktélID LIKE ?';
        let kinek = await lekeres(kepkereses, id);
        response.sendFile(path.join(__dirname, '..', 'images', kinek[0].BoritoKepUtvonal));
    } catch (error) {
        console.log(error);
    }
});

router.post('/AdatlapLekeres/Adatmodositas/', async (request, response) => {
    try {
        let adatmodositas = 'UPDATE felhasználó SET Felhasználónév=?,Email=?';
        let tomb = `${request.body.Felhasználónév},${request.body.Email}`;
        let profil = jwt.decode(request.cookies.auth_token).userID;
        if (request.body.Jelszó != 'undefined') {
            adatmodositas += ',Jelszó=?';
            tomb += `,${await argon.hash(request.body.Jelszó, { type: argon.argon2id })}`;
        }
        if (request.body.KépÚtvonal != undefined) {
            adatmodositas += ',ProfilKepUtvonal=?';
            tomb += `,${request.body.KépÚtvonal}`;
        }
        adatmodositas += ` WHERE FelhID LIKE ${profil}`;
        await lekeres(adatmodositas, tomb.split(','));
        response.status(200).json({
            message: 'Siker!'
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Hiba!'
        });
    }
});
//
//
//
//KOKTÉL ADATLAP
//
//
//
router.get('/Koktel/:id', async (request, response) => {
    const KoktelLekeres =
        'SELECT Felhasználónév,RegisztracioDatuma,KeszitesDatuma,KoktelCim,Alap,Recept,KoktélID,FelhID,AlapMennyiseg FROM koktél INNER JOIN felhasználó ON koktél.Keszito=felhasználó.FelhID WHERE KoktélID LIKE ?';
    const KommentLekeres =
        'SELECT KommentID,Felhasználónév,Keszito,Tartalom,RegisztracioDatuma FROM komment INNER JOIN felhasználó ON komment.Keszito=felhasználó.FelhID WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
    const JelvenyLekeres = 'SELECT JelvényID FROM koktélokjelvényei WHERE KoktélID LIKE ?';
    const OsszetevőLekeres = 'SELECT Osszetevő,Mennyiség,Mertekegyseg FROM koktelokosszetevoi WHERE KoktélID LIKE ?';
    const MelyikJelvenyLekeres = 'SELECT JelvényNeve,JelvenyKategoria FROM jelvények WHERE JelvényID LIKE ?';
    const KedvelteELekeres =
        'SELECT COUNT(*) as kedvelteE FROM kedvencek WHERE KikedvelteID LIKE ? AND MitkedveltID LIKE ?';
    const ErtekelteELekeres =
        'SELECT COUNT(*) as ertekelteE FROM ertekeles WHERE Keszito LIKE ? AND HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
    const ErtekelesLekeres =
        'SELECT Ertekeles FROM ertekeles WHERE Keszito LIKE ? AND HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';

    try {
        let osszetevok = await lekeres(OsszetevőLekeres, request.params.id);
        let jelvenyek = await lekeres(JelvenyLekeres, request.params.id);
        let jelvényinfo = [];
        for (let i = 0; i < jelvenyek.length; i++) {
            jelvényinfo.push(await lekeres(MelyikJelvenyLekeres, jelvenyek[i].JelvényID));
        }
        let koktel = await lekeres(KoktelLekeres, request.params.id);
        let komment = await lekeres(KommentLekeres, [request.params.id, 'Koktél']);
        let kedv = false;
        let ert = false;
        let ertekeles;
        if (jwt.decode(request.cookies.auth_token) != null) {
            if (koktel[0].FelhID == jwt.decode(request.cookies.auth_token).userID) {
                koktel[0].UgyanazE = true;
            } else {
                koktel[0].UgyanazE = false;
            }
            for (let j = 0; j < komment.length; j++) {
                if (komment[j].Keszito == jwt.decode(request.cookies.auth_token).userID) {
                    komment[j].UgyanazE = true;
                } else {
                    komment[j].UgyanazE = false;
                }
            }
            let kedvenc = await lekeres(KedvelteELekeres, [
                jwt.decode(request.cookies.auth_token).userID,
                request.params.id
            ]);
            if (kedvenc[0].kedvelteE > 0) {
                kedv = true;
            }
            let ertekelt = await lekeres(ErtekelteELekeres, [
                jwt.decode(request.cookies.auth_token).userID,
                request.params.id,
                'Koktél'
            ]);
            if (ertekelt[0].ertekelteE > 0) {
                ert = true;
                ertekeles = await lekeres(ErtekelesLekeres, [
                    jwt.decode(request.cookies.auth_token).userID,
                    request.params.id,
                    'Koktél'
                ]);
            }
        }

        if (koktel.length != 0) {
            response.status(200).json({
                adat: koktel,
                komment: komment,
                jelvenyek: jelvényinfo,
                osszetevok: osszetevok,
                belepette: jwt.decode(request.cookies.auth_token) != null ? true : false,
                kedveltee: kedv,
                ertekeltee: ert,
                ertekeles: ert == true ? ertekeles[0].Ertekeles : 0
            });
        } else {
            response.status(500).json({
                message: 'Hiba!'
            });
        }
    } catch (error) {
        console.log(error);

        response.status(500).json({
            message: 'Hiba!'
        });
    }
});
router.post('/Koktel/SendErtekeles', async (request, response) => {
    const ErtekelesKuldes = 'INSERT INTO Ertekeles (Keszito,HovaIrták,MilyenDologhoz,Ertekeles) VALUES (?,?,?,?)';
    await lekeres(ErtekelesKuldes, [
        jwt.decode(request.cookies.auth_token).userID,
        request.body.Koktél,
        'Koktél',
        request.body.Tartalom
    ]);
    response.status(200).json({
        message: 'Sikeres Küldés'
    });
});
router.post('/Koktel/SendKomment', async (request, response) => {
    const KommentKuldes = 'INSERT INTO komment (Keszito,HovaIrták,MilyenDologhoz,Tartalom) VALUES (?,?,?,?)';
    await lekeres(KommentKuldes, [
        jwt.decode(request.cookies.auth_token).userID,
        request.body.Koktél,
        'Koktél',
        request.body.Tartalom
    ]);
    response.status(200).json({
        message: 'Sikeres Küldés'
    });
});

router.post('/Koktel/SendKedvenc', async (request, response) => {
    const KedvencKeres =
        'SELECT COUNT(*) as kedvelteE FROM kedvencek WHERE KikedvelteID LIKE ? AND MitkedveltID LIKE ?';
    const KedvencKuldes = 'INSERT INTO kedvencek (KikedvelteID,MitkedveltID) VALUES (?,?)';
    const KedvencTorles = 'DELETE FROM kedvencek WHERE KikedvelteID LIKE ? AND MitkedveltID LIKE ?';
    let kedvszam = await lekeres(KedvencKeres, [jwt.decode(request.cookies.auth_token).userID, request.body.Koktél]);

    if (kedvszam[0].kedvelteE > 0) {
        await lekeres(KedvencTorles, [jwt.decode(request.cookies.auth_token).userID, request.body.Koktél]);
    } else {
        await lekeres(KedvencKuldes, [jwt.decode(request.cookies.auth_token).userID, request.body.Koktél]);
    }
    response.status(200).json({
        message: 'Sikeres Küldés'
    });
});

router.post('/Koktel/DeleteKomment', async (request, response) => {
    const KommentTorles = 'DELETE FROM komment WHERE KommentID LIKE ?';
    const JelentesLekeres =
        'SELECT JelentesID from jelentesek WHERE JelentettTartalomID LIKE ? AND JelentesTipusa LIKE ?';
    const JelentesTorles = 'DELETE FROM jelentesek WHERE JelentesID LIKE ?';
    const JelentőTorles = 'DELETE FROM jelentők WHERE JelentésID LIKE ?';

    let id = request.body.id;
    await lekeres(KommentTorles, [id]);
    let jelentesek = await lekeres(JelentesLekeres, [id, 'Komment']);

    for (let i = 0; i < jelentesek.length; i++) {
        await lekeres(JelentőTorles, [jelentesek[i].JelentesID]);
        await lekeres(JelentesTorles, [jelentesek[i].JelentesID]);
    }
    response.status(200).json({
        message: 'Sikeres Törlés'
    });
});

router.post('/Koktel/DeleteKoktel', async (request, response) => {
    const KommentTorles = 'DELETE FROM komment WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
    const ErtekelesTorles = 'DELETE FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
    const JelentesLekeres =
        'SELECT JelentesID from jelentesek WHERE JelentettTartalomID LIKE ? AND JelentesTipusa LIKE ?';
    const JelentesTorles = 'DELETE FROM jelentesek WHERE JelentesID like ?';
    const JelentőTorles = 'DELETE FROM jelentők WHERE JelentésID LIKE ?';
    const KedvencTorles = 'DELETE FROM kedvencek WHERE MitkedveltID LIKE ?';
    const JelvenyTorles = 'DELETE FROM koktélokjelvényei WHERE KoktélID LIKE ?';
    const OsszetevoTorles = 'DELETE FROM koktelokosszetevoi WHERE KoktélID LIKE ?';
    const KoktelTorles = 'DELETE FROM koktél WHERE KoktélID LIKE ?';
    let id = request.body.id;
    await lekeres(KommentTorles, [id, 'Koktél']);
    await lekeres(ErtekelesTorles, [id, 'Koktél']);
    await lekeres(OsszetevoTorles, [id]);
    await lekeres(KedvencTorles, [id]);
    await lekeres(JelvenyTorles, [id]);
    let jelentesek = await lekeres(JelentesLekeres, [id, 'Koktél']);
    for (let i = 0; i < jelentesek.length; i++) {
        await lekeres(JelentőTorles, [jelentesek[i].JelentesID]);
        await lekeres(JelentesTorles, [jelentesek[i].JelentesID]);
    }
    await lekeres(KoktelTorles, [id]);
    response.status(200).json({
        message: 'Sikeres Törlés'
    });
});

router.post('/Koktel/SendJelentes', async (request, response) => {
    try {
        const Jelentesek = 'SELECT * FROM jelentesek';
        const Jelentők = 'SELECT * FROM jelentők';
        const JelentesekLista = await lekeres(Jelentesek);
        const JelentőkLista = await lekeres(Jelentők);
        let VanEMarIlyen = false;
        let JelentetteMar = false;
        let MelyikAz;
        for (let i = 0; i < JelentesekLista.length; i++) {
            if (
                request.body.JelentettID == JelentesekLista[i].JelentettID &&
                request.body.JelentettTartalomID == JelentesekLista[i].JelentettTartalomID &&
                request.body.JelentesTipusa == JelentesekLista[i].JelentesTipusa
            ) {
                VanEMarIlyen = true;
                MelyikAz = JelentesekLista[i].JelentesID;
                for (let j = 0; j < JelentőkLista.length; j++) {
                    if (
                        MelyikAz == JelentőkLista[j].JelentésID &&
                        jwt.decode(request.cookies.auth_token).userID == JelentőkLista[j].JelentőID
                    ) {
                        JelentetteMar = true;
                    }
                }
            }
        }

        if (JelentetteMar != true) {
            const JelentoKuldes = 'INSERT INTO jelentők (JelentőID,JelentésID,JelentesIndoka) VALUES (?,?,?)';
            if (VanEMarIlyen == false) {
                const JelentesKuldes =
                    'INSERT INTO jelentesek (JelentettID,JelentettTartalomID,JelentesTipusa) VALUES (?,?,?)';
                await lekeres(JelentesKuldes, [
                    request.body.JelentettID,
                    request.body.JelentettTartalomID,
                    request.body.JelentesTipusa
                ]);
                let utolso = await lekeres('SELECT COUNT(*) as Darab FROM jelentesek');
                await lekeres(JelentoKuldes, [
                    jwt.decode(request.cookies.auth_token).userID,
                    utolso[0].Darab,
                    request.body.Indok
                ]);
            } else {
                const JelentesModositas =
                    'UPDATE jelentesek SET JelentesMennyisege =JelentesMennyisege+1 WHERE JelentesID LIKE ?';
                await lekeres(JelentesModositas, MelyikAz);
                await lekeres(JelentoKuldes, [
                    jwt.decode(request.cookies.auth_token).userID,
                    MelyikAz,
                    request.body.Indok
                ]);
            }
        }
        response.status(200).json({
            message: JelentetteMar
        });
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;
