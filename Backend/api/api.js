const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'Sikeres teszt elérés'
    });
});

module.exports = router;
