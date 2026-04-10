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
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
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

async function kepculling() {
    const felhkep =
        'SELECT ProfilkepUtvonal FROM felhasználó;SELECT BoritoKepUtvonal FROM koktél;SELECT TermekKepUtvonal FROM webshoptermek';
    let sqlkepek = await lekeres(felhkep);
    let kepek = [];
    for (let i = 0; i < sqlkepek.length; i++) {
        sqlkepek[i].forEach((element) => {
            kepek.push(Object.values(element)[0]);
        });
    }
    let mappa = await fajlkezelo.readdir(path.join(__dirname, '../images/'));
    for (let i = 0; i < mappa.length; i++) {
        if (!kepek.includes(mappa[i])) {
            fajlkezelo.rm(path.join(__dirname, '../images/', mappa[i]));
        }
    }
}

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
        const queryJelentettTartalmak =
            'SELECT JelentettTartalomID FROM jelentesek WHERE JelentesTipusa LIKE ? AND JelentesAllapota LIKE 2';

        let [jelentettTartalomID] = await DBconnetion.promise().query(queryJelentettTartalmak, ['Koktél']);
        console.log(jelentettTartalomID);

        jelentettTartalomID = jelentettTartalomID.map((a) => {
            return a.JelentettTartalomID;
        });
        console.log(jelentettTartalomID);

        let queryKoktelok = 'SELECT * FROM koktél';

        if (jelentettTartalomID.length > 0) {
            queryKoktelok += ' WHERE KoktélID NOT IN (?)';
        }
        const queryKoktelOsszetevok = 'SELECT Osszetevő, Mennyiség FROM koktelokosszetevoi WHERE KoktélID = ?';
        //Majd ide kell tennem a szuroket, de viszont elotte viszont at kell alakitani a kapott szueresi felteteleket id-kra
        const queryKoktelJelvenyek = 'SELECT JelvényID FROM koktélokjelvényei WHERE KoktélID = ?';
        const queryJelvenyek = 'SELECT JelvényNeve, JelvenyKategoria FROM jelvények WHERE JelvényID IN (?)';
        const queryErtekelesek =
            'SELECT AVG(Ertekeles) as Osszert FROM ertekeles WHERE MilyenDologhoz = "Koktél" AND HovaIrták = ?';
        //promise().igeret amit esku hogy megcsinalok - MIERT NEM MUKODOTT ALAPBOL: mert a query callback alapu igy egy CALLBACK HELL-t csinaltam es azt nem lehet await-elni
        //promise() egy igeretet tesz es csak ezt lehet await-ni callbacket nem, ezert kellett promise() igy az atalakitja callbackbol promise-ba
        const [koktelok] = await DBconnetion.promise().query(queryKoktelok, [jelentettTartalomID]);
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
        const queryJelentettTartalmak =
            'SELECT JelentettTartalomID FROM jelentesek WHERE JelentesTipusa LIKE ? AND JelentesAllapota LIKE 2';

        let [jelentettTartalomID] = await DBconnetion.promise().query(queryJelentettTartalmak, ['Koktél']);
        console.log(jelentettTartalomID);

        jelentettTartalomID = jelentettTartalomID.map((a) => {
            return a.JelentettTartalomID;
        });
        console.log(jelentettTartalomID);

        let { koktelNev } = req.params;
        //console.log(koktelNev);
        koktelNev.toLowerCase();
        koktelNev = '%' + koktelNev + '%';

        let queryKoktelok = 'SELECT * FROM koktél WHERE LOWER(KoktelCim) LIKE ?';

        if (jelentettTartalomID.length > 0) {
            queryKoktelok += ' AND KoktélID NOT IN (?)';
        }

        const queryKoktelOsszetevok = 'SELECT Osszetevő, Mennyiség FROM koktelokosszetevoi WHERE KoktélID = ?';
        //Majd ide kell tennem a szuroket, de viszont elotte viszont at kell alakitani a kapott szueresi felteteleket id-kra
        const queryKoktelJelvenyek = 'SELECT JelvényID FROM koktélokjelvényei WHERE KoktélID = ?';
        const queryJelvenyek = 'SELECT JelvényNeve, JelvenyKategoria FROM jelvények WHERE JelvényID IN (?)';
        const queryErtekelesek =
            'SELECT AVG(Ertekeles) as Osszert FROM ertekeles WHERE MilyenDologhoz = "Koktél" AND HovaIrták = ?';
        //promise().igeret amit esku hogy megcsinalok - MIERT NEM MUKODOTT ALAPBOL: mert a query callback alapu igy egy CALLBACK HELL-t csinaltam es azt nem lehet await-elni
        //promise() egy igeretet tesz es csak ezt lehet await-ni callbacket nem, ezert kellett promise() igy az atalakitja callbackbol promise-ba
        const [koktelok] = await DBconnetion.promise().query(queryKoktelok, [koktelNev, jelentettTartalomID]);
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

        const queryJelentettTartalmak =
            'SELECT JelentettTartalomID FROM jelentesek WHERE JelentesTipusa LIKE ? AND JelentesAllapota LIKE 2';

        let [jelentettTartalomID] = await DBconnetion.promise().query(queryJelentettTartalmak, ['Koktél']);
        console.log(jelentettTartalomID);

        jelentettTartalomID = jelentettTartalomID.map((a) => {
            return a.JelentettTartalomID;
        });
        console.log(jelentettTartalomID);

        if (jelentettTartalomID.length > 0) {
            if (queryKoktelok.includes('WHERE')) {
                queryKoktelok += ' AND KoktélID NOT IN (?)';
            } else {
                queryKoktelok += ' WHERE KoktélID NOT IN (?)';
            }
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
        const [koktelok] = await DBconnetion.promise().query(queryKoktelok, [jelentettTartalomID]);
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

                    //ellenorizni kell hogy a ellenorizendo tomb es a szuresTomb megegyezik e -- a koktel jelvenyeinek tombje
                    let ellenorizendoTomb = jelvenyek.map((jelveny) => jelveny.JelvényNeve);
                    //console.log(ellenorizendoTomb);

                    let szerepel = 0;

                    for (let i = 0; i < szuresTomb.length; i++) {
                        if (ellenorizendoTomb.includes(szuresTomb[i])) {
                            szerepel++;
                        }
                    }

                    if (szerepel > 0) {
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

router.patch('/Koktelok/nepszeruseg/:id', async (req, res) => {
    try {
        const query = 'UPDATE koktél SET KoktelNepszeruseg = KoktelNepszeruseg + 1 WHERE KoktélID LIKE ?';
        await DBconnetion.promise().query(query, [req.params.id]);
        res.status(200).json({ message: 'Nepszeruseg frissites' });
    } catch (error) {
        res.status(500).json({ message: 'Hiba tortent a vegpont elereseben', error: error });
    }
});

//Regisztracio oldalrol hoz ide majd tolti fel az adatokat az adatbazisba
router.post('/regisztracio', async (request, response) => {
    try {
        //console.log(request.body);

        if (request.body.jelszo == request.body.jelszoIsmet) {
            if (
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(request.body.email) &&
                /^[a-zA-Z0-9_]{2,30}$/.test(request.body.felhaszanaloNev) &&
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(request.body.jelszo) &&
                request.body.ASZF
            ) {
                const hashed = await argon.hash(request.body.jelszo, { type: argon.argon2id });

                const felhasznaloObjReg = {
                    email: request.body.email,
                    felhasznaloNev: request.body.felhasznaloNev,
                    jelszo: hashed
                };

                const duplikacioEll = 'SELECT FelhID FROM felhasználó WHERE Felhasználónév LIKE ? OR Email LIKE ?';

                const [rows] = await DBconnetion.promise().query(duplikacioEll, [
                    felhasznaloObjReg.felhasznaloNev,
                    felhasznaloObjReg.email
                ]);

                if (rows.length == 0) {
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
                                    megEgyezik: false,
                                    kriterium: false,
                                    duplikacio: false,
                                    sikeres: true
                                });
                                /*
                    console.log(
                        'Adatok melyek felettek toltve: ' +
                            felhasznaloObjReg.felhasznaloNev +
                            ' ' +
                            felhasznaloObjReg.email +
                            ' ' +
                            felhasznaloObjReg.jelszo
                    );*/
                            }
                        }
                    );
                } else {
                    response
                        .status(200)
                        .json({ megEgyezik: false, kriterium: false, duplikacio: true, sikeres: false });
                }
            } else {
                response.status(200).json({ megEgyezik: false, kriterium: true, duplikacio: false, sikeres: false });
            }
        } else {
            response.status(200).json({ megEgyezik: true, kriterium: false, duplikacio: false, sikeres: false });
        }

        //console.log(felhasznaloObjReg.jelszo);
    } catch (err) {
        console.log('Valamilyen extra hiba tortent: ' + err);
        response.status(500).json({
            message: 'Hiba tortent adat feltoltesnel!' + err
        });
    }
});
//A belepes oldal hoz ide, lekeri azt a sort amiben a felhasznalo adatai vannak, persz ha van ilyen egyaltalan
router.post('/belepes', (request, response) => {
    try {
        //console.log(request.body);
        // Ez a kapott ertekek a formbol
        const felhasznaloObj = {
            felhasznalo: request.body.felhasznalo,
            jelszo: request.body.jelszo
        };

        //kriterium ellenorzes -- min / max hozzatetele
        if (
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(felhasznaloObj.felhasznalo) &&
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{2,}$/.test(felhasznaloObj.jelszo)
        ) {
            const sqlQuery = 'SELECT FelhID, Email, Jelszó, Admin FROM felhasználó WHERE Email LIKE ?';

            DBconnetion.query(sqlQuery, [felhasznaloObj.felhasznalo], async (err, rows) => {
                if (err) {
                    response.status(500).json({
                        message: 'Adatbazissal kapcsolatos hiba!',
                        error: err
                    });
                } else {
                    //ez az adatbazisbol kapott felhasznaloi sor
                    //console.log(rows);

                    const felhasznaloDB = rows[0];
                    //console.log(felhasznaloDB);

                    if (felhasznaloDB == undefined) {
                        response.status(200).json({ kriterium: false, hiba: true, sikeres: false });
                    } else {
                        //megnezi az argon package ellenorzi hogy az eltarolt jelszo megegyezik a beirt jelszoval
                        const jelszoEll = await argon.verify(felhasznaloDB.Jelszó, felhasznaloObj.jelszo);
                        if (jelszoEll) {
                            //web token letrehozasa
                            //console.log('Adatbazis: ' + felhasznaloDB.FelhID);
                            //console.log('Adatbazis: ' + felhasznaloDB.Admin);
                            //console.log(felhasznaloObj);

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
                                httpOnly: true,
                                sameSite: 'none',
                                secure: true,
                                path: '/'
                            });

                            response.status(200).json({ kriterium: false, hiba: false, sikeres: true });
                        } else {
                            response.status(200).json({
                                kriterium: false,
                                hiba: true,
                                sikeres: false
                            });
                        }
                    }
                }
            });
        } else {
            response.status(200).json({ kriterium: true, hiba: false, sikeres: false });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ message: 'Hiba van a vegpontban', error: err });
    }
});

