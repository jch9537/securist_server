// const Repository = require('./repository');
// const Database = require('../../../infrastructure/database');

// const db = new Database();

// module.exports = new Repository(db); //parameter: db

const Database = require('../../../infrastructure/database');
const db = new Database();

const UserRepository = require('./UserRepository');
const CompanyRepository = require('./CompanyRepository');
const ProfileRepository = require('./ProfileRepository');
const RelationRepository = require('./RelationRepository');

module.exports = {
    UserRepository: new UserRepository(db),
    CompanyRepository: new CompanyRepository(db),
    ProfileRepository: new ProfileRepository(db),
    RelationRepository: new RelationRepository(db),
};
