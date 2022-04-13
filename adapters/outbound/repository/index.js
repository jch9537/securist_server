const Database = require('../../../infrastructure/database');
const db = new Database();
const storage = require('../../../infrastructure/database/redis');

const ServiceRepository = require('./ServiceRepository');
const UserRepository = require('./UserRepository');
const CompanyRepository = require('./CompanyRepository');
const ProfileRepository = require('./ProfileRepository');

const ClientUsersRepository = require('./user/ClientUsersRepository');
const ClientCompaniesRepository = require('./company/ClientCompaniesRepository');
const ClientUserAndCompanyRepository = require('./relation/ClientUserAndCompanyRepository');
const ConsultantUsersRepository = require('./user/ConsultantUsersRepository');
const ConsultingCompaniesRepository = require('./company/ConsultingCompaniesRepository');
const ConsultantUserAndCompanyReporitory = require('./relation/ConsultantUserAndCompanyReporitory');

module.exports = {
    serviceRepository: new ServiceRepository(storage),
    userRepository: new UserRepository(db),
    companyRepository: new CompanyRepository(db),
    profileRepository: new ProfileRepository(db),
    //
    clientUsersRepository: new ClientUsersRepository(db),
    clientCompaniesRepository: new ClientCompaniesRepository(db),
    clientUserAndCompanyRepository: new ClientUserAndCompanyRepository(db),
    consultantUsersRepository: new ConsultantUsersRepository(db),
    consultingCompaniesRepository: new ConsultingCompaniesRepository(db),
    consultantUserAndCompanyReporitory: new ConsultantUserAndCompanyReporitory(
        db
    ),
};
