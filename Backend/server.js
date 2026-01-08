/*const express = require('express');
const path = require('path');
const port = 8000;
const ip = '127.0.0.1';

const server = express();
server.use(express.json());

//Korabban toltse be a API-t mint a statikus oldalt
const apiRoutes = require('./api/api');
server.use('/api', apiRoutes);

//Mindent toltson be a Frontend mappabol, a css/bootstrap miatt
server.use(express.static(path.join(__dirname, '../Frontend/templateHTML')));

//Ne / legyen a default hanem A Fooldal
server.get('/', (req, res) => {
    res.redirect('/Fooldal');
});

//Landing Page
server.get('/Fooldal', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/Landing Page/Landing Page.html'));
});
//PohAlc
server.use(express.static(path.join(__dirname, '../Frontend/templateHTML/Pohárnyi Alkoholos')));
server.get('/PoharnyiAlkoholosKoktelok', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/Pohárnyi Alkoholos/PohAlc.html'));
});

//Regisztracio
server.get('/Regisztralj', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/Regisztráció/Regisztracio.html'));
});

//Bejelentkezes
server.get('/LepjBe', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/belepes/belepes.html'));
});

//KoktelKeszites
server.use(express.static(path.join(__dirname, '../Frontend/templateHTML/Új Koktél/')));
server.get('/Keszites', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/Új Koktél/NewCocktail.html'));
});

//Adatok

server.get('/Adatlap', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/Adatlap/Adatlap.html'));
    //A Kozeljovoben ha valaki erre hivatkozik, akkor gonosz es nincs bejelentkezve, ezert szamuzzunk oda
    //res.redirect('/belepes')
});
//KoktelParam
let KoktelID;

server.get('/Koktel/:koktelID', (req, res) => {
    KoktelID = parseInt(req.params.koktelID);
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/KoktelAdatlap/KoktelAdatlap.html'));
});

//server.post('Koktel/:koktelID');

server.listen(port, ip, () => {
    console.log(`http://${ip}:${port}`);
});*/
//!Module-ok importálása
require("dotenv").config()
console.log(process.env)
const express = require('express'); //?npm install express
const path = require('path');
const cookie_parser = require("cookie-parser")
const authenticationMiddleware = require("./api/authenticationMiddleware.js")
const authorizationMiddelware = require("./api/authorizationMiddelware.js")

//!Beállítások
const app = express();
const router = express.Router();

const ip = '127.0.0.1';
const port = 3000;

app.use(express.json()); //?Middleware JSON
app.set('trust proxy', 1); //?Middleware Proxy
app.use(cookie_parser())

//!Routing
//?Főoldal:

//A DINAMIKUS MAPPA NEM MŰKÖDIK HA EZ NEM EGY KOMMENT
//app.use(express.static(path.join(__dirname, '..', 'Frontend', 'templateHTML')));
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/')));


router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'Frontend', 'templateHTML', 'Landing Page', 'Landing Page.html'));
});
//Ne / legyen a default hanem A Fooldal
router.get('/', (req, res) => {
    res.redirect('/Fooldal');
});

//Landing Page
router.get('/Fooldal', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/Landing Page/Landing Page.html'));
});
//PohAlc
router.use(express.static(path.join(__dirname, '../Frontend/templateHTML/Pohárnyi Alkoholos')));
router.get('/PoharnyiAlkoholosKoktelok', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/Pohárnyi Alkoholos/PohAlc.html'));
});

//Regisztracio - Dinamikus
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/Regisztráció/')));
router.get('/Regisztralj', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/Regisztráció/Regisztracio.html'));
});

//Bejelentkezes - Dinamikus
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/')));
router.get('/LepjBe', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/belepes.html'));
});

//KoktelKeszites
router.use(express.static(path.join(__dirname, '../Frontend/templateHTML/Új Koktél/')));
router.get('/Keszites', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/Új Koktél/NewCocktail.html'));
});

//Kijelentkezes
//TODO POST-ra atirni
router.get("/Kijelentkezes", authenticationMiddleware, (req,res)=>{
    res.clearCookie("auth_token",{
        httpOnly:"true",
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SECURE
    })

    res.status(200).json({
        message: "Sikeresen kijelentkezve"
    })
})

//Adatok - Dinamikus
router.get('/Adatlap', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/Adatlap/Adatlap.html'));
    //A Kozeljovoben ha valaki erre hivatkozik, akkor gonosz es nincs bejelentkezve, ezert szamuzzunk oda
    //res.redirect('/LepjBe')
});
//AdminPanel - Dinamikus
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/AdminPanel - Dinamikus')));
router.get("/AdminPanel", authenticationMiddleware, authorizationMiddelware, (req, res) => {
    res.sendFile(path.join(__dirname,"..","Frontend","Dinamikus Weboldalak","AdminPanel - Dinamikus","index.html"));
  }
);
    
//KoktelParam
let KoktelID;

router.get('/Koktel/:koktelID', (req, res) => {
    KoktelID = parseInt(req.params.koktelID);
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/KoktelAdatlap/KoktelAdatlap.html'));
});

//server.post('Koktel/:koktelID');

//!API endpoints
app.use('/', router);
const endpoints = require('./api/api.js');
const cookieParser = require('cookie-parser');
app.use('/api', endpoints);

//!Szerver futtatása
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});

//?Szerver futtatása terminalból: npm run dev
//?Szerver leállítása (MacBook és Windows): Control + C
//?Terminal ablak tartalmának törlése (MacBook): Command + K
