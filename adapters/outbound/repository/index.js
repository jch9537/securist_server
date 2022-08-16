const Database = require('../../../infrastructure/database');
const db = new Database();
const storage = require('../../../infrastructure/database/redis');

const ServiceRepository = require('./ServiceRepository');
const UserRepository = require('./UserRepository');
const CompanyRepository = require('./CompanyRepository');
const ProfileRepository = require('./ProfileRepository');

// 클라이언트
const ClientUsersRepository = require('./client/ClientUsersRepository');
const ClientCompaniesRepository = require('./client/ClientCompaniesRepository');
const ClientUserAndCompanyRepository = require('./relation/ClientUserAndCompanyRepository');
// 컨설턴트
const ConsultantUsersRepository = require('./consultant/ConsultantUsersRepository');
const ConsultingCompaniesRepository = require('./company/ConsultingCompaniesRepository');
const ConsultantUserAndCompanyRepository = require('./relation/ConsultantUserAndCompanyRepository');

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
    consultantUserAndCompanyRepository: new ConsultantUserAndCompanyRepository(
        db
    ),
};