router.post('/felhasznaloEllenorzes', async (req, res) => {
    try {
        let email = req.body.email;
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            const query = 'SELECT Email FROM felhasználó WHERE Email LIKE ?';
            //letezik e felhasznalo egyaltalan
            const [rows] = await DBconnetion.promise().query(query, [email]);
            if (rows.length > 0) {
                //ez a sor az emailt kodolja base64 segitsegevel, ez nem biztonsagos kodolas, csak szimplan nem akarom az emailt csak ugy megejeleniteni
                email = Buffer.from(email, 'utf-8').toString('base64');
                res.status(200).json({ redirect: '/felhasznaloAuth', kod: email });
            } else {
                res.status(200).json({ ures: false, nincs: true });
            }
        } else {
            res.status(200).json({ ures: true, nincs: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ hiba: true });
    }
});

let emailKod;

//email kikuldi --- tobbszor hasznalhato vegpont
router.get('/emailKuldes', async (req, res) => {
    try {
        const urlArr = req.get('referer').split('/');
        const emailCoded = urlArr[urlArr.length - 1];
        //dekodolt email base64-bol at utf8-ba
        const emailDeCoded = Buffer.from(emailCoded, 'base64').toString('utf-8');

        //generaluk egy 6 jegy kodot amelyet beleteszunk az emailbe, amit majd elkerunk a felhasznalotol ezel authenticalva
        function generateCode(length = 6) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const bytes = crypto.randomBytes(length);

            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars[bytes[i] % chars.length];
            }
            return result;
        }

        emailKod = generateCode();
        //console.log(process.env.GUSER);
        //console.log(process.env.GPASS);

        const transporter = nodemailer.createTransport({
            //domain ez lehetne a outlook stb.. a szolgaltato
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GUSER,
                pass: process.env.GPASS
            }
        });

        try {
            await transporter.sendMail({
                from: process.env.GUSER,
                to: emailDeCoded,
                subject: 'Elfelejtett jelszo',
                html: `<h2>Az On kodja:</h2><p style="color: blue;">${emailKod}</p>`
            });

            res.status(200).json({ message: 'sikeres email kuldes!' });
        } catch (err) {
            throw new Error('sikertelen email kuldes');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

router.post('/kodEllenorzes', (req, res) => {
    try {
        const kuldottKod = req.body.kod;
        const urlArr = req.get('referer').split('/');
        const emailCoded = urlArr[urlArr.length - 1];
        console.log('kuldott: ' + kuldottKod);
        console.log('email: ' + emailKod);

        if (kuldottKod.length > 0) {
            if (kuldottKod == emailKod) {
                res.status(200).json({
                    helyes: true,
                    redirect: '/jelszoValtoztatas',
                    kod: emailCoded,
                    ures: false,
                    hibas: false
                });
            } else {
                res.status(200).json({ helyes: false, ures: false, hibas: true });
            }
        } else {
            res.status(200).json({ ures: true, helyes: false, hibas: false });
        }
    } catch (error) {
        console.error(err);
        res.status(500).json({ err: error });
    }
});

router.patch('/jelszoValtoztatas', async (req, res) => {
    try {
        const jelszo1 = req.body.jelszo1;
        const jelszo2 = req.body.jelszo2;

        const kuldottKod = req.body.kod;
        const urlArr = req.get('referer').split('/');
        const emailCoded = urlArr[urlArr.length - 1];
        const emailDeCoded = Buffer.from(emailCoded, 'base64').toString('utf-8');

        if (
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{2,}$/.test(jelszo1) &&
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{2,}$/.test(jelszo2)
        ) {
            if (jelszo1 == jelszo2) {
                //titkositas
                const kodoltJelszo = await argon.hash(jelszo1, { type: argon.argon2id });
                const query = 'UPDATE felhasználó SET Jelszó = ? WHERE Email LIKE ?';
                const [rows] = await DBconnetion.promise().query(query, [kodoltJelszo, emailDeCoded]);

                res.status(200).json({
                    kriterium: false,
                    egyezes: false,
                    megvaltoztatva: true,
                    valtoztatottSorok: rows.affectedRows
                });
            } else {
                res.status(200).json({ kriterium: false, egyezes: true, megvaltoztatva: false });
            }
        } else {
            res.status(200).json({ kriterium: true, egyezes: false, megvaltoztatva: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Hiba tortent', error: error });
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

router.post('/AdminPanel/KoktelFeltoltes', authenticationMiddleware, authorizationMiddelware, async (req, res) => {
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
        res.status(200).json({ message: 'Sikeres koktel feltoltes' });
        await kepculling();
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
            termekKategoria,
            termekUrtartalom
        } = req.body;

        if (termekKategoria == 'Eszkozok' || termekKategoria == 'Merch') {
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

            res.status(200).json({ message: 'Termek hozzadva sikeresen' });
        } else {
            if (termekKategoria == 'Pohar') {
                const termekQuery =
                    'INSERT INTO webshoptermek (TermekCim, TermekLeiras, TermekKiszereles, TermekUrtartalom, TermekKeszlet, TermekKepUtvonal, TermekKategoria, TermekMarka, TermekSzarmazas, Ar) VALUES (?,?,?,?,?,?,?,?,?,?)';
                await DBconnetion.promise().query(termekQuery, [
                    termekNev,
                    termekLeiras,
                    termekKiszereles,
                    termekUrtartalom,
                    termekKeszlet,
                    fajlNeve,
                    termekKategoria,
                    termekMarka,
                    termekSzarmazas,
                    termekAra
                ]);
                res.status(200).json({ message: 'Termek hozzadva sikeresen' });
            } else {
                //Ha alkoholt tartalmazo kategoriarol van szo
                const termekQuery =
                    'INSERT INTO webshoptermek (TermekCim, TermekLeiras, TermekKiszereles, TermekUrtartalom, TermekKeszlet, TermekKepUtvonal, TermekKategoria, TermekMarka, TermekSzarmazas, TermekAlkoholSzazalek, TermekKora, Ar) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
                await DBconnetion.promise().query(termekQuery, [
                    termekNev,
                    termekLeiras,
                    termekKiszereles,
                    termekUrtartalom,
                    termekKeszlet,
                    fajlNeve,
                    termekKategoria,
                    termekMarka,
                    termekSzarmazas,
                    req.body.termekAlkohol,
                    req.body.termekKora,
                    termekAra
                ]);
                res.status(200).json({ message: 'Termek hozzadva sikeresen' });
                await kepculling();
            }
        }
    } catch (error) {
        console.log(error);

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
    let adat ='SELECT Felhasználónév,Email,JelszóHossza,RegisztracioDatuma,ProfilkepUtvonal FROM felhasználó WHERE FelhID LIKE ?';
    let kedvenc="SELECT COUNT(KiKedvelteID) AS KEDVID from felhasználó INNER JOIN kedvencek ON FelhID=KiKedvelteID WHERE FelhID LIKE ?"
    let komment="SELECT COUNT(komment.Keszito) AS KOMMID from felhasználó INNER JOIN komment ON FelhID=komment.Keszito WHERE FelhID LIKE ?"
    let ertekeles="SELECT COUNT(ertekeles.Keszito) AS RATEID from felhasználó INNER JOIN ertekeles ON FelhID=ertekeles.Keszito WHERE FelhID LIKE ?"
    let keszitett="SELECT COUNT(koktél.Keszito) AS MAKEID from felhasználó INNER JOIN koktél ON FelhID=koktél.Keszito WHERE FelhID LIKE ?"
    //Lekérdezés
    try {
        adat=(await lekeres(adat,jwt.decode(request.cookies.auth_token).userID))[0]
        kedvenc=(await lekeres(kedvenc,jwt.decode(request.cookies.auth_token).userID))[0]
        komment=(await lekeres(komment,jwt.decode(request.cookies.auth_token).userID))[0]
        ertekeles=(await lekeres(ertekeles,jwt.decode(request.cookies.auth_token).userID))[0]
        keszitett=(await lekeres(keszitett,jwt.decode(request.cookies.auth_token).userID))[0]
        let tartalom={adat,kedvenc,komment,ertekeles,keszitett}
        response.status(200).json({
            message:"Sikeres Lekérés!",
            tartalom:tartalom
        })
    } 
    catch (error) {
        console.log(error);
        response.status(500).json({
            message:"Hiba Történt!"
        })
    }

    
    
    
});

router.get('/AdatlapLekeres/Kedvencek/', async (request, response) => {
    try {
        //A Lekérés definiálása
        let KedvencekLekeres = 'SELECT MitKedveltID from kedvencek WHERE KikedvelteID LIKE ?';
        let koktelok=await lekeres(KedvencekLekeres,jwt.decode(request.cookies.auth_token).userID)
        let kokteltomb=[]
        for (let i = 0; i < koktelok.length; i++) 
        {
            kokteltomb.push(await getKoktel(koktelok[i].MitKedveltID))
        }
        if (kokteltomb.length!=0) 
        {
            response.status(200).json({
                message:"Sikeres Lekérés!",
                adat:kokteltomb
            })
        }
        else
        {
            response.status(204).json({
                message:"Üres Lekérés!"
            })
        }
    } 
    catch (error) {
        console.log(error);
        response.status(500).json({
            message:"Hibás Lekérés!"
        })
    }
});

router.get('/AdatlapLekeres/Koktelok/', async (request, response) => {
    try {
        //A Lekérés definiálása
        let koktelokLekeres = 'SELECT KoktélID from koktél where Keszito like ?';
        let koktelok=await lekeres(koktelokLekeres,jwt.decode(request.cookies.auth_token).userID)
        let kokteltomb=[]
        for (let i = 0; i < koktelok.length; i++) 
        {
            kokteltomb.push(await getKoktel(koktelok[i].KoktélID))
        }
        if (kokteltomb.length!=0) 
        {
            response.status(200).json({
                message:"Sikeres Lekérés!",
                adat:kokteltomb
            })
        }
        else
        {
            response.status(204).json({
                message:"Üres Lekérés!"
            })
        }
    } 
    catch (error) {
        console.log(error);
        response.status(500).json({
            message:"Hibás Lekérés!"
        })
    }
    
});

async function getKoktel(id) {
    let koktelokLekeres = 'SELECT KoktelCim,BoritoKepUtvonal,KoktélID from koktél where KoktélID like ?';
    let ertekelesAtlagLekeres ='SELECT AVG(Ertekeles) as Osszert from ertekeles where HovaIrták like ? AND MilyenDologhoz LIKE "Koktél"';
    let osszetevokLekerese = 'SELECT Osszetevő from koktelokosszetevoi where KoktélID like ?';
    let koktélbadgek = 'SELECT JelvényID FROM koktélokjelvényei WHERE KoktélID LIKE ?';
    let badgek = 'SELECT JelvényNeve,JelvenyKategoria FROM jelvények WHERE JelvényID LIKE ?';
    let kommentLekeres ='SELECT Count(HovaIrták) as KommNum from komment WHERE HovaIrták like ? AND MilyenDologhoz LIKE "Koktél"';

    //Lekérdezés
    let adat = (await lekeres(koktelokLekeres, id))[0];
    let ertekeles = (await lekeres(ertekelesAtlagLekeres, id))[0];
    let osszetevok = await lekeres(osszetevokLekerese,id);
    let jelvenyadatok = await lekeres(koktélbadgek,id);
    let kommentek = (await lekeres(kommentLekeres, id))[0];

    let jelvenyek = [];
    for (let j = 0; j < jelvenyadatok.length; j++) {
        jelvenyek.push((await lekeres(badgek, jelvenyadatok[j].JelvényID))[0]);
    }
    return {adat,ertekeles,osszetevok,jelvenyek,kommentek};
}


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
            response.status(200).json({
                message: 'Nincs Jelentésed!'
            });
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
        console.log(error);

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
    let TermekLekeres = 'SELECT TermekCim,TermekLeiras,TermekKepUtvonal,TermekKeszlet FROM webshoptermek WHERE TermekID LIKE ?';
    let TermekErtekelesLekeres = 'SELECT AVG(ertekeles) AS Osszert FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE "Termék"';
    let TermekKommentLekeres = 'SELECT COUNT(KommentID) AS KommNum FROM komment WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE "Termék"';
    //Adattárolók
    let vasarlo = jwt.decode(request.cookies.auth_token).userID;
    let kosar;
    let kosartermekek;
    let adatok=[]
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    //Lekérdezés
    try {
        kosar = await lekeres(KosarLekeres, vasarlo);
        kosartermekek = await lekeres(KosarTermekLekeres, kosar[0].SessionID);
        if (kosartermekek.length == 0) {
            response.status(200).json({
                message: 'Üres Kosár'
            });
        } else {
            for (let i = 0; i < kosartermekek.length; i++) {
                let kosarAdatok=kosartermekek[i]
                let termAdatok = (await lekeres(TermekLekeres, kosartermekek[i].TermekID))[0];          
                let ertekeles = (await lekeres(TermekErtekelesLekeres, kosartermekek[i].TermekID))[0];
                let kommentek = (await lekeres(TermekKommentLekeres, kosartermekek[i].TermekID))[0];
                adatok.push({kosarAdatok,termAdatok,ertekeles,kommentek})

            }
            response.status(200).json({
                message: 'Sikeres Lekérés!',
                adat: adatok
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

router.delete('/AdatlapLekeres/Kosarurites', async (request, response) => {
    let KosárÜrítés = 'DELETE FROM KosárTermék WHERE KosarID LIKE ?';
    try {
        await lekeres(KosárÜrítés, jwt.decode(request.cookies.auth_token).userID);
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

router.delete('/AdatlapLekeres/TermekUrites', async (request, response) => {
    let mit = request.body.termék;
    console.log(mit);
    
    let honnan = await lekeres(
        'SELECT SessionID FROM kosár WHERE UserID LIKE ?',
        jwt.decode(request.cookies.auth_token).userID
    );
    let TermékTörlés = 'DELETE FROM KosárTermék WHERE KosarID LIKE ? AND TermekID LIKE ?';
    try {
        await DBconnetion.promise().query(TermékTörlés, [honnan[0].SessionID, mit]);
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

router.patch('/AdatlapLekeres/TermekFrissites', async (request, response) => {
    let mit = request.body.termék;
    let mennyit = request.body.count;
    let TermékTöltés = 'UPDATE KosárTermék SET Darabszam = ? WHERE KosarID LIKE ? AND TermekID LIKE ?';
    try {
        await DBconnetion.promise().query(TermékTöltés, [mennyit, jwt.decode(request.cookies.auth_token).userID, mit]);
        response.status(200).json({
            message: 'Sikeres Frissítés!'
        });
    } catch (error) {
        console.log(error);

        response.status(500).json({
            message: 'Hiba Történt!',
            hiba: error
        });
    }
});

router.delete('/AdatlapLekeres/JelentesTorles', async (request, response) => {
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


router.get('/AdatlapLekeres/KepLekeres/:kep', async (request, response) => {
    try {
        response.sendFile(path.join(__dirname, '..', 'images', request.params.kep));
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

router.get('/Koktelok/KepLekeres', async (request, response) => {
    try {
        let profil = jwt.decode(request.cookies.auth_token).userID;
        let kepkereses = 'SELECT ProfilkepUtvonal FROM felhasználó WHERE FelhID LIKE ?';
        let kinek = await lekeres(kepkereses, profil);
        response.sendFile(path.join(__dirname, '..', 'images', kinek[0].ProfilkepUtvonal));
    } catch (error) {
        console.log(error);
    }
});

router.put('/AdatlapLekeres/Adatmodositas/', async (request, response) => {
    try {
        let hiba = false;
        let tomb = '';
        let adatmodositas = 'UPDATE felhasználó SET Felhasználónév=?,Email=?';
        if (
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(request.body.Email) &&
            /^[a-zA-Z0-9_]{2,30}$/.test(request.body.Felhasználónév)
        ) {
            tomb = `${request.body.Felhasználónév},${request.body.Email}`;
        } else {
            hiba = true;
        }
        let profil = jwt.decode(request.cookies.auth_token).userID;
        if (request.body.Jelszó != 'undefined' && hiba == false) {
            if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(request.body.Jelszó)) {
                adatmodositas += ',Jelszó=?';
                tomb += `,${await argon.hash(request.body.Jelszó, { type: argon.argon2id })}`;
            } else {
                hiba = true;
            }
        }
        if (request.body.KépÚtvonal != undefined && hiba == false) {
            adatmodositas += ',ProfilKepUtvonal=?';
            tomb += `,${request.body.KépÚtvonal}`;
        }
        adatmodositas += ` WHERE FelhID LIKE ${profil}`;
        if (hiba == false) {
            await lekeres(adatmodositas, tomb.split(','));
            await kepculling();
            response.status(200).json({
                message: 'Siker!'
            });
        } else {
            response.status(500).json({
                message: 'Hibás adat!'
            });
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Hiba!'
        });
    }
});

router.delete('/AdatlapLekeres/Fioktorles', async (request, response) => {
    try {
        const FelhasznaloTorles = 'DELETE FROM felhasználó WHERE FelhID LIKE ?';
        const ErtekTorles = 'DELETE FROM ertekeles WHERE Keszito LIKE ?';
        const ErtekTorlesKoktel = 'DELETE FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
        const KoktelTorles = 'DELETE FROM koktél WHERE Keszito LIKE ?';
        const KoktelLekeres = 'SELECT KoktélID FROM koktél WHERE Keszito LIKE ?';
        const JelvenyTorles = 'DELETE FROM koktélokjelvényei WHERE KoktélID LIKE ?';
        const KommentTorlesKoktel = 'DELETE FROM komment WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
        const KommentTorles = 'DELETE FROM komment WHERE Keszito LIKE ?';
        const JelentesTorles = 'DELETE FROM jelentesek WHERE JelentettID LIKE ?';
        const JelentesLekeres = 'SELECT JelentesID FROM jelentesek WHERE JelentettID LIKE ?';
        const KosarTorles = 'DELETE FROM kosár WHERE UserID LIKE ?';
        const KosarLekeres = 'SELECT SessionID FROM kosár WHERE UserID LIKE ?';
        const KosarTermekTorles = 'DELETE FROM kosártermék WHERE KosarID LIKE ?';
        const KedvencTorles = 'DELETE FROM kedvencek WHERE KikedvelteID LIKE ?';
        const OssztevTorles = 'DELETE FROM koktelokosszetevoi WHERE KoktélID LIKE ?';
        const KedvencTorlesKoktel = 'DELETE FROM kedvencek WHERE MitkedveltID LIKE ?';
        const JelentoTorles = 'DELETE FROM jelentők WHERE JelentőID LIKE ?';
        const JelentoJelentesTorles = 'DELETE FROM jelentők WHERE JelentésID LIKE ?';
        await lekeres(ErtekTorles, jwt.decode(request.cookies.auth_token).userID);
        await lekeres(KommentTorles, jwt.decode(request.cookies.auth_token).userID);
        await lekeres(JelentoTorles, jwt.decode(request.cookies.auth_token).userID);
        await lekeres(KedvencTorles, jwt.decode(request.cookies.auth_token).userID);
        let kosarId = await lekeres(KosarLekeres, jwt.decode(request.cookies.auth_token).userID);
        if (kosarId.length != 0) {
            await lekeres(KosarTermekTorles, kosarId[0].SessionID);
            await lekeres(KosarTorles, jwt.decode(request.cookies.auth_token).userID);
        }
        let koktel = await lekeres(KoktelLekeres, jwt.decode(request.cookies.auth_token).userID);
        for (let i = 0; i < koktel.length; i++) {
            await lekeres(ErtekTorlesKoktel, [koktel[i].KoktélID, 'Koktél']);
            await lekeres(KommentTorlesKoktel, [koktel[i].KoktélID, 'Koktél']);
            await lekeres(OssztevTorles, koktel[i].KoktélID);
            await lekeres(JelvenyTorles, koktel[i].KoktélID);
            await lekeres(KedvencTorlesKoktel, koktel[i].KoktélID);
        }
        await lekeres(KoktelTorles, jwt.decode(request.cookies.auth_token).userID);
        let jelentes = await lekeres(JelentesLekeres, jwt.decode(request.cookies.auth_token).userID);
        for (let i = 0; i < jelentes.length; i++) {
            await lekeres(JelentoJelentesTorles, jelentes[i].JelentesID);
        }
        await lekeres(JelentesTorles, jwt.decode(request.cookies.auth_token).userID);
        await lekeres(FelhasznaloTorles, jwt.decode(request.cookies.auth_token).userID);
    } catch (error) {
        console.log(error);

        response.status(500).json({
            message: 'hiba'
        });
    }
});

router.post('/AdatlapLekeres/Fizetes', async (request, response) => {
    try {
        const KosarLekeres = 'SELECT SessionID FROM kosár WHERE UserID LIKE ?';
        const KosarTermekLekeres = 'SELECT TermekID,Darabszam FROM kosártermék WHERE KosarID LIKE ?';
        const TermekFrissites = 'UPDATE webshoptermek SET Termekkeszlet=Termekkeszlet-?,TermekHanyanVettekMeg=TermekHanyanVettekMeg+1  WHERE TermekID LIKE ?';
        const KosárÜrítés = 'DELETE FROM KosárTermék WHERE KosarID LIKE ?';
        let kosar = await lekeres(KosarLekeres, jwt.decode(request.cookies.auth_token).userID);

        let kosartermek = await lekeres(KosarTermekLekeres, kosar[0].SessionID);

        for (let i = 0; i < kosartermek.length; i++) {
            await lekeres(TermekFrissites, [kosartermek[i].Darabszam, kosartermek[i].TermekID]);
        }
        await lekeres(KosárÜrítés, kosar[0].SessionID);
        response.status(200).json({
            message: 'sikeres fizetés!'
        });
    } catch (error) {
        console.log(error);

        response.status(500).json({
            message: 'hiba'
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
        'SELECT Felhasználónév,RegisztracioDatuma,KeszitesDatuma,KoktelCim,Alap,Recept,KoktélID,FelhID,AlapMennyiseg,ProfilkepUtvonal FROM koktél INNER JOIN felhasználó ON koktél.Keszito=felhasználó.FelhID WHERE KoktélID LIKE ?';
    const KommentLekeres =
        'SELECT KommentID,Felhasználónév,Keszito,Tartalom,RegisztracioDatuma,ProfilkepUtvonal FROM komment INNER JOIN felhasználó ON komment.Keszito=felhasználó.FelhID WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
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

router.delete('/Koktel/DeleteKomment', async (request, response) => {
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

router.delete('/Koktel/DeleteKoktel', async (request, response) => {
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
            //Ha a feljelentett felhasználü, feljelentett tartalom és jelentés típusa is egyezik
            if (
                request.body.JelentettID == JelentesekLista[i].JelentettID &&
                request.body.JelentettTartalomID == JelentesekLista[i].JelentettTartalomID &&
                request.body.JelentesTipusa == JelentesekLista[i].JelentesTipusa
            ) {
                //Akkor megjelöljük, hogy nem kell létrehozni új jelentést
                VanEMarIlyen = true;
                //Eltároljuk a jelentés idjét
                MelyikAz = JelentesekLista[i].JelentesID;
                for (let j = 0; j < JelentőkLista.length; j++) {
                    //megnézzük hogy a jelentő felhasználó tett e már ugyanilyen jelentést
                    if (
                        MelyikAz == JelentőkLista[j].JelentésID &&
                        jwt.decode(request.cookies.auth_token).userID == JelentőkLista[j].JelentőID
                    ) {
                        JelentetteMar = true;
                    }
                }
            }
        }

        //Ha nem jelentette
        if (JelentetteMar != true) {
            const JelentoKuldes = 'INSERT INTO jelentők (JelentőID,JelentésID,JelentesIndoka) VALUES (?,?,?)';
            //és nem létezik
            if (VanEMarIlyen == false) {
                //Akkor létrehozunk egy ilyen jelentést
                const JelentesKuldes =
                    'INSERT INTO jelentesek (JelentettID,JelentettTartalomID,JelentesTipusa) VALUES (?,?,?)';
                await lekeres(JelentesKuldes, [
                    request.body.JelentettID,
                    request.body.JelentettTartalomID,
                    request.body.JelentesTipusa
                ]);
                //és a jelentő felhasználó nevében teszünk egy jelentést az utolsó (most létrejött) jelentésre
                let utolso = await lekeres('SELECT COUNT(*) as Darab FROM jelentesek');
                await lekeres(JelentoKuldes, [
                    jwt.decode(request.cookies.auth_token).userID,
                    utolso[0].Darab,
                    request.body.Indok
                ]);
            }
            //és létezik
            else {
                //Akkor a nevében teszünk egy jelentést a már létező jelentésre
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
        //Visszaadjuk hogy jelentette e már ezt a felhasználó
        response.status(200).json({
            message: JelentetteMar
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Hiba!'
        });
    }
});

router.get('/Koktel/KommenteloKepLekeres/:utvonal', async (request, response) => {
    try {
        response.sendFile(path.join(__dirname, '..', 'images', request.params.utvonal));
    } catch (error) {
        console.log(error);
    }
});
//
//
//
//  NewCocktail
//
//
//
//
router.get('/Keszites/JelvenyLekeres', async (req, res) => {
    try {
        const Jelvenylekeres = 'SELECT JelvényNeve,JelvenyKategoria FROM jelvények';

        let iz = [];
        let ero = [];
        let allergen = [];

        DBconnetion.query(Jelvenylekeres, (err, rows) => {
            if (err) {
                throw new Error(err);
            }
            rows.forEach((row) => {
                if (row.JelvenyKategoria == 'ízek') {
                    iz.push(row);
                } else if (row.JelvenyKategoria == 'Erősség') {
                    ero.push(row);
                } else if (row.JelvenyKategoria == 'Allergének') {
                    allergen.push(row);
                }
            });
            res.status(200).json({
                iz: iz,
                erosseg: ero,
                allergen: allergen
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hiba',
            err: error
        });
    }
});
router.post('/Keszites/KepFeltoltes', fileStorage.array('koktélKép'), async (request, response) => {
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
router.post('/Keszites/Feltoltes', async (req, res) => {
    try {
        const felhaszanalo = jwt.decode(req.cookies.auth_token).userID;
        const { nev, mennyiseg, alap, alkoholose, osszetevok, leiras, erosseg, iz, allergen, kepUtvonala } = req.body;
        const UjKoktel =
            'INSERT INTO koktél(Keszito,Alkoholos,Közösségi,KoktelCim,BoritoKepUtvonal,Alap,Recept,AlapMennyiseg) VALUES(?,?,?,?,?,?,?,?)';

        const UjKoktelJelvenyId = 'SELECT JelvényID FROM jelvények WHERE JelvényNeve LIKE ?';
        const UjKoktelJelvenyIdFeltoltes = 'INSERT INTO koktélokjelvényei(KoktélID,JelvényID) VALUES(?,?)';
        const UjKoktelOsszetevokFeltoltes =
            'INSERT INTO koktelokosszetevoi(KoktélID,Osszetevő,Mennyiség,Mertekegyseg) VALUES(?,?,?,?)';

        const [feltolt] = await DBconnetion.promise().query(UjKoktel, [
            felhaszanalo,
            alkoholose,
            1,
            nev,
            kepUtvonala,
            alap,
            leiras,
            mennyiseg
        ]);
        const feltoltottId = feltolt.insertId;

        for (let i = 0; i < osszetevok.length; i++) {
            const [OsszetevoFel] = await DBconnetion.promise().query(UjKoktelOsszetevokFeltoltes, [
                feltoltottId,
                osszetevok[i][0],
                osszetevok[i][1],
                osszetevok[i][2]
            ]);
        }

        if (allergen == undefined) {
            jelvenyek = { lista: [iz, erosseg] };
        } else {
            jelvenyek = { lista: [iz, erosseg, allergen] };
        }
        let JelvenyIdLista = [];
        for (let i = 0; i < jelvenyek.lista.length; i++) {
            console.log(jelvenyek.lista[i]);
            for (let j = 0; j < jelvenyek.lista[i].length; j++) {
                try {
                    console.log(jelvenyek.lista[i][j]);
                    const [JelvenyId] = await DBconnetion.promise().query(UjKoktelJelvenyId, [jelvenyek.lista[i][j]]);
                    console.log(JelvenyId[0].JelvényID);
                    // console.log(JelvenyId[i][j].JelvényID)
                    JelvenyIdLista.push(JelvenyId[0].JelvényID);
                    console.log(JelvenyIdLista);
                } catch (error) {
                    console.log(error);
                }
            }
        }

        for (let id = 0; id < JelvenyIdLista.length; id++) {
            //console.log(JelvenyIdLista)
            const [JelvenyFeltolt] = await DBconnetion.promise().query(UjKoktelJelvenyIdFeltoltes, [
                feltoltottId,
                JelvenyIdLista[id]
            ]);
        }
        console.log('sikeres');
        console.log(feltoltottId);
        res.status(200).json({
            feltoltottid: feltoltottId
        });
    } catch (error) {
        res.status(500).json({ message: 'Sikertelen feltöltés', hiba: error });
    }
});

//
//
//
//
// WebshopMain
//
//
//
//
router.get('/WebShop/TermekLekeres', async (request, response) => {
    try {
        const query = 'SELECT * FROM webshoptermek';
        //console.log(limit)
        const [termekek] = await DBconnetion.promise().query(query);
        
        response.status(200).json({
            data: termekek,
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Hibás lekérés'
        });
    }
});

router.get('/WebShop/HosszLekeres', async (request, response) => {
    try {
        const query = 'SELECT COUNT(TermekID) AS "hossz" FROM webshoptermek';
        //console.log(limit)
        const [hossz] = await DBconnetion.promise().query(query);
        
        response.status(200).json({
            data: hossz[0].hossz,
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Hibás lekérés'
        });
    }
});

router.get('/WebShop/TermekLekeresPag', async (request, response) => {
    try {
        const query = 'SELECT * FROM webshoptermek LIMIT ? OFFSET ?';
        const Lengthquery = 'SELECT COUNT(TermekID) FROM webshoptermek';
        const limit = parseInt(request.query.limit);
        const offset = parseInt(request.query.offset);
        const [termekek] = await DBconnetion.promise().query(query,[limit,offset]);
        
        response.status(200).json({
            data: termekek,
        });
    } catch (error) {
        
        console.log(error);
        response.status(500).json({
            message: 'Hibás lekérés'
        });
    }
});

router.get('/WebShop/TermeklekeresByNev/:nev', async (request, response) => {
    try {
        const limit = parseInt(request.query.limit);
        const offset = parseInt(request.query.offset);
        
        const nev = request.params.nev;
       
        const query = "SELECT * FROM webshoptermek WHERE TermekCim like ? LIMIT ? OFFSET ?";
        
        const [termekek] = await DBconnetion.promise().query(query,[`%${nev}%`,limit,offset]);
          
        response.status(200).json({
            data: termekek
        });
    } catch (error) {
        console.log(error);
        
        response.status(500).json({
            message: 'Hibás lekérés'
        });
    }
});

router.get('/Webshop/Keplekeres/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const query = 'SELECT  TermekKepUtvonal FROM webshoptermek WHERE TermekID = ?';
        const [termekek] = await DBconnetion.promise().query(query, [id]);
        console.log(termekek[0].TermekKepUtvonal);
        response.sendFile(path.join(__dirname, '..', 'images', termekek[0].TermekKepUtvonal));
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'hiba'
        });
    }
});

router.post('/Webshop/szures', async (request, response) => {
    try {
        
        const limit = parseInt(request.query.limit);
        const offset = parseInt(request.query.offset);
        const feltetelek = request.body;
        let query = 'SELECT * FROM webshoptermek WHERE';
        let whereErtekek;
        const elfogadott = ['csokkeno', 'novekvo', '-', 'TermekCim'];
        /*whitelist - ezzel ellenőrzöm, hogy csak az általam elfogadott dolgokat írta be a felhasználó, 
        az sql-injection miatt. táblanévnél nem lehet paraméterezni, ezért szükséges ez.*/
        let ertekLista = [];
        let OrderBy;
        let OrderByErtek;
        for (const item of Object.entries(feltetelek)) {
            if (item[0] == 'MaxAr') {
                query += ' Ar <= ? AND';
            } else if (item[0] == 'MaxAlk') {
                query += ' TermekAlkoholSzazalek <= ? AND';
            } else if (item[0] == 'TermekKategoria') {
                query += ' TermekKategoria = ? AND';
            } else if (item[0] == 'MaxAlk') {
                query += ' TermekUrtartalom = ? AND';
            } else if (item[0] == 'rendezes') {
                if (elfogadott.includes(item[1])) {
                    if (item[1] == 'novekvo') {
                        OrderBy = ` ORDER BY Ar ASC`;
                    } else if (item[1] == 'csokkeno') {
                        OrderBy = ` ORDER BY Ar DESC`;
                    } else if (item[1] == 'TermekCim') {
                        OrderBy = ` ORDER BY TermekCim ASC`;
                    } else if (item[1] == '-') {
                        OrderBy = ` ORDER BY TermekId ASC`;
                    }
                } else {
                    throw new Error('Rendezéshiba');
                }
            } else if (item[0] == 'akcio') {
                query += ' TermekDiscount is NOT NULL AND';
            } else {
                query += ` ${item[0]} like ? AND`;
            }

            if (item[0] != 'rendezes') {
                ertekLista.push(item[1]);
            }
        }
        // a query utolso 3 elemenek (AND) levágása
        query = query.slice(query[0], query.length - 4);

        query += OrderBy;
        let limitoffset = " LIMIT ? OFFSET ?"
        query += limitoffset
        // console.log(OrderByErtek)
        for (let i = 0; i < ertekLista.length; i++) {
            console.log(ertekLista[i]);
        }

        /* TEST
        const sql = mysql.format(query, [ertekLista[0]]);
            console.log(sql);
            console.log(typeof ertekLista[0]);
            console.log('2') 
        */

        //SZÉPÍTENI KELL!!!

        let szurtTermekek;
        if (ertekLista.length == 1) {
            [szurtTermekek] = await DBconnetion.promise().query(query, [ertekLista[0],limit,offset]);
        } else if (ertekLista.length == 2) {
            [szurtTermekek] = await DBconnetion.promise().query(query, [ertekLista[0], ertekLista[1],limit,offset]);
        } else if (ertekLista.length == 3) {
            [szurtTermekek] = await DBconnetion.promise().query(query, [ertekLista[0], ertekLista[1], ertekLista[2],limit,offset]);
        } else if (ertekLista.length == 4) {
            console.log('4')[szurtTermekek] = await DBconnetion.promise().query(query, [
                ertekLista[0],
                ertekLista[1],
                ertekLista[2],
                ertekLista[3],limit,offset
            ]);
        } else if (ertekLista.length == 5) {
            console.log('5')[szurtTermekek] = await DBconnetion.promise().query(query, [
                ertekLista[0],
                ertekLista[1],
                ertekLista[2],
                ertekLista[3],
                ertekLista[4],limit,offset
            ]);
        } else if (ertekLista.length == 6) {
            console.log('6')[szurtTermekek] = await DBconnetion.promise().query(query, [
                ertekLista[0],
                ertekLista[1],
                ertekLista[2],
                ertekLista[3],
                ertekLista[4],
                ertekLista[5],limit,offset
            ]);
        } else if (ertekLista.length == 7) {
            console.log('7')[szurtTermekek] = await DBconnetion.promise().query(query, [
                ertekLista[0],
                ertekLista[1],
                ertekLista[2],
                ertekLista[3],
                ertekLista[4],
                ertekLista[5],
                ertekLista[6],limit,offset
            ]);
        } else if (ertekLista.length == 8) {
            console.log('8')[szurtTermekek] = await DBconnetion.promise().query(query, [
                ertekLista[0],
                ertekLista[1],
                ertekLista[2],
                ertekLista[3],
                ertekLista[4],
                ertekLista[5],
                ertekLista[6],
                ertekLista[7],limit,offset
            ]);
        } else if (ertekLista.length == 9) {
            console.log('9')[szurtTermekek] = await DBconnetion.promise().query(query, [
                ertekLista[0],
                ertekLista[1],
                ertekLista[2],
                ertekLista[3],
                ertekLista[4],
                ertekLista[5],
                ertekLista[6],
                ertekLista[7],
                ertekLista[8],limit,offset
            ]);
        }
        response.status(200).json({
            data: szurtTermekek,
            hossz : szurtTermekek.length
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'hiba'
        });
    }
});

router.post('/Webshop/KosarKuldes/:id', async (request, response) => {
    if (request.cookies.auth_token != null) //be van e jelentkezve a felhasználó
    {
        try {
            const id = request.params.id;
            const mennyiseg = 1;
            const UserID = jwt.decode(request.cookies.auth_token).userID; //"sessionId" lekérése

            const KosarLekeresQuery = 'SELECT SessionID from kosár WHERE UserID = ?';
            const [KosarLekeres] = await DBconnetion.promise().query(KosarLekeresQuery, [UserID]);

            const ArLekeresQuery = 'SELECT Ar FROM webshoptermek WHERE TermekID = ?';
            const ArLekeres = await DBconnetion.promise().query(ArLekeresQuery, [id]);

            const VanEIlyenQuery = 'SELECT * FROM kosártermék WHERE TermekID = ?';
            const [vanEIlyen] = await DBconnetion.promise().query(VanEIlyenQuery, [id]);

            //Ellenőrizzük, hogy létezik-e már ilyen rekord az adatbázisban, és ha igen akkor nem újat hozunk létre, hanem a meglévőnek a darabszámát növeljük
            if (vanEIlyen[0] == undefined) {
                const kosarFeltoltQuery =
                    'INSERT INTO kosártermék (KosarID,TermekID,Darabszam,EgysegAr) VALUES (?,?,?,?)';
                const [KosarFeltolt] = await DBconnetion.promise().query(kosarFeltoltQuery, [
                    KosarLekeres[0].SessionID,
                    id,
                    mennyiseg,
                    ArLekeres[0][0].Ar
                ]);
                response.status(200).json({ Siker: KosarFeltolt.affectedRows });
            } else {
                const kosarUpdateQuery =
                    'UPDATE kosártermék SET Darabszam = Darabszam+1 WHERE TermekID = ? AND KosarID = ?';
                const [KosarUpdate] = await DBconnetion.promise().query(kosarUpdateQuery, [
                    id,
                    KosarLekeres[0].SessionID
                ]);
                response.status(200).json({ Siker: KosarUpdate.affectedRows });
            }
        } catch (error) {
            console.log(error);
            response.status(500).json({ hiba: error });
        }
    } else {
        response.status(200).json({ hiba: 'bejel' });
    }
});

module.exports = router;
