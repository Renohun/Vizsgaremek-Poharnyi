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
server.use(express.static(path.join(__dirname, '..', 'Frontend', 'templateHTML')));

//szerver futattas eseten a landing page legyen az elso html amit megnyit
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'templateHTML', 'Landing Page', 'Landing Page.html'));
});

server.listen(port, ip, () => {
    console.log(`http://${ip}:${port}`);
});
