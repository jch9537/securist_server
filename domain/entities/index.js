module.exports = {
    // 회원 가입
    AuthEntity: require('./AuthEntity'),
    WithdrawalInfoEntity: require('./WithdrawalInfoEntity'), // 탈퇴 정보
    // 클라이언트
    ClientUsersEntity: require('./ClientUsersEntity'),
    ClientGradeInfoEntity: require('./ClientGradeInfoEntity'),
    VouchersEntity: require('./VouchersEntity'),
    ClientCompaniesEntity: require('./ClientCompaniesEntity'),
    LinkedClientUsersCompaniesEntity: require('./LinkedClientUsersCompaniesEntity'),

    // 컨설턴트
    ConsultantUsersEntity: require('./ConsultantUsersEntity'),
    ConsultantGradeInfoEntity: require('./ConsultantGradeInfoEntity'),
    ConsultantPenaltyEntity: require('./ConsultantPenaltyEntity'),
    ConsultingCompaniesEntity: require('./ConsultingCompaniesEntity'),
    LinkedConsultantUsersCompaniesEntity: require('./LinkedConsultantUsersCompaniesEntity'),

    // 프로필 임시저장
    TempProfilesEntity: require('./TempProfilesEntity'),
    TempAbilityCertificationsEntity: require('./TempAbilityCertificationsEntity'),
    TempEtcCertificationsEntity: require('./TempEtcCertificationsEntity'),
    TempAbilityTasksEntity: require('./TempAbilityTasksEntity'),
    TempAcademicBackgroundEntity: require('./TempAcademicBackgroundEntity'),
    TempCareerEntity: require('./TempCareerEntity'),
    TempLicenseEntity: require('./TempLicenseEntity'),
    // TempProfileProjectHistoryConsultingCompanyEntity: require('./ProfileProjectHistoryConsultingCompanyEntity'),
    TempProjectHistoryEntity: require('./TempProjectHistoryEntity'),
    TempUploadFilesEntity: require('./TempUploadFilesEntity'),

    // 프로필
    ProfilesEntity: require('./ProfilesEntity'),
    ProfileAbilityCertificationsEntity: require('./ProfileAbilityCertificationsEntity'),
    ProfileEtcCertificationsEntity: require('./ProfileEtcCertificationsEntity'),
    ProfileAbilityTasksEntity: require('./ProfileAbilityTasksEntity'),
    ProfileAcademicBackgroundEntity: require('./ProfileAcademicBackgroundEntity'),
    ProfileCareerEntity: require('./ProfileCareerEntity'),
    ProfileLicenseEntity: require('./ProfileLicenseEntity'),
    // ProfileProjectHistoryConsultingCompanyEntity: require('./ProfileProjectHistoryConsultingCompanyEntity'),
    ProfileProjectHistoryEntity: require('./ProfileProjectHistoryEntity'),
    ProfileUploadFilesEntity: require('./profileUploadFilesEntity'),
};
