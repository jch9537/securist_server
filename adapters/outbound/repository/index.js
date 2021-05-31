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
    userRepository: new UserRepository(db),
    companyRepository: new CompanyRepository(db),
    profileRepository: new ProfileRepository(db),
    relationRepository: new RelationRepository(db),
};
