const mysql = require('mysql');

const dbConfig = {

};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
