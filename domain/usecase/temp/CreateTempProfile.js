const {
    TempProfilesEntity,
    // TempAbilityCertificationsEntity,
    TempAbilityEtcEntity,
    // TempAbilityIndustriesEntity,
    // TempAbilityTasksEntity,
    TempAcademicBackgroundEntity,
    TempCareerEntity,
    TempLicenseEntity,
    TempProjectHistoryEntity,
    TempUploadFilesEntity,
} = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class CreateTempProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData, tempData, uploadData) {
        let result;
        try {
            const {
                tempProfilesRepository,
                tempUploadFilesRepository,
            } = this.repository;
            let tempProfilesEntity, preUploadFilesInfo;
            // // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            // 이전에 저장한 임시저장 프로필이 있다면 가져오기
            tempProfilesEntity = new TempProfilesEntity(userData);
            const preTempProfileInfo = await tempProfilesRepository.getTempProfile(
                tempProfilesEntity
            );

            if (!!preTempProfileInfo) {
                tempData.tempProfileId = preTempProfileInfo.tempProfileId;
                // 기존 업로드 파일 정보리스트  가져오기
                let tempUploadFilesEntity = new TempUploadFilesEntity(tempData);
                preUploadFilesInfo = await tempUploadFilesRepository.getTempUploadFiles(
                    tempUploadFilesEntity
                );
                // 새로운 업로드 파일과 병합
                uploadData = uploadData.concat(preUploadFilesInfo);
                console.log('병합된 업로드 데이터 ', uploadData);
            }

            // 각 entity 생성
            tempData.consultantUserId = userData.consultantUserId; // 사용자 id
            tempProfilesEntity = new TempProfilesEntity(tempData);
            const tempProfileAbilityCertificationIds =
                tempData.abilityCertificationIds;
            const tempAbilityIndustryIds = tempData.abilityIndustryIds;
            const tempAbilityTaskIds = tempData.abilityTaskIds;
            const tempAbilityEtcEntity = new TempAbilityEtcEntity(
                tempData.abilityEtc
            );
            const tempAcademicBackgroundEntity = new TempAcademicBackgroundEntity(
                tempData.academicBackground
            );
            const tempCareerEntities = tempData.career.map(
                (careerData) => new TempCareerEntity(careerData)
            );
            const tempLicenseEntities = tempData.license.map(
                (licenseData) => new TempLicenseEntity(licenseData)
            );
            const tempProjectHistoryEntities = tempData.projectHistory.map(
                (projectHistoryData) =>
                    new TempProjectHistoryEntity(projectHistoryData)
            );
            const tempUploadFilesEntities = uploadData.map(
                (eachData) => new TempUploadFilesEntity(eachData)
            );

            // 임시 정보 생성
            await tempProfilesRepository.createTempProfile(
                tempProfilesEntity,
                tempProfileAbilityCertificationIds,
                tempAbilityIndustryIds,
                tempAbilityTaskIds,
                tempAbilityEtcEntity,
                tempAcademicBackgroundEntity,
                tempCareerEntities,
                tempLicenseEntities,
                tempProjectHistoryEntities,
                tempUploadFilesEntities
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
