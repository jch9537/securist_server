const Database = require('../../../infrastructure/database');
const db = new Database();

const UserRepository = require('./UserRepository');
const CompanyRepository = require('./CompanyRepository');
const ProfileRepository = require('./ProfileRepository');

module.exports = {
    userRepository: new UserRepository(db),
    companyRepository: new CompanyRepository(db),
    profileRepository: new ProfileRepository(db),
};
