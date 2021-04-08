const mysql = require('mysql');
const dbconfig = require('./dbConfig');

const pool = mysql.createPool(dbconfig);

module.exports = pool;
