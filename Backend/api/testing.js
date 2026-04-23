const express = require('express');
const DBconnetion = require('../database.js');
const argon = require('argon2');
const router = express.Router();


async function lekeres(query, param) {
    let result;
    await DBconnetion.promise()
        .query(query, param)
        .then(([rows]) => {
            result = rows;
        });
    return result;
}


router.get("/koktelTest",async(request,response)=>{
        let mukodikKoktel=false
        let mukodikKomment=false
        let mukodikKommertErt=false
        let mukodikErtekeles=false
        let mukodikKedvenc=false
        const feltoltes="INSERT INTO koktél (Keszito,Alkoholos,KoktelCim,Alap,Recept,AlapMennyiseg) VALUES (?,?,?,?,?,?)"
        const ertekeles="INSERT INTO ertekeles (Keszito,HovaIrták,MilyenDologhoz,Ertekeles) VALUES (?,?,?,?)"
        const komment="INSERT INTO komment (Keszito,HovaIrták,MilyenDologhoz,Tartalom) VALUES (?,?,?,?)"
        const ertekeleskomment="INSERT INTO kommentertekeles (FelhID,KommentID,Pozitiv,Negativ) VALUES (?,?,?,?)"
        const kedvenc="INSERT INTO kedvencek (KikedvelteID,MitkedveltID) VALUES (?,?)"
        const jelentes="INSERT INTO jeletesek (JelentettID,JelentettTartalomID,JelentesTipusa) VALUES (?,?,?,?)"
        const jelentok="INSERT INTO jelentők (JelentőID,JelentésID,JelentesIndoka) VALUES (?,?,?)"
        const torles="DELETE FROM koktél WHERE KoktélID LIKE ?"
        
        await lekeres(feltoltes,[1,1,"Alkohol","Alkohol","Tölts bele alkoholt",10])
        const koktel="SELECT * FROM koktél"
        let eredmeny=await lekeres(koktel)
        let koktelid
        for (let i = 0; i < eredmeny.length; i++) 
        {
            if (eredmeny[i].Keszito==1&&eredmeny[i].Alkoholos==1&&eredmeny[i].KoktelCim=="Alkohol"&&eredmeny[i].Recept=="Tölts bele alkoholt"&&eredmeny[i].AlapMennyiseg==10) {
                mukodikKoktel=true
                koktelid=eredmeny[i].KoktélID
            }
        }
        if (mukodikKoktel) {
            await lekeres(ertekeles,[11,koktelid,"Koktél",5])
            let ert=await lekeres("SELECT Keszito FROM ertekeles WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?",[koktelid,"Koktél"]);
            if (ert!=undefined) {
                mukodikErtekeles=true
            }

            await lekeres(komment,[11,koktelid,"Koktél","Teszt Komment"])
            let komm=await lekeres("SELECT Keszito,KommentID FROM komment WHERE HovaIrták LIKE ? AND MilyenDologhoz LIKE ?",[koktelid,"Koktél"]);
            if (komm!=undefined) {   
                await lekeres(ertekeleskomment,[12,komm[0].KommentID,0,1])
                mukodikKomment=true
                let kommert=await lekeres("SELECT FelhID,KommentID FROM kommentertekeles WHERE FelhID LIKE ? AND KommentID LIKE ?",[12,komm[0].KommentID])
                if (kommert!=undefined) {
                    mukodikKommertErt=true
                    
                }
            }

            await lekeres(kedvenc,[11,koktelid])
            let kedv=await lekeres("SELECT * FROM kedvencek WHERE KiKedvelteID LIKE ?",[11]);
            for (let i = 0; i < kedv.length; i++) {
                if (kedv[i].MitkedveltID==koktelid) {
                    mukodikKedvenc=true
                }
                
            }
            
        }
        response.status(200).json({
            koktel:mukodikKoktel,
            ert:mukodikErtekeles,
            komm:mukodikKomment,
            kommert:mukodikKommertErt,
            kedv:mukodikKedvenc
        })
        
    
    
})



module.exports=router