const Repository = require('./repository');
const Database = require('../../../infrastructure/database');

const db = new Database();

module.exports = new Repository(db); //parameter: db
