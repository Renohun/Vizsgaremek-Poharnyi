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
                        //itt visszaadom a felhaszanalo nevet azt hogy admin e
                        //Igy majd tudunk dolgozni a felhasznalo adataival a frontenden
                        response.status(200).json({
                            felhasznaloID: felhasznaloDB.FelhID,
                            adminE: felhasznaloDB.Admin
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
//ADATLAP
//
//
//
const AdatbazisQuery=async(query,params)=>{
    let result
    DBconnetion.query(query,params, async (hiba, eredmeny) => {
        if (hiba) 
        {
            console.error(`hiba történt: ${hiba}`)
        } 
        else 
        {
            result=JSON.stringify(eredmeny)
            return result
        }
        
     })

}
router.get("/AdatlapLekeres/FelhAdatok/:id",async(request,response)=>{

    //A Lekérés definiálása
    let query="SELECT Felhasználónév,Email,Jelszó,ProfilkepUtvonal,RegisztracioDatuma from felhasználó WHERE FelhID LIKE ?;SELECT COUNT(KiKedvelteID) AS KEDVID from kedvencek where KiKedvelteID like ? ;SELECT COUNT(Keszito) AS KOMMID from komment where Keszito like ?;SELECT COUNT(Keszito) AS RATEID from ertekeles where Keszito like ?;SELECT COUNT(Keszito) AS MAKEID from koktél where Keszito like ?;"
    let ertekek=[]
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    for (let i = 0; i < 5; i++) {
        ertekek.push(request.params.id)
    }
    //Lekérdezés
        DBconnetion.query(query,ertekek, async (err, rows) => {
        if (err) {
            response.status(500).json({
                message: 'Hiba tortent lekeres kozben!',
                hiba:err
            });
        } 
        else {
            response.status(200).json({
                message: "Sikeres Lekérés!",
                tartalom:rows
            });
        }
     })
})
//NEM MŰKÖDIK
//MIÉRT NEM?
//CSAK EZ A /KEDVENCEK A BAJ
//DE MIÉRT
router.get("/AdatlapLekeres/Kedvencek/:id",async(request,response)=>{

//A Lekérés definiálása
    let query1="SELECT KoktélID,KoktelCim,BoritoKepUtvonal from koktél where Keszito like ?"
    let query2="SELECT AVG(Ertekeles) from ertekeles where HovaIrták like ?"
    let query3="SELECT Osszetevő from koktelokosszetevoi where KoktélID like ?"
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    let felhaszanalo = request.params.id
    let koktelok=[]
    let ertekelesek=[]
    let osszetevok=[]
    let kokteladatok=[]
    //Lekérdezés
    const c =await AdatbazisQuery(query1,felhaszanalo)
    let ertek=c
    console.log(ertek);
    response.status(200).json({
        response:ertek
    })
    
    
    
})
router.get("/AdatlapLekeres/Jelentesek/:id",async(request,response)=>{

        //A Lekérés definiálása
    let query=""
    let ertekek=[]
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    for (let i = 0; i < 5; i++) {
        ertekek.push(request.params.id)
    }
    //Lekérdezés
    DBconnetion.query(query,ertekek, async (err, rows) => {
        if (err) {
            response.status(500).json({
                message: 'Hiba tortent lekeres kozben!',
                hiba:err
            });
        } 
        else {
            response.status(200).json({
                message: "Sikeres Lekérés!",
                tartalom:rows
            });
        }
     })
})
router.get("/AdatlapLekeres/Kosar/:id",async(request,response)=>{

    //A Lekérés definiálása
    let kerdes="SELECT TermekID,Darabszam,EgysegAr FROM kosártermék WHERE KosarID = ?;"
    let kerdes2="SELECT TermekCim,TermekLeiras FROM webshoptermek WHERE TermekID = ?;"
    //paraméteresen lehet csak megkapni az értéket amiről lekérünk, de hogy kapjuk azt meg?
    let felhaszanalo=request.params.id
    let c=[]
    //Lekérdezés
        DBconnetion.query(kerdes,felhaszanalo, async (err, rows) => {
        if (err) {            
            response.status(500).json({
                message: 'Hiba tortent lekeres kozben!',
                hiba:err
            });
        } 
        else {
            c.push(rows)
        }
    })
     DBconnetion.query(kerdes,felhaszanalo, async (err, rows) => {
        if (err) {            
            response.status(500).json({
                message: 'Hiba tortent lekeres kozben!',
                hiba:err
            });
        } 
        else {
            c.push(rows)
        }
     })
})
//
//
//
//ADATLAP VÉGE
//
//
//
module.exports = router;
