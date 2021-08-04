const Database = require('../../../infrastructure/database');
const db = new Database();
const Redis = require('../../../infrastructure/database/redis/redis');
const storage = new Redis();

const ServiceRepository = require('./ServiceRepository');
const UserRepository = require('./UserRepository');
const CompanyRepository = require('./CompanyRepository');
const ProfileRepository = require('./ProfileRepository');

module.exports = {
    serviceRepository: new ServiceRepository(storage),
    userRepository: new UserRepository(db),
    companyRepository: new CompanyRepository(db),
    profileRepository: new ProfileRepository(db),
};
