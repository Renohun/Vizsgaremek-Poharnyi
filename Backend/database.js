const mysql = require('mysql2');

const connetion = mysql.createConnection({
    host: '127.0.0.1',
    user: 'webadmin',
    password: '#Admin12345678@',
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
