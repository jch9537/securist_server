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
// 임시저장 (프로필)
const TempProfilesRepository = require('./temp/TempProfilesRepository');
const TempAbilityCertificationsRepository = require('./temp/TempAbilityCertificationsRepository');
const TempAbilityTasksRepository = require('./temp/TempAbilityTasksRepository');
const TempAbilityIndustriesRepository = require('./temp/TempAbilityIndustriesRepository');
const TempAbilityEtcRepository = require('./temp/TempAbilityEtcRepository');
const TempAcademicBackgroundRepository = require('./temp/TempAcademicBackgroundRepository');
const TempCareerRepository = require('./temp/TempCareerRepository');
const TempLicenseRepository = require('./temp/TempLicenseRepository');
const TempProjectHistoryRepository = require('./temp/TempProjectHistoryRepository');
const TempUploadFilesRepository = require('./temp/TempUploadFilesRepository');

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
    tempProfilesRepository: new TempProfilesRepository(db),
    tempAbilityCertificationsRepository: new TempAbilityCertificationsRepository(
        db
    ),
    tempAbilityTasksRepository: new TempAbilityTasksRepository(db),
    tempAbilityIndustriesRepository: new TempAbilityIndustriesRepository(db),
    tempAbilityEtcRepository: new TempAbilityEtcRepository(db),
    tempAcademicBackgroundRepository: new TempAcademicBackgroundRepository(db),
    tempCareerRepository: new TempCareerRepository(db),
    tempLicenseRepository: new TempLicenseRepository(db),
    tempProjectHistoryRepository: new TempProjectHistoryRepository(db),
    tempUploadFilesRepository: new TempUploadFilesRepository(db),
};
