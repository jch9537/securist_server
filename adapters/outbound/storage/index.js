// infrastructure 연결 - S3
const Storage = require('./Storage');
const storageService = require('../../../infrastructure/webService/storageService');

module.exports = new Storage(storageService); //parameter : service
