const express = require('express');
const DBconnetion = require('../database.js');
const argon = require('argon2');
const router = express.Router();
const jwt = require('jsonwebtoken');
async function lekeres(query, param) {
    let result;
    await DBconnetion.promise()
        .query(query, param)
        .then(([rows]) => {
            result = rows;
        });
    return result;
}

router.get('/koktelTest', async (request, response) => {
    let mukodikKoktel = false;
    let mukodikKoktelJelveny = false;
    let mukodikKoktelOsszetevo = false;
    let mukodikKomment = false;
    let mukodikKommertErt = false;
    let mukodikErtekeles = false;
    let mukodikKedvenc = false;
    let keszito = jwt.verify(request.cookies.auth_token_access, process.env.JWT_SECRET).userID;
    try {
        const koktelfeltoltes =
            'INSERT INTO koktél (Keszito,Alkoholos,KoktelCim,Alap,Recept,AlapMennyiseg) VALUES (?,?,?,?,?,?)';
        const jelvenyfeltoltes = 'INSERT INTO koktélokjelvényei (KoktélID,JelvényID) VALUES (?,?)';
        const osszetevofeltoltes =
            'INSERT INTO koktelokosszetevoi (KoktélID,Osszetevő,Mennyiség,Mertekegyseg) VALUES (?,?,?,?)';
        const ertekeles = 'INSERT INTO ertekeles (Keszito,HovaIrták,MilyenDologhoz,Ertekeles) VALUES (?,?,?,?)';
        const komment = 'INSERT INTO komment (Keszito,HovaIrták,MilyenDologhoz,Tartalom) VALUES (?,?,?,?)';
        const ertekeleskomment = 'INSERT INTO kommentertekeles (FelhID,KommentID,Pozitiv,Negativ) VALUES (?,?,?,?)';
        const kedvenc = 'INSERT INTO kedvencek (KikedvelteID,MitkedveltID) VALUES (?,?)';

        await lekeres(koktelfeltoltes, [keszito, 1, 'Alkohol', 'Alkohol', 'Tölts bele alkoholt', 10]);
        const koktel = 'SELECT * FROM koktél';
        let eredmeny = await lekeres(koktel);
        let koktelid;
        for (let i = 0; i < eredmeny.length; i++) {
            if (
                eredmeny[i].Keszito == keszito &&
                eredmeny[i].Alkoholos == 1 &&
                eredmeny[i].KoktelCim == 'Alkohol' &&
                eredmeny[i].Recept == 'Tölts bele alkoholt' &&
                eredmeny[i].AlapMennyiseg == 10
            ) {
                mukodikKoktel = true;
                koktelid = eredmeny[i].KoktélID;
            }
        }
        if (mukodikKoktel) {
            await lekeres(jelvenyfeltoltes, [koktelid, 1]);
            await lekeres(jelvenyfeltoltes, [koktelid, 3]);
            await lekeres(osszetevofeltoltes, [koktelid, 'Gin', 50, 'ml']);
            await lekeres(osszetevofeltoltes, [koktelid, 'Tonic', 200, 'ml']);
            let jelvenykoktelok = await lekeres(
                'SELECT KoktélID FROM koktélokjelvényei WHERE JelvényID LIKE ? OR JelvényID LIKE ? GROUP BY KoktélID',
                [1, 3]
            );
            for (let i = 0; i < jelvenykoktelok.length; i++) {
                if (jelvenykoktelok[i].KoktélID == koktelid) {
                    mukodikKoktelJelveny = true;
                }
            }
            let osszetevokoktelok = await lekeres(
                'SELECT KoktélID FROM koktelokosszetevoi WHERE Osszetevő LIKE ? OR Osszetevő LIKE ? GROUP BY KoktélID',
                ['Gin', 'Tonic']
            );
            for (let i = 0; i < osszetevokoktelok.length; i++) {
                if (osszetevokoktelok[i].KoktélID == koktelid) {
                    mukodikKoktelOsszetevo = true;
                }
            }

            await lekeres(ertekeles, [keszito, koktelid, 'Koktél', 5]);
            let ert = await lekeres('SELECT Keszito FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?', [
                koktelid,
                'Koktél'
            ]);
            if (ert != undefined) {
                mukodikErtekeles = true;
            }

            await lekeres(komment, [keszito, koktelid, 'Koktél', 'Teszt Komment']);
            let komm = await lekeres(
                'SELECT Keszito,KommentID FROM komment WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?',
                [koktelid, 'Koktél']
            );
            if (komm != undefined) {
                await lekeres(ertekeleskomment, [keszito, komm[0].KommentID, 0, 1]);
                mukodikKomment = true;
                let kommert = await lekeres(
                    'SELECT FelhID,KommentID FROM kommentertekeles WHERE FelhID LIKE ? AND KommentID LIKE ?',
                    [keszito, komm[0].KommentID]
                );
                if (kommert != undefined) {
                    mukodikKommertErt = true;
                }
            }

            await lekeres(kedvenc, [keszito, koktelid]);
            let kedv = await lekeres('SELECT * FROM kedvencek WHERE KiKedvelteID LIKE ?', [keszito]);
            for (let i = 0; i < kedv.length; i++) {
                if (kedv[i].MitkedveltID == koktelid) {
                    mukodikKedvenc = true;
                }
            }
        }
        response.status(200).json({
            koktel: mukodikKoktel,
            jelveny: mukodikKoktelJelveny,
            ossz: mukodikKoktelOsszetevo,
            ert: mukodikErtekeles,
            komm: mukodikKomment,
            kommert: mukodikKommertErt,
            kedv: mukodikKedvenc,
            insertId: koktelid
        });
    } catch (error) {
        console.log(error);

        response.status(200).json({
            koktel: mukodikKoktel,
            jelveny: mukodikKoktelJelveny,
            ossz: mukodikKoktelOsszetevo,
            ert: mukodikErtekeles,
            komm: mukodikKomment,
            kommert: mukodikKommertErt,
            kedv: mukodikKedvenc
        });
    }
});
router.delete('/koktelTorles/:id', async (request, response) => {
    let toroltKoktel = true;
    let toroltKoktelJelveny = true;
    let toroltKoktelOsszetevo = true;
    let toroltKomment = true;
    let toroltKommertErt = true;
    let toroltErtekeles = true;
    let toroltKedvenc = true;
    let koktelId = request.params.id;

    try {
        await lekeres('DELETE FROM koktélokjelvényei WHERE KoktélID LIKE ?', [koktelId]);
        await lekeres('DELETE FROM koktelokosszetevoi WHERE KoktélID LIKE ?', [koktelId]);
        let kommentek = await lekeres('SELECT KommentID FROM komment WHERE HovaIrták LIKE ?', [koktelId]);
        for (let i = 0; i < kommentek.length; i++) {
            await lekeres('DELETE FROM kommentertekeles WHERE KommentID LIKE ?', kommentek[i].KommentID);
        }
        await lekeres('DELETE FROM komment WHERE HovaIrták LIKE ?', [koktelId]);
        await lekeres('DELETE FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?', [koktelId, 'Koktél']);
        await lekeres('DELETE FROM kedvencek WHERE MitkedveltID LIKE ?', [koktelId]);
        await lekeres('DELETE FROM koktél WHERE KoktélID LIKE ?', [koktelId]);

        let koktelok = await lekeres('SELECT KoktélID FROM koktél');
        let ertekelesek = await lekeres('SELECT HovaIrták FROM ertekeles WHERE MilyenDologhoz LIKE ?', ['Koktél']);
        let komment = await lekeres('SELECT HovaIrták FROM komment');
        let kommentertekelesek = await lekeres('SELECT KommentID FROM kommentertekeles');
        let kedvencek = await lekeres('SELECT MitkedveltID FROM kedvencek');
        let jelvenyek = await lekeres('SELECT KoktélID FROM koktélokjelvényei');
        let osszetevok = await lekeres('SELECT KoktélID FROM koktelokosszetevoi');
        console.log(koktelId);

        for (let i = 0; i < koktelok.length; i++) {
            if (koktelok[i].KoktélID == koktelId) {
                console.log(koktelok[i].KoktélID);

                toroltKoktel = false;
            }
        }
        for (let i = 0; i < ertekelesek.length; i++) {
            if (ertekelesek[i].HovaIrták == koktelId) {
                toroltErtekeles = false;
            }
        }
        for (let i = 0; i < komment.length; i++) {
            if (komment[i].HovaIrták == koktelId) {
                toroltKomment = false;
                for (let j = 0; j < kommentertekelesek.length; j++) {
                    if (komment[i].HovaIrták == kommentertekelesek[j].KommentID) {
                        toroltKommertErt = false;
                    }
                }
            }
        }
        for (let i = 0; i < kedvencek.length; i++) {
            if (kedvencek[i].MitkedveltID == koktelId) {
                toroltKedvenc = false;
            }
        }
        for (let i = 0; i < jelvenyek.length; i++) {
            if (jelvenyek[i].KoktélID == koktelId) {
                toroltKoktelJelveny = false;
            }
        }
        for (let i = 0; i < osszetevok.length; i++) {
            if (osszetevok[i].KoktélID == koktelId) {
                toroltKoktelOsszetevo = false;
            }
        }
        response.status(200).json({
            koktel: toroltKoktel,
            jelveny: toroltKoktelJelveny,
            ossz: toroltKoktelOsszetevo,
            ert: toroltErtekeles,
            komm: toroltKomment,
            kommert: toroltKommertErt,
            kedv: toroltKedvenc
        });
    } catch (error) {
        console.log(error);

        response.status(200).json({
            koktel: toroltKoktel,
            jelveny: toroltKoktelJelveny,
            ossz: toroltKoktelOsszetevo,
            ert: toroltErtekeles,
            komm: toroltKomment,
            kommert: toroltKommertErt,
            kedv: toroltKedvenc
        });
    }
});
//feltoltjuk a termeket majd toroljuk is egybol
router.get('/termekFeltoltesTest', async (req, res) => {
    try {
        //Orszag nevet atalakitja ID-ra ami majd kesobb megy fel a termek tarolassal
        const query = 'SELECT OrszagID FROM webshoporszag WHERE OrszagNev LIKE ?';
        const [id] = await DBconnetion.promise().query(query, ['Belgium']);

        const termekQuery =
            'INSERT INTO webshoptermek (TermekCim, TermekLeiras, TermekKiszereles, TermekUrtartalom, TermekKeszlet, TermekKategoria, TermekMarka, TermekSzarmazas,TermekAlkoholSzazalek,TermekKora, Ar) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        await DBconnetion.promise().query(termekQuery, [
            'testBor',
            'testLeiras',
            1,
            2,
            3,
            'Bor',
            'testBorMarka',
            id[0].OrszagID,
            23,
            55,
            555
        ]);

        const query2 = 'SELECT TermekCim FROM webshoptermek WHERE TermekCim LIKE ?';
        const [eredemny] = await DBconnetion.promise().query(query2, ['testBor']);

        if (eredemny.length > 0) {
            //tehat ha talalt ilyen testTermeket, azert ellenorzom tobbre, mert lehet hogy tobbszor is le lett futattva a teszt
            const queryTorles = 'DELETE FROM webshoptermek WHERE TermekCim LIKE ?';
            await DBconnetion.promise().query(queryTorles, ['testBor']);
            res.status(200).json({ szazalek: false, eredemny: true });
        } else {
            res.status(200).json({ szazalek: false, eredemny: false });
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ eredemny: false });
    }
});

