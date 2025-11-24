const express = require('express');
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
});
