const mysql = require('mysql');
const dbconfig = require('../database/dbConfig');
const connection = mysql.createConnection(dbconfig);

connection.connect();
