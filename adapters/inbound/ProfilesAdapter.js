const { repository } = require('../outbound');
const {
    CreateConsultantProfile,
    CreateConsultantProfileTemp,
    CreateConsultingCompanyProfile,
    CreateConsultingCompanyProfileTemp,
    CheckProfileTempExist,
    GetProfileTemp,
    RequestClientAuth,
    DeleteProfileTemp,
    CreateProfile,
    GetProfiles,
    GetMyProfile,
    GetProfile,
    UpdateProfile,
} = require('../../domain/usecase/profile');

module.exports = class ProfileAdapter {
    constructor(projectService, adminService) {
        this.projectService = projectService;
        this.adminService = adminService;
    }

    // 프로필 정보 생성 : 사용자
    async createProfile(userData, profileData, uploadData) {
        try {
            // console.log('도착 ', userData, profileData, uploadData);
            const createProfile = new CreateProfile(repository);
            await createProfile.excute(userData, profileData, uploadData);
            return;
        } catch (error) {
            throw error;
        }
    }
    // 내 최신 프로필 정보 가져오기 : 사용자
    async getMyProfile(userData) {
        try {
            const getMyProfile = new GetMyProfile(repository);
            const result = await getMyProfile.excute(userData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 사용자의 프로필 리스트 가져오기 : 관리자
    async getProfiles(userData) {
        try {
            const getProfiles = new GetProfiles(repository);
            const result = await getProfiles.excute(userData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 프로필 정보 가져오기 : 관리자
    async getProfile(profileData) {
        try {
            const getProfile = new GetProfile(repository);
            const result = await getProfile.excute(profileData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 프로필 정보 수정하기 : 관리자
    async updateProfile(profileData, uploadData) {
        try {
            const updateProfile = new UpdateProfile(repository);
            await updateProfile.excute(profileData, uploadData);
            return;
        } catch (error) {
            throw error;
        }
    }

    // // 클라이언트 프로필 인증 요청 : 사용자/기업 정보 수정
    // async requestClientAuth(userData, clientData, uploadData) {
    //     try {
    //         let requestClientAuth = new RequestClientAuth(repository);
    //         let result = await requestClientAuth.excute(
    //             userData,
    //             clientData,
    //             uploadData
    //         );
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // // 프로필 임시저장 데이터 유뮤 확인
    // async checkProfileTempExist(userData) {
    //     console.log(
    //         '요청 > adapters > inbound > profileAdapter > checkProfileTempExist - result : ',
    //         userData
    //     );
    //     try {
    //         let checkProfileTempExist = new CheckProfileTempExist(repository);
    //         let result = await checkProfileTempExist.excute(userData);
    //         console.log(
    //             '응답 > adapters > inbound > profileAdapter > checkProfileTempExist - result : ',
    //             result
    //         );
    //         return result;
    //     } catch (error) {
    //         console.error(
    //             '에러 응답 > adapters > inbound > profileAdapter > checkProfileTempExist - error : ',
    //             error
    //         );
    //         throw error;
    //     }
    // }
};
