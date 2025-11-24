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
server.use(express.static(path.join(__dirname, '..', 'Frontend', 'templateHTML')));

//szerver futattas eseten a landing page legyen az elso html amit megnyit
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'templateHTML', 'Landing Page', 'Landing Page.html'));
});

server.listen(port, ip, () => {
    console.log(`http://${ip}:${port}`);
});*/
//!Module-ok importálása
const express = require('express'); //?npm install express
const session = require('express-session'); //?npm install express-session
const path = require('path');

//!Beállítások
const app = express();
const router = express.Router();

const ip = '127.0.0.1';
const port = 3000;

app.use(express.json()); //?Middleware JSON
app.set('trust proxy', 1); //?Middleware Proxy

//!Session beállítása:
app.use(
    session({
        secret: 'titkos_kulcs', //?Ezt generálni kell a későbbiekben
        resave: false,
        saveUninitialized: true
    })
);

//!Routing
//?Főoldal:

app.use(express.static(path.join(__dirname, '..', 'Frontend', 'templateHTML')));

router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'Frontend', 'templateHTML', 'Landing Page', 'Landing Page.html'));
});
//NavBar routing
router.get('/LepjBe', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/templateHTML/belepes/belepes.html'));
});

//!API endpoints
app.use('/', router);
const endpoints = require('./api/api.js');
app.use('/api', endpoints);

//!Szerver futtatása
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});

//?Szerver futtatása terminalból: npm run dev
//?Szerver leállítása (MacBook és Windows): Control + C
//?Terminal ablak tartalmának törlése (MacBook): Command + K
