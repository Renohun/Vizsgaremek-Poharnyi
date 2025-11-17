const express = require('express');
const router = express.Router();

router.get('/feldolgozas', (req, res) => {
    res.redirect(req.uzenet)

});

module.exports = router;