router.get('/TermekLearazas', async (req, res) => {
    try {
        const id = 1;
        //Random ertekkel learazzuk a tartalmat
        const ertek = Math.floor(Math.random() * 101);

        //lekerjuk az elozo jelenlegi learazas erteket
        const query = 'SELECT TermekDiscount FROM webshoptermek WHERE TermekID LIKE ?';
        const [discount] = await DBconnetion.promise().query(query, id);
        //console.log(discount[0].TermekDiscount);

        if (ertek > 100 || ertek < 1) {
            res.status(422).json({ eredemny: false, szazalek: true });
        } else {
            //frissites
            const frissetesQuery = 'UPDATE webshoptermek SET TermekDiscount = ? WHERE TermekID LIKE ?';
            await DBconnetion.promise().query(frissetesQuery, [ertek, id]);

            const query = 'SELECT TermekDiscount FROM webshoptermek WHERE TermekID LIKE ?';
            const [ujDiscount] = await DBconnetion.promise().query(query, id);
            //console.log(ujDiscount[0].TermekDiscount);

            //random szazalek miatt elofordulhat hogy a jelenlegi ertekkel megegyezik az uj ertek
            if (ujDiscount[0].TermekDiscount != discount[0].TermekDiscount) {
                const frissetesQuery = 'UPDATE webshoptermek SET TermekDiscount = ? WHERE TermekID LIKE ?';
                await DBconnetion.promise().query(frissetesQuery, [discount[0].TermekDiscount, id]);
                res.status(200).json({ eredemny: true, szazalek: false });
            } else {
                res.status(200).json({ eredemny: false, szazalek: false });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ eredemny: false, szazalek: false });
    }
});
router.get('/jelentesek/elfogadas', async (req, res) => {
    try {
        const jelentesID = 1;

        const queryJelenlegi = 'SELECT JelentesAllapota FROM Jelentesek WHERE JelentesID LIKE ?';
        //itt van a teszt elotti erteke
        const [eredemny] = await DBconnetion.promise().query(queryJelenlegi, [jelentesID]);

        const query = 'UPDATE Jelentesek SET JelentesAllapota = 2 WHERE JelentesID LIKE ?';
        DBconnetion.query(query, [jelentesID], async (err) => {
            if (err) {
                res.status(200).json({
                    sikertelen: true,
                    siker: false,
                    egyebHiba: false
                });
            } else {
                //sikeres teszt utan visszaallitja a jelentes allapotot
                const query = 'UPDATE Jelentesek SET JelentesAllapota = ? WHERE JelentesID LIKE ?';

                await DBconnetion.promise().query(query, [eredemny[0].JelentesAllapota, jelentesID]);
                res.status(200).json({ sikertelen: false, siker: true, egyebHiba: false });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(200).json({
            sikertelen: true,
            siker: false,
            egyebHiba: true
        });
    }
});

router.post('/TermekKosarTest', async (request, response) => {
    try {
        let siker = false;
        let mennyiseghiba = false;
        let hozzaadott = false;
        let bovitett = false;
        let felkerultE = false;
        let idHiba = false;
        let insertId;
        let id = parseInt(request.body.id);
        const mennyiseg = request.body.mennyiseg;
        const Tidk = 'SELECT TermekID FROM webshoptermek';
        const [Termekidk] = await DBconnetion.promise().query(Tidk);
        let Tid = [];
        for (let i = 0; i < Termekidk.length; i++) {
            Tid.push(Termekidk[i].TermekID);
        }

        if (isNaN(id) || id == 0 || !Tid.includes(id)) {
            idHiba = true;
        } else {
            const UserID = jwt.verify(request.cookies.auth_token_access, process.env.JWT_SECRET).userID;

            const ArLekeresQuery = 'SELECT Ar FROM webshoptermek WHERE TermekID = ?';
            const ArLekeres = await DBconnetion.promise().query(ArLekeresQuery, [id]);

            const mennyisegLekeres = 'SELECT TermekKeszlet FROM webshoptermek WHERE TermekID = ?';
            const [MennyisegLe] = await DBconnetion.promise().query(mennyisegLekeres, [id]);

            const VanEIlyenQuery = 'SELECT * FROM kosártermék WHERE TermekID = ? &&  KosarID = ?';
            const [vanEIlyen] = await DBconnetion.promise().query(VanEIlyenQuery, [id, UserID]);

            if (MennyisegLe[0].TermekKeszlet < mennyiseg || mennyiseg > 99 || mennyiseg < 1) {
                siker = false;
                mennyiseghiba = true;
            } else {
                if (vanEIlyen[0] == undefined) {
                    const kosarFeltoltQuery =
                        'INSERT INTO kosártermék (KosarID,TermekID,Darabszam,EgysegAr) VALUES (?,?,?,?)';
                    const [KosarFeltolt] = await DBconnetion.promise().query(kosarFeltoltQuery, [
                        UserID,
                        id,
                        mennyiseg,
                        ArLekeres[0][0].Ar
                    ]);
                    hozzaadott = true;
                    siker = true;
                    insertId = KosarFeltolt.insertId;
                    const felkerulteQuery = 'SELECT * FROM kosártermék WHERE KosarID = ? AND TermekID = ?';
                    const [felkerulte] = await DBconnetion.promise().query(felkerulteQuery, [UserID, id]);
                    if (felkerulte != '') {
                        felkerultE = true;
                    }
                } else {
                    //lekérem az éppen változtatott rekordot
                    const valtozoTermekQ = 'SELECT * FROM kosártermék WHERE KosarID = ? AND TermekID = ?';
                    const [valtozo] = await DBconnetion.promise().query(valtozoTermekQ, [UserID, id]);
                    const kosarUpdateQuery =
                        'UPDATE kosártermék SET Darabszam = Darabszam+? WHERE TermekID = ? AND KosarID = ?';
                    const [KosarUpdate] = await DBconnetion.promise().query(kosarUpdateQuery, [mennyiseg, id, UserID]);
                    bovitett = true;
                    siker = true;
                    insertId = KosarUpdate.insertId;
                    const osszkosar = 'SELECT * FROM kosártermék';
                    const [felkerulte] = await DBconnetion.promise().query(osszkosar);

                    for (let i = 0; i < felkerulte.length; i++) {
                        //a változtatás előtti rekordot összehasonlitom a valtoztatas utanival
                        if (
                            felkerulte[i].KosarID == valtozo[0].KosarID &&
                            felkerulte[i].TermekID == valtozo[0].TermekID &&
                            felkerulte[i].Darabszam == valtozo[0].Darabszam + parseInt(mennyiseg)
                        ) {
                            felkerultE = true;
                        }
                    }
                }
            }
        }
        response.status(200).json({
            siker: siker,
            mennyiseghiba: mennyiseghiba,
            hozzaadott: hozzaadott,
            bovitett: bovitett,
            felkerulte: felkerultE,
            idHiba: idHiba
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ hiba: error });
    }
});
router.post('/TermekNevTeszt', async (request, response) => {
    try {
        const nev = request.body.nev;
        console.log(nev);
        let siker = true;
        let JoNevek = false;
        let NevHiba = false;
        let NincsIlyenTermek = false;
        if (nev == '') {
            NevHiba = true;
            siker = false;
        } else {
            const query =
                'SELECT * FROM webshoptermek INNER JOIN webshoporszag ON TermekSzarmazas = OrszagID WHERE TermekCim like ?';
            const [orszagok] = await DBconnetion.promise().query(query, [`%${nev}%`]);
            if (orszagok.length == 0) {
                NincsIlyenTermek = true;
                siker = true;
            } else {
                siker = true;
                let mennyi = 0;
                for (let i = 0; i < orszagok.length; i++) {
                    if (orszagok[i].TermekCim.includes(nev)) {
                        mennyi++;
                    }
                }
                if (mennyi == orszagok.length) {
                    JoNevek = true;
                }
            }
        }
        response.status(200).json({
            siker: siker,
            JoNevek: JoNevek,
            NevHiba: NevHiba,
            NincsIlyenTermek: NincsIlyenTermek
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            hiba: error
        });
    }
});
router.get('/kosartermekek', async (request, response) => {
    try {
        const UserID = jwt.verify(request.cookies.auth_token_access, process.env.JWT_SECRET).userID;
        const query =
            'SELECT * FROM KosárTermék INNER JOIN webshoptermek ON KosárTermék.TermekID = webshoptermek.TermekID WHERE KosarID LIKE ?';
        const [termekek] = await DBconnetion.promise().query(query, [UserID]);
        response.status(200).json({
            termekek: termekek
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            hiba: error
        });
    }
});
router.patch('/TermekFrissitesTeszt', async (request, response) => {
    try {
        let mit = request.body.id;
        let mennyit = request.body.mennyiseg;
        const UserID = jwt.verify(request.cookies.auth_token_access, process.env.JWT_SECRET).userID;
        let siker = true;
        let JoSzam = false;
        let negativszam = false;
        if (mennyit < 1) {
            negativszam = true;
            siker = false;
            JoSzam = false;
        } else {
            let TermékTöltés = 'UPDATE KosárTermék SET Darabszam = ? WHERE KosarID LIKE ? AND TermekID LIKE ?';
            const [frissit] = await DBconnetion.promise().query(TermékTöltés, [
                mennyit,
                jwt.verify(request.cookies.auth_token_access, process.env.JWT_SECRET).userID,
                mit
            ]);
            if (frissit.affectedRows == 0) {
                siker = false;
            } else {
                const Testquery = 'SELECT * FROM KosárTermék WHERE KosarID LIKE ? AND TermekID = ?';
                const [termekek] = await DBconnetion.promise().query(Testquery, [UserID, mit]);
                if (termekek[0].Darabszam == mennyit) {
                    JoSzam = true;
                }
            }
        }
        response.status(200).json({
            siker: siker,
            JoSzam: JoSzam,
            negativszam: negativszam
        });
    } catch (error) {
        console.log(error);

        response.status(500).json({
            message: 'Hiba Történt!',
            hiba: error
        });
    }
});
router.delete('/TermekUritesTest', async (request, response) => {
    try {
        let honnan = jwt.verify(request.cookies.auth_token_access, process.env.JWT_SECRET).userID;
        let ures = false;
        let siker = true;
        let alapures = false;
        const KosarElsoLeker = 'SELECT * FROM KosárTermék WHERE KosarID LIKE ?';
        const [kosarElso] = await DBconnetion.promise().query(KosarElsoLeker, [honnan]);
        if (kosarElso.length == 0) {
            siker = false;
            ures = false;
            alapures = true;
            console.log('asd');
        } else {
            let TermékTörlés = 'DELETE FROM KosárTermék WHERE KosarID LIKE ?';
            const [torol] = await DBconnetion.promise().query(TermékTörlés, [honnan]);
            if (torol.affectedRows == 0) {
                siker = false;
            } else {
                const KosarLeker = 'SELECT * FROM KosárTermék WHERE KosarID LIKE ?';
                const [kosar] = await DBconnetion.promise().query(KosarLeker, [honnan]);
                if (kosar.length > 0) {
                    siker = false;
                    ures = false;
                } else if (kosar.length == 0) {
                    ures = true;
                }
            }
        }
        response.status(200).json({
            siker: siker,
            ures: ures,
            alapures: alapures
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'Hiba Történt!',
            hiba: error
        });
    }
});
async function lekeres(query, param) {
    let result;
    await DBconnetion.promise()
        .query(query, param)
        .then(([rows]) => {
            result = rows;
        });
    return result;
}
router.delete('/FioktorlesTeszt', async (request, response) => {
    try {
        const id = parseInt(request.body.id);

        let FelhTorolve = false;
        let ErtekelesTorles = false;
        let KoktelErtekelesekTorolve = false;
        let KoktelTorlese = false;
        let KoktelokJelvenyeiTorolve = false;
        let KoktelokKommentjeiTorolve = false;
        let KommentekErtekeleseiTorolve = false;
        let KommentTorlese = false;
        let JelentesekTorlese = false;
        let KosarTorlese = false;
        let KedvencTorlese = false;
        let KoktelokOsszetevoiTorles = false;
        let KoktelKedvenceTorles = false;
        let jelentoTorlese = false;
        let JelentoJelentesTorlese = false;
        let IdHiba = true;
        let pozitivKommentUpdate = false;
        let NegativKommentUpdate = false;
        //hibavisszajelzesek
        let pozitivKommentUpdateHiba = false;
        let NegativKommentUpdateHiba = false;
        let KoktelErtekelesTorlesHiba = false;
        let KommentTorlesKoktelHiba = false;
        let OsszetevoTorlesHiba = false;
        let JelvenyTorlesHiba = false;
        let KedvencTorleseHiba = false;
        let JelentoJelentesHiba = false;

        const idEllenorzesQ = 'SELECT FelhID FROM felhasználó WHERE FelhID = ?';
        const [idEllenorzes] = await DBconnetion.promise().query(idEllenorzesQ, [id]);
        console.log(idEllenorzes.length);
        if (idEllenorzes.length == 0) {
            console.log('asd');
            idHiba = true;
        } else {
            const FelhasznaloTorles = 'DELETE FROM felhasználó WHERE FelhID LIKE ?';
            const FelhasznaloTorlesEllQ = 'SELECT * FROM felhasználó WHERE FelhID LIKE ?';
            idHiba = false;

            const ErtekTorles = 'DELETE FROM ertekeles WHERE Keszito LIKE ?';
            const ErtekTorlesEllQ = 'SELECT * FROM ertekeles WHERE Keszito = ?';

            const ErtekTorlesKoktel = 'DELETE FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
            const ErtekTorlesKoktelEllQ = 'SELECT  *  FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';

            const KoktelTorles = 'DELETE FROM koktél WHERE Keszito LIKE ?';
            const KoktelTorlesEllQ = 'SELECT  *  FROM koktél WHERE Keszito LIKE ?';

            const KoktelLekeres = 'SELECT KoktélID FROM koktél WHERE Keszito LIKE ?';

            const JelvenyTorles = 'DELETE FROM koktélokjelvényei WHERE KoktélID LIKE ?';
            const JelvenyTorlesEllQ = 'SELECT  *  FROM koktélokjelvényei WHERE KoktélID LIKE ?';

            const KommentTorlesKoktel = 'DELETE FROM komment WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';
            const KommentTorlesKoktelEllQ = 'SELECT  *  FROM komment WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?';

            const KommentErtekelesLekeres =
                'SELECT KommentID,Pozitiv,Negativ FROM kommentertekeles WHERE FelhID LIKE ?';

            const KommentErtekelesTorles = 'DELETE FROM kommentertekeles WHERE FelhID LIKE ?';
            const KommentErtekelesTorlesEllQ = 'SELECT  *  FROM kommentertekeles WHERE FelhID LIKE ?';

            const KommentTorles = 'DELETE FROM komment WHERE Keszito LIKE ?';
            const KommentTorlesEllQ = 'SELECT  *  FROM komment WHERE Keszito LIKE ?';

            const JelentesTorles = 'DELETE FROM jelentesek WHERE JelentettID LIKE ?';
            const JelentesTorlesEllQ = 'SELECT  *  FROM jelentesek WHERE JelentettID LIKE ?';

            const JelentesLekeres = 'SELECT JelentesID FROM jelentesek WHERE JelentettID LIKE ?';

            const KosarTermekTorles = 'DELETE FROM kosártermék WHERE KosarID LIKE ?';
            const KosarTermekTorlesEllQ = 'SELECT  *  FROM Kosártermék WHERE KosarID LIKE ?';

            const KedvencTorlesQ = 'DELETE FROM kedvencek WHERE KikedvelteID LIKE ?';
            const KedvencTorlesEllQ = 'SELECT  *  FROM kedvencek WHERE KikedvelteID LIKE ?';

            const OssztevTorles = 'DELETE FROM koktelokosszetevoi WHERE KoktélID LIKE ?';
            const OssztevTorlesEllQ = 'SELECT  *  FROM koktelokosszetevoi WHERE KoktélID LIKE ?';

            const KedvencTorlesKoktel = 'DELETE FROM kedvencek WHERE MitkedveltID LIKE ?';
            const KedvencTorlesKoktelEllQ = 'SELECT  *  FROM kedvencek WHERE MitkedveltID LIKE ?';

            const JelentoTorles = 'DELETE FROM jelentők WHERE JelentőID LIKE ?';
            const JelentoTorlesEllQ = 'SELECT  *  FROM jelentők WHERE JelentőID LIKE ?';

            const JelentoJelentesTorles = 'DELETE FROM jelentők WHERE JelentésID LIKE ?';
            const JelentoJelentesTorlesEllQ = 'SELECT  *  FROM jelentők WHERE JelentésID LIKE ?';

            const ertTorles = await lekeres(ErtekTorles, id);
            const [ErtekTorlesEll] = await DBconnetion.promise().query(ErtekTorlesEllQ, [id]);
            if (ErtekTorlesEll.length == 0) {
                ErtekelesTorles = true;
            }

            const kommentTorles = await lekeres(KommentTorles, id);
            const [KommentTorlesEll] = await DBconnetion.promise().query(KommentTorlesEllQ, [id]);
            if (KommentTorlesEll.length == 0) {
                KommentTorlese = true;
            }

            const jelentoTorles = await lekeres(JelentoTorles, id);
            const [JelentoTorlesEll] = await DBconnetion.promise().query(JelentoTorlesEllQ, [id]);
            if (JelentoTorlesEll.length == 0) {
                jelentoTorlese = true;
            }

            const KedvencTorles = await lekeres(KedvencTorlesQ, id);
            const [KedvencTorlesEll] = await DBconnetion.promise().query(KedvencTorlesEllQ, [id]);
            if (KedvencTorlesEll.length == 0) {
                KedvencTorlese = true;
            }

            const KosarTorles = await lekeres(KosarTermekTorles, id);
            const [KosarTermekTorlesEll] = await DBconnetion.promise().query(KosarTermekTorlesEllQ, [id]);
            if (KosarTermekTorlesEll.length == 0) {
                KosarTorlese = true;
            }

            let ertekelesek = await lekeres(KommentErtekelesLekeres, id);
            for (let i = 0; i < ertekelesek.length; i++) {
                console.log(ertekelesek[i].Negativ);
                console.log(ertekelesek[i].Pozitiv);
                if (ertekelesek[i].Pozitiv == 1) {
                    await lekeres(
                        'UPDATE komment SET Pozitiv=Pozitiv-1 WHERE KommentID LIKE ?',
                        ertekelesek[i].KommentID
                    );
                    const PozErtEllQ = 'SELECT Pozitiv FROM komment WHERE KommentID LIKE ?';
                    const [PozErtEll] = await DBconnetion.promise().query(PozErtEllQ, [ertekelesek[i].KommentID]);
                    if (PozErtEll[i].Pozitiv == ertekelesek[i].Pozitiv - 1) {
                        pozitivKommentUpdate = true;
                    } else {
                        pozitivKommentUpdateHiba = true;
                    }
                }
                if (ertekelesek[i].Negativ == 1) {
                    await lekeres(
                        'UPDATE komment SET Negativ=Negativ-1 WHERE KommentID LIKE ?',
                        ertekelesek[i].KommentID
                    );
                    const NegErtEllQ = 'SELECT Negaativ FROM komment WHERE KommentID LIKE ?';
                    const [NegErtEll] = await DBconnetion.promise().query(NegErtEllQ, [ertekelesek[i].KommentID]);
                    if (NegErtEll[i].Negativ == ertekelesek[i].Negativ - 1) {
                        NegativKommentUpdate = true;
                    } else {
                        NegativKommentUpdateHiba = true;
                    }
                }
            }

            if (NegativKommentUpdateHiba == true) {
                NegativKommentUpdate = false;
            }
            if (pozitivKommentUpdateHiba == true) {
                pozitivKommentUpdate = false;
            }

            await lekeres(KommentErtekelesTorles, id);
            const [KommentErtekelesTorlesEll] = await DBconnetion.promise().query(KommentErtekelesTorlesEllQ, [id]);
            if (KommentErtekelesTorlesEll.length == 0) {
                KommentekErtekeleseiTorolve = true;
            }
            let koktel = await lekeres(KoktelLekeres, id);
            for (let i = 0; i < koktel.length; i++) {
                await lekeres(ErtekTorlesKoktel, [koktel[i].KoktélID, 'Koktél']);
                const [ErtekTorlesKoktelEll] = await DBconnetion.promise().query(ErtekTorlesKoktelEllQ, [
                    koktel[i].KoktélID,
                    'Koktél'
                ]);
                console.log(ErtekTorlesKoktelEll);
                if (ErtekTorlesKoktelEll.length == 0) {
                    KoktelErtekelesekTorolve = true;
                } else {
                    KoktelErtekelesTorlesHiba = true;
                }

                await lekeres(KommentTorlesKoktel, [koktel[i].KoktélID, 'Koktél']);
                const [KommentTorlesKoktelEll] = await DBconnetion.promise().query(KommentTorlesKoktelEllQ, [
                    koktel[i].KoktélID,
                    'Koktél'
                ]);
                if (KommentTorlesKoktelEll.length == 0) {
                    KoktelokKommentjeiTorolve = true;
                } else {
                    KommentTorlesKoktelHiba = true;
                }

                await lekeres(OssztevTorles, koktel[i].KoktélID);
                const [OssztevTorlesEll] = await DBconnetion.promise().query(OssztevTorlesEllQ, [koktel[i].KoktélID]);
                if (OssztevTorlesEll.length == 0) {
                    KoktelokOsszetevoiTorles = true;
                } else {
                    OsszetevoTorlesHiba = true;
                }

                await lekeres(JelvenyTorles, koktel[i].KoktélID);
                const [JelvenyTorlesEll] = await DBconnetion.promise().query(JelvenyTorlesEllQ, [koktel[i].KoktélID]);
                if (JelvenyTorlesEll.length == 0) {
                    KoktelokJelvenyeiTorolve = true;
                } else {
                    JelvenyTorlesHiba = true;
                }
                await lekeres(KedvencTorlesKoktel, koktel[i].KoktélID);
                const [KedvencTorlesKoktelEll] = await DBconnetion.promise().query(KedvencTorlesKoktelEllQ, [
                    koktel[i].KoktélID
                ]);
                if (KedvencTorlesKoktelEll.length == 0) {
                    KoktelKedvenceTorles = true;
                } else {
                    KedvencTorleseHiba = true;
                }
            }
            if (KoktelErtekelesTorlesHiba == true) {
                KoktelErtekelesekTorolve = false;
            }
            if (KommentTorlesKoktelHiba == true) {
                KoktelokKommentjeiTorolve = false;
            }
            if (OsszetevoTorlesHiba == true) {
                KoktelokOsszetevoiTorles = false;
            }
            if (JelvenyTorlesHiba == true) {
                KoktelokJelvenyeiTorolve = false;
            }
            if (KedvencTorleseHiba == true) {
                KoktelKedvenceTorles = false;
            }

            await lekeres(KoktelTorles, id);
            let jelentes = await lekeres(JelentesLekeres, id);
            const [KoktelTorlesEll] = await DBconnetion.promise().query(KoktelTorlesEllQ, [id]);
            if (KoktelTorlesEll.length == 0) {
                KoktelTorlese = true;
            }
            for (let i = 0; i < jelentes.length; i++) {
                await lekeres(JelentoJelentesTorles, jelentes[i].JelentesID);
                const [JelentoJelentesTorlesEll] = await DBconnetion.promise().query(JelentoJelentesTorlesEllQ, [
                    jelentes[i].JelentesID
                ]);
                if (JelentoJelentesTorlesEll.length == 0) {
                    JelentoJelentesTorlese = true;
                } else {
                    JelentoJelentesHiba = true;
                }
            }
            if (JelentoJelentesHiba == true) {
                JelentoJelentesTorlese = false;
            }
            await lekeres(JelentesTorles, id);
            const [JelentesTorlesEll] = await DBconnetion.promise().query(JelentesTorlesEllQ, [id]);
            if (JelentesTorlesEll.length == 0) {
                JelentesekTorlese = true;
            }
            await lekeres(FelhasznaloTorles, id);
            const [FelhasznaloTorlesEll] = await DBconnetion.promise().query(FelhasznaloTorlesEllQ, [id]);
            if (FelhasznaloTorlesEll.length == 0) {
                FelhTorolve = true;
            }
        }
        response.status(200).json({
            KoktelTorlese: KoktelTorlese,
            KoktelokJelvenyeiTorolve: KoktelokJelvenyeiTorolve,
            KoktelokKommentjeiTorolve: KoktelokKommentjeiTorolve,
            KommentekErtekeleseiTorolve: KommentekErtekeleseiTorolve,
            KommentTorlese: KommentTorlese,
            JelentesekTorlese: JelentesekTorlese,
            KosarTorlese: KosarTorlese,
            KedvencTorlese: KedvencTorlese,
            KoktelokOsszetevoiTorles: KoktelokOsszetevoiTorles,
            KoktelKedvenceTorles: KoktelKedvenceTorles,
            jelentoTorlese: jelentoTorlese,
            JelentoJelentesTorlese: JelentoJelentesTorlese,
            IdHiba: IdHiba,
            pozitivKommentUpdate: pozitivKommentUpdate,
            NegativKommentUpdate: NegativKommentUpdate
        });
    } catch (error) {
        console.log(error);

        response.status(500).json({
            message: 'hiba'
        });
    }
});

router.get('/regisztracioTest', async (request, response) => {
    try {
        const email = 'test@gmail.com';
        const felhaszanaloNevReq = 'testFalhasznalo';
        const jelszo = 'tesztJelszo12!';
        const jelszoIsmet = 'tesztJelszo12!';
        const ASZF = true;
        const korEll = true;

        if (jelszo == jelszoIsmet) {
            if (
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) &&
                /^[a-zA-Z0-9_]{2,30}$/.test(felhaszanaloNevReq) &&
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(jelszo) &&
                ASZF &&
                korEll
            ) {
                const hashed = await argon.hash(jelszo, { type: argon.argon2id });

                const felhasznaloObjReg = {
                    email: email,
                    felhasznaloNev: felhaszanaloNevReq,
                    jelszo: hashed,
                    hossz: jelszo.length
                };

                const duplikacioEll = 'SELECT FelhID FROM felhasználó WHERE Felhasználónév LIKE ? OR Email LIKE ?';

                const [rows] = await DBconnetion.promise().query(duplikacioEll, [
                    felhasznaloObjReg.felhasznaloNev,
                    felhasznaloObjReg.email
                ]);

                if (rows.length == 0) {
                    const sqlQuery =
                        'INSERT INTO felhasználó (Felhasználónév, Email, Jelszó, JelszóHossza) VALUES (?,?,?,?)';

                    DBconnetion.query(
                        sqlQuery,
                        [
                            felhasznaloObjReg.felhasznaloNev,
                            felhasznaloObjReg.email,
                            felhasznaloObjReg.jelszo,
                            felhasznaloObjReg.hossz
                        ],
                        async (err) => {
                            if (err) {
                                response.status(200).json({
                                    megEgyezik: false,
                                    kriterium: false,
                                    duplikacio: false,
                                    sikeres: false,
                                    egyebHiba: true,
                                    sikertelen: true
                                });
                            } else {
                                const queryFelhasznalo =
                                    'SELECT Felhasználónév FROM felhasználó WHERE Felhasználónév LIKE ?';
                                const [eredemny] = await DBconnetion.promise().query(queryFelhasznalo, [
                                    felhasznaloObjReg.felhasznaloNev
                                ]);

                                if (eredemny[0].Felhasználónév == felhasznaloObjReg.felhasznaloNev) {
                                    const queryFelhasznaloTorles =
                                        'DELETE FROM felhasználó WHERE Felhasználónév LIKE ?';

                                    await DBconnetion.promise().query(queryFelhasznaloTorles, [
                                        felhasznaloObjReg.felhasznaloNev
                                    ]);

                                    response.status(200).json({
                                        megEgyezik: false,
                                        kriterium: false,
                                        duplikacio: false,
                                        sikeres: true,
                                        egyebHiba: false,
                                        sikertelen: false
                                    });
                                } else {
                                    response.status(200).json({
                                        megEgyezik: false,
                                        kriterium: false,
                                        duplikacio: false,
                                        sikeres: false,
                                        egyebHiba: false,
                                        sikertelen: true
                                    });
                                }
                            }
                        }
                    );
                } else {
                    response.status(200).json({
                        megEgyezik: false,
                        kriterium: false,
                        duplikacio: true,
                        sikeres: false,
                        egyebHiba: false,
                        sikertelen: true
                    });
                }
            } else {
                response.status(200).json({
                    megEgyezik: false,
                    kriterium: true,
                    duplikacio: false,
                    sikeres: false,
                    egyebHiba: false,
                    sikertelen: true
                });
            }
        } else {
            response.status(200).json({
                megEgyezik: true,
                kriterium: false,
                duplikacio: false,
                sikeres: false,
                egyebHiba: false,
                sikertelen: true
            });
        }

        //console.log(felhasznaloObjReg.jelszo);
    } catch (err) {
        console.log(err);

        response.status(200).json({
            megEgyezik: false,
            kriterium: false,
            duplikacio: false,
            sikeres: false,
            egyebHiba: true,
            sikertelen: true
        });
    }
});

module.exports = router;
