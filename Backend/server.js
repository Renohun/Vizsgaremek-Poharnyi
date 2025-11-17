const express = require('express');
const path = require('path');
const port = 8000;
const ip = '127.0.0.1';

const server = express();
//A mappa betoltese
server.use(express.static(path.join(__dirname, '..', 'Frontend', 'templateHTML')));
//Landing
server.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'Frontend', 'templateHTML', 'Landing Page', 'Landing Page.html'));
});

server.listen(port, ip, () => {
    console.log(`http://${ip}:${port}`);
});
