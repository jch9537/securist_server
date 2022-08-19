module.exports = class TempProfilesRepository {
    constructor(db) {
        this.db = db;
    }

    // 개인 컨설턴트 프로필 임시저장 : 프로필 임시정보 생성
    async createTempProfile(
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
    ) {
        let result;
        try {
            result = await this.db.createTempProfile(
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

    // 프로필 임시저장 정보 리스트 가져오기 : 필요없음
    // async getTempProfiles(userData) { }

    // 프로필 임시저장 정보 가져오기
    async getTempProfile(userData) {
        let result;
        try {
            result = await this.db.getTempProfile(userData);

            return result;
        } catch (error) {
            throw error;
        }
    }

    // // 프로필 임시저장 정보 수정 : 수정없이 삭제 후 새로 생성
    // async updateProfileTemp(deleteData) {}

    // 프로필 임시저장 정보 삭제 : 컨설턴트 (개인/기업) 공통
    async deleteTempProfile(tempProfilesEntity) {
        let result;
        try {
            result = await this.db.deleteTempProfile(tempProfilesEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
