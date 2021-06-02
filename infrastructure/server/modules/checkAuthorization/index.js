const CheckAuthorization = require('./checkAuthorization');
const Database = require('../../../database');
const db = new Database();

module.exports = {
    checkAuthorization: new CheckAuthorization(db),
};
