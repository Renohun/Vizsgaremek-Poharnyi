//!Module-ok importálása
require('dotenv').config();
//console.log(process.env)
const express = require('express'); //?npm install express
const path = require('path');
const cookie_parser = require('cookie-parser');
const authenticationMiddleware = require('./api/authenticationMiddleware.js');
const authorizationMiddelware = require('./api/authorizationMiddelware.js');

//!Beállítások
const app = express();
const router = express.Router();

const ip = '127.0.0.1';
const port = 3000;

app.use(express.json()); //?Middleware JSON
app.set('trust proxy', 1); //?Middleware Proxy
app.use(cookie_parser());

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
router.get('/Kijelentkezes', authenticationMiddleware, (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: 'true',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SECURE
    });

    res.status(200).json({
        message: 'Sikeresen kijelentkezve'
    });
});

//Adatok - Dinamikus
router.get('/Adatlap', (req, res) => {
    if (req.cookies.auth_token==null) {
        res.redirect('/LepjBe')
    }
    else{
        res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/Adatlap/Adatlap.html'));
    }
});
//AdminPanel - Dinamikus
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/AdminPanel - Dinamikus')));
router.get('/AdminPanel', authenticationMiddleware, authorizationMiddelware, (req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'Frontend', 'Dinamikus Weboldalak', 'AdminPanel - Dinamikus', 'index.html')
    );
});
//Koktelok
router.use(express.static(path.join(__dirname, '..', 'Frontend', 'Dinamikus Weboldalak', 'Pohárnyi - Dinamikus')));
router.get('/Koktelok', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'Dinamikus Weboldalak', 'Pohárnyi - Dinamikus', 'PohAlc.html'));
});

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
