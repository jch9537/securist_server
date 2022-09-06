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
// const ConsultingCompaniesRepository = require('./company/ConsultingCompaniesRepository');
// const ConsultantUserAndCompanyRepository = require('./relation/ConsultantUserAndCompanyRepository');
// 임시저장 (프로필)
const TempProfilesRepository = require('./temp/TempProfilesRepository');
const TempAbilityCertificationsRepository = require('./temp/TempAbilityCertificationsRepository');
const TempAbilityTasksRepository = require('./temp/TempAbilityTasksRepository');
// const TempAbilityIndustriesRepository = require('./temp/TempAbilityIndustriesRepository');
const TempEtcCertificationsRepository = require('./temp/TempEtcCertificationsRepository');
const TempAcademicBackgroundRepository = require('./temp/TempAcademicBackgroundRepository');
const TempCareerRepository = require('./temp/TempCareerRepository');
const TempLicenseRepository = require('./temp/TempLicenseRepository');
const TempProjectHistoryRepository = require('./temp/TempProjectHistoryRepository');
const TempUploadFilesRepository = require('./temp/TempUploadFilesRepository');
// 프로필
const ProfilesRepository = require('./profile/ProfilesRepository');
const ProfileAbilityCertificationsRepository = require('./profile/ProfileAbilityCertificationsRepository');
const ProfileAbilityTasksRepository = require('./profile/ProfileAbilityTasksRepository');
// const ProfileAbilityIndustriesRepository = require('./profile/ProfileAbilityIndustriesRepository');
const ProfileEtcCertificationsRepository = require('./profile/ProfileEtcCertificationsRepository');
const ProfileAcademicBackgroundRepository = require('./profile/ProfileAcademicBackgroundRepository');
const ProfileCareerRepository = require('./profile/ProfileCareerRepository');
const ProfileLicenseRepository = require('./profile/ProfileLicenseRepository');
const ProfileProjectHistoryRepository = require('./profile/ProfileProjectHistoryRepository');
const ProfileUploadFilesRepository = require('./profile/ProfileUploadFilesRepository');

module.exports = {
    serviceRepository: new ServiceRepository(storage),
    userRepository: new UserRepository(db),
    companyRepository: new CompanyRepository(db),
    profileRepository: new ProfileRepository(db),
    //컨설턴트
    clientUsersRepository: new ClientUsersRepository(db),
    clientCompaniesRepository: new ClientCompaniesRepository(db),
    clientUserAndCompanyRepository: new ClientUserAndCompanyRepository(db),
    consultantUsersRepository: new ConsultantUsersRepository(db),
    // consultingCompaniesRepository: new ConsultingCompaniesRepository(db),
    // consultantUserAndCompanyRepository: new ConsultantUserAndCompanyRepository(
    //     db
    // ),
    // 임시저장 (프로필)
    tempProfilesRepository: new TempProfilesRepository(db),
    tempAbilityCertificationsRepository: new TempAbilityCertificationsRepository(
        db
    ),
    tempAbilityTasksRepository: new TempAbilityTasksRepository(db),
    // tempAbilityIndustriesRepository: new TempAbilityIndustriesRepository(db),
    tempEtcCertificationsRepository: new TempEtcCertificationsRepository(db),
    tempAcademicBackgroundRepository: new TempAcademicBackgroundRepository(db),
    tempCareerRepository: new TempCareerRepository(db),
    tempLicenseRepository: new TempLicenseRepository(db),
    tempProjectHistoryRepository: new TempProjectHistoryRepository(db),
    tempUploadFilesRepository: new TempUploadFilesRepository(db),
    // 프로필
    profilesRepository: new ProfilesRepository(db),
    profileAbilityCertificationsRepository: new ProfileAbilityCertificationsRepository(
        db
    ),
    profileAbilityTasksRepository: new ProfileAbilityTasksRepository(db),
    // profileAbilityIndustriesRepository: new ProfileAbilityIndustriesRepository(
    //     db
    // ),
    profileEtcCertificationsRepository: new ProfileEtcCertificationsRepository(
        db
    ),
    profileAcademicBackgroundRepository: new ProfileAcademicBackgroundRepository(
        db
    ),
    profileCareerRepository: new ProfileCareerRepository(db),
    profileLicenseRepository: new ProfileLicenseRepository(db),
    profileProjectHistoryRepository: new ProfileProjectHistoryRepository(db),
    profileUploadFilesRepository: new ProfileUploadFilesRepository(db),
};
