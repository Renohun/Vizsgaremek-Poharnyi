//!Module-ok importálása
require('dotenv').config();
//console.log(process.env)
const express = require('express'); //?npm install express
const path = require('path');
const cookie_parser = require('cookie-parser');
const authenticationMiddleware = require('./api/authenticationMiddleware.js');
const authorizationMiddelware = require('./api/authorizationMiddelware.js');
const saveLastUrl = require('./api/saveLastURLMiddleware.js');

//!Beállítások
const app = express();
const router = express.Router();

const ip = '0.0.0.0';
const port = 3006;

app.use(express.json()); //?Middleware JSON
app.set('trust proxy', 1); //?Middleware Proxy
app.use(cookie_parser());

router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/')));

router.get('/', saveLastUrl, (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'Frontend', 'Dinamikus Weboldalak', 'LandingPage', 'LandingPage.html'));
});
//Ne / legyen a default hanem A Fooldal
router.get('/', (req, res) => {
    res.redirect('/Fooldal');
});

//Landing Page
router.get('/Fooldal', saveLastUrl, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/LandingPage/LandingPage.html'));
});

//Regisztracio - Dinamikus
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/Regisztráció/')));
router.get('/Regisztralj', saveLastUrl, (req, res) => {
    if (req.cookies.auth_token == null) {
        res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/Regisztráció/Regisztracio.html'));
    } else {
        res.redirect('/');
    }
});

//Bejelentkezes - Dinamikus
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/')));
router.get('/LepjBe', saveLastUrl, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/belepes.html'));
});
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/')));
router.get('/felhasznaloEllenorzes', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/felhasnzaloEll.html'));
});

router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/')));
router.get('/felhasznaloAuth/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/emailKodMegadas.html'));
});

router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/')));
router.get('/jelszoValtoztatas/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/belepes/jelszoValt.html'));
});

//KoktelKeszites
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/NewCocktail/')));
router.get('/Keszites', saveLastUrl, (req, res) => {
    if (req.cookies.auth_token == null) {
        res.redirect('/LepjBe');
    } else {
        res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/NewCocktail/NewCocktail.html'));
    }
});
//WebShop
router.get('/WebShop', saveLastUrl, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/WebShopMain/WebShopMain.html'));
});
//Kijelentkezes
//TODO POST-ra atirni
router.get('/Kijelentkezes', authenticationMiddleware, (req, res) => {
    res.clearCookie('auth_token');
    res.clearCookie('auth_token_access');

    res.redirect('/');
});

//Adatok - Dinamikus
router.get('/Adatlap', saveLastUrl, authenticationMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/Adatlap/Adatlap.html'));
});
//AdminPanel - Dinamikus
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/AdminPanel - Dinamikus')));
router.get('/AdminPanel', saveLastUrl, authenticationMiddleware, authorizationMiddelware, (req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'Frontend', 'Dinamikus Weboldalak', 'AdminPanel - Dinamikus', 'index.html')
    );
});
//Koktelok
router.use(express.static(path.join(__dirname, '..', 'Frontend', 'Dinamikus Weboldalak', 'Pohárnyi - Dinamikus')));
router.get('/Koktelok', saveLastUrl, (req, res) => {
    //console.log(req);

    res.sendFile(path.join(__dirname, '..', 'Frontend', 'Dinamikus Weboldalak', 'Pohárnyi - Dinamikus', 'PohAlc.html'));
});

//Koktel
router.use(express.static(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/KoktélLap')));
router.get('/Koktel/:koktelID', saveLastUrl, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/KoktélLap/koktellap.html'));
});
router.get('/KoktelHiba', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/KoktélLap/nincsilyen.html'));
});
// termekek
router.get('/Termek/:termekID', saveLastUrl, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/TermekOldal/TermekOldal.html'));
});
router.get('/HianyzoTermek', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/TermekOldal/NincsIlyenTermek.html'));
});

router.get('/jogosultsag', saveLastUrl, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/hibaOldalak/jogosultsag.html'));
});

//Mi Van A Polcon?
router.get('/PolcKoktel', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/Dinamikus Weboldalak/Mi van a polcon/mivanapolcon.html'));
});
//!API endpoints
app.use('/', router);
const endpoints = require('./api/api.js');
app.use('/api', endpoints);

//ÁLTALÁNOS SZŰRÉS
//ha olyan endpointra hivatkozunk ami nincs, akkor száműzzük, jelenleg a koktélos hibaoldalra
app.use((req, res) => {
    res.redirect('/KoktelHiba');
});
//!Szerver futtatása
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});

//?Szerver futtatása terminalból: npm run dev
//?Szerver leállítása (MacBook és Windows): Control + C
//?Terminal ablak tartalmának törlése (MacBook): Command + K
