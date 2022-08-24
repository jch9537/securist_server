const { repository } = require('../outbound');
const {
    CreateTempProfile,
    GetTempProfile,
    DeleteTempProfile,
} = require('../../domain/usecase/temp');

module.exports = class TempProfilesAdapter {
    constructor(projectService, adminService) {
        this.projectService = projectService;
        this.adminService = adminService;
    }

    // 프로필 임시저장 정보 생성
    async createTempProfile(userData, tempData, uploadData) {
        try {
            let createTempProfile = new CreateTempProfile(repository);

            let result = await createTempProfile.excute(
                userData,
                tempData,
                uploadData
            );

            return result;
        } catch (error) {
            throw error;
        }
    }

    // 프로필 임시저장 정보 가져오기
    async getTempProfile(userData) {
        try {
            let getTempProfile = new GetTempProfile(repository);
            let result = await getTempProfile.excute(userData);

            return result;
        } catch (error) {
            throw error;
        }
    }

    // 프로필 임시저장 정보 수정 : 삭제 후 생성하므로 필요없음

    // 프로필 임시저장 정보 삭제
    async deleteTempProfile(userData) {
        try {
            let deleteTempProfile = new DeleteTempProfile(repository);
            let result = await deleteTempProfile.excute(userData);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
