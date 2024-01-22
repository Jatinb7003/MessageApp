const mysql = require('mysql');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'message',
    connectionLimit:10,
});

module.exports = connection;