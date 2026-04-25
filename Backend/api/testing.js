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
    let mukodikKomment = false;
    let mukodikKommertErt = false;
    let mukodikErtekeles = false;
    let mukodikKedvenc = false;
    const feltoltes = 'INSERT INTO koktél (Keszito,Alkoholos,KoktelCim,Alap,Recept,AlapMennyiseg) VALUES (?,?,?,?,?,?)';
    const ertekeles = 'INSERT INTO ertekeles (Keszito,HovaIrták,MilyenDologhoz,Ertekeles) VALUES (?,?,?,?)';
    const komment = 'INSERT INTO komment (Keszito,HovaIrták,MilyenDologhoz,Tartalom) VALUES (?,?,?,?)';
    const ertekeleskomment = 'INSERT INTO kommentertekeles (FelhID,KommentID,Pozitiv,Negativ) VALUES (?,?,?,?)';
    const kedvenc = 'INSERT INTO kedvencek (KikedvelteID,MitkedveltID) VALUES (?,?)';
    const jelentes = 'INSERT INTO jeletesek (JelentettID,JelentettTartalomID,JelentesTipusa) VALUES (?,?,?,?)';
    const jelentok = 'INSERT INTO jelentők (JelentőID,JelentésID,JelentesIndoka) VALUES (?,?,?)';
    const torles = 'DELETE FROM koktél WHERE KoktélID LIKE ?';

    await lekeres(feltoltes, [1, 1, 'Alkohol', 'Alkohol', 'Tölts bele alkoholt', 10]);
    const koktel = 'SELECT * FROM koktél';
    let eredmeny = await lekeres(koktel);
    let koktelid;
    for (let i = 0; i < eredmeny.length; i++) {
        if (
            eredmeny[i].Keszito == 1 &&
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
        await lekeres(ertekeles, [11, koktelid, 'Koktél', 5]);
        let ert = await lekeres('SELECT Keszito FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?', [
            koktelid,
            'Koktél'
        ]);
        if (ert != undefined) {
            mukodikErtekeles = true;
        }

        await lekeres(komment, [11, koktelid, 'Koktél', 'Teszt Komment']);
        let komm = await lekeres(
            'SELECT Keszito,KommentID FROM komment WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?',
            [koktelid, 'Koktél']
        );
        if (komm != undefined) {
            await lekeres(ertekeleskomment, [12, komm[0].KommentID, 0, 1]);
            mukodikKomment = true;
            let kommert = await lekeres(
                'SELECT FelhID,KommentID FROM kommentertekeles WHERE FelhID LIKE ? AND KommentID LIKE ?',
                [12, komm[0].KommentID]
            );
            if (kommert != undefined) {
                mukodikKommertErt = true;
            }
        }

        await lekeres(kedvenc, [11, koktelid]);
        let kedv = await lekeres('SELECT * FROM kedvencek WHERE KiKedvelteID LIKE ?', [11]);
        for (let i = 0; i < kedv.length; i++) {
            if (kedv[i].MitkedveltID == koktelid) {
                mukodikKedvenc = true;
            }
        }
    }
    response.status(200).json({
        koktel: mukodikKoktel,
        ert: mukodikErtekeles,
        komm: mukodikKomment,
        kommert: mukodikKommertErt,
        kedv: mukodikKedvenc
    });
});

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
        console.log(discount[0].TermekDiscount);

        if (ertek > 100 || ertek < 1) {
            res.status(422).json({ eredemny: false, szazalek: true });
        } else {
            //frissites
            const frissetesQuery = 'UPDATE webshoptermek SET TermekDiscount = ? WHERE TermekID LIKE ?';
            await DBconnetion.promise().query(frissetesQuery, [ertek, id]);

            const query = 'SELECT TermekDiscount FROM webshoptermek WHERE TermekID LIKE ?';
            const [ujDiscount] = await DBconnetion.promise().query(query, id);
            console.log(ujDiscount[0].TermekDiscount);

            //random szazalek miatt elofordulhat hogy a jelenlegi ertekkel megegyezik az uj ertek
            if (ujDiscount[0].TermekDiscount != discount[0].TermekDiscount) {
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
        const Tidk = "SELECT TermekID FROM webshoptermek"
        const [Termekidk] = await DBconnetion.promise().query(Tidk)
        let Tid = []
        for (let i = 0; i < Termekidk.length; i++) {
            Tid.push(Termekidk[i].TermekID)
        }

        if (isNaN(id) || id == 0 || !Tid.includes(id)) {
            idHiba = true;
            
        }
        else{      
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
        }
        else{

        
        const query = "SELECT * FROM webshoptermek INNER JOIN webshoporszag ON TermekSzarmazas = OrszagID WHERE TermekCim like ?"
        const [orszagok] = await DBconnetion.promise().query(query,[`%${nev}%`])
        if (orszagok.length == 0) 
        {
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
})
router.get("/kosartermekek",async(request,response)=>{
    
    try {
        const UserID = jwt.verify(request.cookies.auth_token_access, process.env.JWT_SECRET).userID;
        const query = "SELECT * FROM KosárTermék INNER JOIN webshoptermek ON KosárTermék.TermekID = webshoptermek.TermekID WHERE KosarID LIKE ?"
        const [termekek] = await DBconnetion.promise().query(query,[UserID])
        response.status(200).json({
            termekek: termekek
        })
    } catch (error) {
        console.log(error)
        response.status(500).json({
            hiba:error
        })
    }
})
router.patch('/TermekFrissitesTeszt', async (request, response) => {
   
    try {
         let mit = request.body.id;
        let mennyit = request.body.mennyiseg;
        const UserID = jwt.verify(request.cookies.auth_token_access, process.env.JWT_SECRET).userID;
        let siker = true;
        let JoSzam = false;
        let negativszam = false;
    if (mennyit < 1) 
    {
        negativszam = true;
        siker = false;
        JoSzam = false;
    }
    else{
    let TermékTöltés = 'UPDATE KosárTermék SET Darabszam = ? WHERE KosarID LIKE ? AND TermekID LIKE ?';
       const [frissit] = await DBconnetion.promise().query(TermékTöltés, [
            mennyit,
            jwt.verify(request.cookies.auth_token_access, process.env.JWT_SECRET).userID,
            mit
        ]);
        if (frissit.affectedRows == 0) {
            siker = false;
        }
        else
        {
                const Testquery = "SELECT * FROM KosárTermék WHERE KosarID LIKE ? AND TermekID = ?"
                const [termekek] = await DBconnetion.promise().query(Testquery,[UserID,mit])
                if (termekek[0].Darabszam == mennyit) 
                {
                    JoSzam = true;    
                }
                
        }
    }
                response.status(200).json({
                    siker:siker,
                    JoSzam: JoSzam,
                    negativszam : negativszam
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
    const KosarElsoLeker = "SELECT * FROM KosárTermék WHERE KosarID LIKE ?"
    const [kosarElso] = await DBconnetion.promise().query(KosarElsoLeker, [honnan]);
    if (kosarElso.length == 0) 
        {
                siker = false;
                ures = false;
                alapures = true;    
                 console.log("asd")
        }
    else{
       
    let TermékTörlés = 'DELETE FROM KosárTermék WHERE KosarID LIKE ?';
       const [torol] = await DBconnetion.promise().query(TermékTörlés, [honnan]);
       if (torol.affectedRows == 0) {
        siker=false;
        }
        else{
            const KosarLeker = "SELECT * FROM KosárTermék WHERE KosarID LIKE ?"
            const [kosar] = await DBconnetion.promise().query(KosarLeker, [honnan]);
            if (kosar.length > 0) 
            {
                siker = false;
                ures = false;    
            }
            else if(kosar.length == 0){
                ures = true;
            }
        }  
    }
     response.status(200).json({
            siker: siker,
            ures:ures,
            alapures: alapures
        });
    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: 'Hiba Történt!',
            hiba: error
        });
    }
});
module.exports = router;
