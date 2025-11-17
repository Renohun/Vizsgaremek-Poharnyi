const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

let szamok = [1, 2, 3, 4, 5];
router.post('/ujszam', (req, res) => {
    try {
        const szam = req.body.number;
        szamok.push(szam);
        res.status(200).json({
            message: 'Sikeres muvelet'
        });
    } catch (error) {
        console.log('POST/ Sikertelen eleres');
        res.status(500).json({ message: 'Sikertelen eleres' });
    }
});
router.get('/szamok', (req, res) => {
    try {
        res.status(200).json({
            message: 'Sikeres eleres',
            result: szamok
        });
    } catch (error) {
        console.log('GET / Sikertelen eleres');
        res.status(500).json({ message: 'Sikerteln vegpont eleres' });
    }
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

//Feladat 1
let uzenteek = [];
router.post('/sendMessage', (req, res) => {
    try {
        res.status(200).json({
            sender: req.body.sender,
            message: req.body.message
        });
        uzenteek.push(req.body);
        console.log('Uzenet fogadva');
        console.log(uzenteek);
    } catch (err) {
        res.status(500).json({
            message: 'Sikertelen eleres'
        });
    }
});
router.get('/sendMessage', (req, res) => {
    try {
        res.status(200).json({
            tomb: uzenteek
        });
    } catch (err) {
        res.status(500).json({
            message: 'Sikertelen eleres'
        });
    }
});

module.exports = router;
