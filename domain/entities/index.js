module.exports = {
    // 회원 가입
    AuthEntity: require('./AuthEntity'),
    WithdrawalInfoEntity: require('./WithdrawalInfoEntity'), // 탈퇴 정보
    // 클라이언트
    ClientUsersEntity: require('./ClientUsersEntity'),
    ClientCompaniesEntity: require('./ClientCompaniesEntity'),
    ClientUserAndCompanyEntity: require('./ClientUserAndCompanyEntity'),

    // 컨설턴트
    ConsultantUsersEntity: require('./ConsultantUsersEntity'),
    ConsultingCompaniesEntity: require('./ConsultingCompaniesEntity'),
    ConsultantUserAndCompanyEntity: require('./ConsultantUserAndCompanyEntity'),

    // 프로필 임시저장
    TempProfileAbilityCertificationsEntity: require('./TempProfileAbilityCertificationsEntity'),
    TempProfileAbilityEtcEntity: require('./TempProfileAbilityEtcEntity'),
    TempProfileAbilityIndustriesEntity: require('./TempProfileAbilityIndustriesEntity'),
    TempProfileAbilityTasksEntity: require('./TempProfileAbilityTasksEntity'),
    TempProfileAcademicBackgroundEntity: require('./TempProfileAcademicBackgroundEntity'),
    TempProfileCareerEntity: require('./TempProfileCareerEntity'),
    TempProfileLicenseEntity: require('./TempProfileLicenseEntity'),
    // TempProfileProjectHistoryConsultingCompanyEntity: require('./ProfileProjectHistoryConsultingCompanyEntity'),
    TempProfileProjectHistoryEntity: require('./TempProfileProjectHistoryEntity'),
    TempUploadFilesEntity: require('./TempUploadFilesEntity'),

    // 프로필
    ProfileAbilityCertificationsEntity: require('./ProfileAbilityCertificationsEntity'),
    ProfileAbilityEtcEntity: require('./ProfileAbilityEtcEntity'),
    ProfileAbilityIndustriesEntity: require('./ProfileAbilityIndustriesEntity'),
    ProfileAbilityTasksEntity: require('./ProfileAbilityTasksEntity'),
    ProfileAcademicBackgroundEntity: require('./ProfileAcademicBackgroundEntity'),
    ProfileCareerEntity: require('./ProfileCareerEntity'),
    ProfileLicenseEntity: require('./ProfileLicenseEntity'),
    // ProfileProjectHistoryConsultingCompanyEntity: require('./ProfileProjectHistoryConsultingCompanyEntity'),
    ProfileProjectHistoryEntity: require('./ProfileProjectHistoryEntity'),
    // profileUploadFilesEntity: require('./')
};
