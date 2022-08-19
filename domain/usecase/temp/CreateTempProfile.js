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
const DelteTempProfile = require('./DeleteTempProfile');
const { UserTypeException } = require('../../exceptions');
module.exports = class CreateTempProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData, tempData, uploadData) {
        let result;
        try {
            let { tempProfilesRepository } = this.repository;
            // // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            // 이전에 저장한 임시저장 프로필이 있다면 삭제 처리
            if (!!tempData.tempProfileId) {
                console.log('삭제!=================================');
                // let deleteTempData = {
                //     tempProfileId: tempData.tempProfileId,
                // };
                // let deleteTempProfile = new DelteTempProfile(this.repository);
                // await deleteTempProfile.excute(deleteTempData);
                return { message: '임시저장 정보 삭제 처리할꺼임' };
            }

            // 사용자 id
            tempData.consultantUserId = userData.consultantUserId;

            // 각 entity 생성
            let tempProfilesEntity = new TempProfilesEntity(tempData);
            let tempProfileAbilityCertificationIds =
                tempData.abilityCertificationIds;
            let tempAbilityIndustryIds = tempData.abilityIndustryIds;
            let tempAbilityTaskIds = tempData.abilityTaskIds;
            let tempAbilityEtcEntity = new TempAbilityEtcEntity(
                tempData.abilityEtc
            );
            let tempAcademicBackgroundEntity = new TempAcademicBackgroundEntity(
                tempData.academicBackground
            );
            let tempCareerEntities = tempData.career.map(
                (careerData) => new TempCareerEntity(careerData)
            );
            let tempLicenseEntities = tempData.license.map(
                (licenseData) => new TempLicenseEntity(licenseData)
            );
            let tempProjectHistoryEntities = tempData.projectHistory.map(
                (projectHistoryData) =>
                    new TempProjectHistoryEntity(projectHistoryData)
            );
            let tempUploadFilesEntities = uploadData.map(
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
