const mysql = require('mysql2');

const connetion = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pohárnyi',
    multipleStatements:true
});

connetion.connect((err) => {
    if (err) {
        console.log('Hiba tortent az adatbazis csatlakozasanal!');
    } else {
        console.log('Adatbazis sikeresen csatalakoztatva!');
    }
});
module.exports = connetion;
