const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'Sikeres teszt elérés'
    });
});
let felhasznalokTomb = [];
router.post('/felhasznalok', (request, response) => {
    try {
        felhasznaloObj = {
            email: request.body.email,
            felhasznaloNev: request.body.felhasznaloNev,
            jelszo: request.body.jelszo
        };

        felhasznalokTomb.push(felhasznaloObj);

        response.status(200).json({
            message: 'Sikeres muvelet'
        });
        console.log(felhasznaloObj.email + ' - ' + felhasznaloObj.felhasznaloNev + ' - ' + felhasznaloObj.jelszo);
    } catch (err) {
        console.log('Sikertelen muvelet');
        response.status(500).json({
            message: 'POST/ Sikertelen eleres'
        });
    }
});

router.get('/felhasznalok', (request, response) => {
    response.status(200).json({
        message: 'Sikeres eleres',
        felhasznalok: felhasznalokTomb
    });
});
module.exports = router;
