module.exports = class ProfilesRepository {
    constructor(db) {
        this.db = db;
    }

    // 프로필 생성
    async createProfile(
        consultantUsersEntity,
        profilesEntity,
        profileAbilityCertificationIds,
        profileAbilityTaskIds,
        profileEtcCertificationsEntity,
        profileAcademicBackgroundEntity,
        profileCareerEntities,
        profileLicenseEntities,
        profileProjectHistoryEntities,
        profileUploadFilesEntities
    ) {
        try {
            await this.db.createProfile(
                consultantUsersEntity,
                profilesEntity,
                profileAbilityCertificationIds,
                profileAbilityTaskIds,
                profileEtcCertificationsEntity,
                profileAcademicBackgroundEntity,
                profileCareerEntities,
                profileLicenseEntities,
                profileProjectHistoryEntities,
                profileUploadFilesEntities
            );
            return;
        } catch (error) {
            throw error;
        }
    }
    // 내 최신 프로필 정보 가져오기
    async getMyProfile(profilesEntity) {
        let result;
        try {
            result = await this.db.getMyProfile(profilesEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }

    // 프로필 정보 리스트 가져오기
    async getProfiles(profilesEntity) {
        let result;
        try {
            result = await this.db.getProfiles(profilesEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }

    // 프로필 정보 가져오기
    async getProfile(profilesEntity) {
        let result;
        try {
            result = await this.db.getProfile(profilesEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }

    // 프로필 정보 수정
    async updateProfile(
        consultantUsersEntity,
        profilesEntity,
        profileAbilityCertificationIds,
        profileAbilityTaskIds,
        profileEtcCertificationsEntity,
        profileAcademicBackgroundEntity,
        profileCareerEntities,
        profileLicenseEntities,
        profileProjectHistoryEntities,
        profileUploadFilesEntities
    ) {
        try {
            await this.db.updateProfile(
                consultantUsersEntity,
                profilesEntity,
                profileAbilityCertificationIds,
                profileAbilityTaskIds,
                profileEtcCertificationsEntity,
                profileAcademicBackgroundEntity,
                profileCareerEntities,
                profileLicenseEntities,
                profileProjectHistoryEntities,
                profileUploadFilesEntities
            );
            return;
        } catch (error) {
            throw error;
        }
    }

    // 프로필 삭제 : 삭제 없음
    // async deleteProfile(profilesEntity) {}
};
