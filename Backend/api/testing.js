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


async function lekeres(query, param) {
    let result;
    await DBconnetion.promise()
        .query(query, param)
        .then(([rows]) => {
            result = rows;
        });
    return result;
}


router.get("/koktélCreateTest",async(request,response)=>{
    try {
        let mukodik=false
        const feltoltes="INSERT INTO koktél (Keszito,Alkoholos,KoktelCim,Alap,Recept,AlapMennyiseg)"
        await lekeres(feltoltes,[1,1,"Alkohol","Alkohol","Tölts bele alkoholt",10])
        const koktel="SELECT * FROM koktél"
        let eredmeny=await lekeres(koktel)
        for (let i = 0; i < eredmeny.length; i++) {
            if (eredmeny[i].Keszito==1&&eredmeny[i].Alkoholos==1&&eredmeny[i].KoktelCim=="Alkohol"&&eredmeny[i].Recept=="Tölts bele alkoholt"&&eredmeny[i].AlapMennyiseg==10) {
                mukodik=true
            }
        }
        if (mukodik) {
            response.status(200).json({
                message:"Sikeresen Működik!"
            })
        }
        else{
            response.status(500).json({
                message:"Nem működik!"
            })
        }
    } 
    catch (error) {
        let hiba=error
        response.status(500).json({
            message:"Hiba!",
            hiba:hiba
        })
    }

})



module.exports=router