const { repository } = require('../outbound');
const {
    CreateTempProfile,
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
    // // 프로필 임시저장 데이터 유뮤 확인
    // async checkTempProfileExist(userData) {
    //     console.log(
    //         '요청 > adapters > inbound > profileAdapter > checkTempProfileExist - result : ',
    //         userData
    //     );
    //     try {
    //         let checkTempProfileExist = new CheckTempProfileExist(repository);
    //         let result = await checkTempProfileExist.excute(userData);
    //         console.log(
    //             '응답 > adapters > inbound > profileAdapter > checkTempProfileExist - result : ',
    //             result
    //         );
    //         return result;
    //     } catch (error) {
    //         console.error(
    //             '에러 응답 > adapters > inbound > profileAdapter > checkTempProfileExist - error : ',
    //             error
    //         );
    //         throw error;
    //     }
    // }
    // // 기업 프로필 임시저장 : 프로필 임시정보 생성
    // async createConsultingCompanyTempProfile(userData, tempData, uploadData) {
    //     console.log(
    //         '요청 > adapters > inbound > profileAdapter > createConsultingCompanyTempProfile - result : ',
    //         userData,
    //         tempData,
    //         uploadData
    //     );
    //     try {
    //         let createConsultingCompanyTempProfile = new CreateConsultingCompanyTempProfile(
    //             repository
    //         );
    //         let result = await createConsultingCompanyTempProfile.excute(
    //             userData,
    //             tempData,
    //             uploadData
    //         );
    //         console.log(
    //             '응답 > adapters > inbound > profileAdapter > createConsultingCompanyTempProfile - result : ',
    //             result
    //         );
    //         return result;
    //     } catch (error) {
    //         console.error(
    //             '에러 응답 > adapters > inbound > profileAdapter > createConsultingCompanyTempProfile - error : ',
    //             error
    //         );
    //         throw error;
    //     }
    // }
};
