const { repository } = require('../../outbound');
const {
    CreateConsultantProfile,
    CreateConsultantProfileTemp,
    CreateConsultingCompanyProfile,
    CreateConsultingCompanyProfileTemp,
    CheckProfileTempExist,
    GetProfile,
    GetProfileTemp,
    RequestClientAuth,
    DeleteProfileTemp,
} = require('../../../domain/usecase/profile');

module.exports = class ProfileAdapter {
    constructor(projectService, adminService) {
        this.projectService = projectService;
        this.adminService = adminService;
    }

    // 개인 컨설턴트 프로필 인증 요청 : 프로필 정보 생성
    async createConsultantProfile(userData, profileData, uploadData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > createConsultantProfile - result : ',
            userData,
            profileData,
            uploadData
        );
        try {
            let createConsultantProfile = new CreateConsultantProfile(
                repository
            );
            let result = await createConsultantProfile.excute(
                userData,
                profileData,
                uploadData
            );
            console.log(
                '응답 > adapters > inbound > profileAdapter > createConsultantProfile - result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 응답 > adapters > inbound > profileAdapter > createConsultantProfile - error : ',
                error
            );
            throw error;
        }
    }
    // 컨설팅 업체 프로필 인증 요청 : 프로필 정보 생성
    async createConsultingCompanyProfile(userData, profileData, uploadData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > createConsultingCompanyProfile - result : ',
            userData,
            profileData,
            uploadData
        );
        try {
            let createConsultingCompanyProfile = new CreateConsultingCompanyProfile(
                repository
            );
            let result = await createConsultingCompanyProfile.excute(
                userData,
                profileData,
                uploadData
            );
            console.log(
                '응답 > adapters > inbound > profileAdapter > createConsultingCompanyProfile - result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 응답 > adapters > inbound > profileAdapter > createConsultingCompanyProfile - error : ',
                error
            );
            throw error;
        }
    }
    // 클라이언트 프로필 인증 요청 : 사용자/기업 정보 수정
    async requestClientAuth(userData, clientData, uploadData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > requestClientAuth - result : ',
            userData,
            clientData,
            uploadData
        );
        try {
            let requestClientAuth = new RequestClientAuth(repository);
            let result = await requestClientAuth.excute(
                userData,
                clientData,
                uploadData
            );
            console.log(
                '응답 > adapters > inbound > profileAdapter > requestClientAuth - result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 응답 > adapters > inbound > profileAdapter > requestClientAuth - error : ',
                error
            );
            throw error;
        }
    }
    // 개인 컨설턴트 프로필 임시저장 : 프로필 임시정보 생성
    async createConsultantProfileTemp(userData, tempData, uploadData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > createConsultantProfileTemp - result : ',
            userData,
            tempData,
            uploadData
        );
        try {
            let createConsultantProfileTemp = new CreateConsultantProfileTemp(
                repository
            );
            let result = await createConsultantProfileTemp.excute(
                userData,
                tempData,
                uploadData
            );
            console.log(
                '응답 > adapters > inbound > profileAdapter > createConsultantProfileTemp - result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 응답 > adapters > inbound > profileAdapter > createConsultantProfileTemp - error : ',
                error
            );
            throw error;
        }
    }
    // 기업 프로필 임시저장 : 프로필 임시정보 생성
    async createConsultingCompanyProfileTemp(userData, tempData, uploadData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > createConsultingCompanyProfileTemp - result : ',
            userData,
            tempData,
            uploadData
        );
        try {
            let createConsultingCompanyProfileTemp = new CreateConsultingCompanyProfileTemp(
                repository
            );
            let result = await createConsultingCompanyProfileTemp.excute(
                userData,
                tempData,
                uploadData
            );
            console.log(
                '응답 > adapters > inbound > profileAdapter > createConsultingCompanyProfileTemp - result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 응답 > adapters > inbound > profileAdapter > createConsultingCompanyProfileTemp - error : ',
                error
            );
            throw error;
        }
    }

    // 프로필 임시저장 데이터 유뮤 확인
    async checkProfileTempExist(userData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > checkProfileTempExist - result : ',
            userData
        );
        try {
            let checkProfileTempExist = new CheckProfileTempExist(repository);
            let result = await checkProfileTempExist.excute(userData);
            console.log(
                '응답 > adapters > inbound > profileAdapter > checkProfileTempExist - result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 응답 > adapters > inbound > profileAdapter > checkProfileTempExist - error : ',
                error
            );
            throw error;
        }
    }

    // 프로필 정보 가져오기 : 컨설턴트 (개인/기업) 공통
    async getProfile(userData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > getProfile - result : ',
            userData
        );
        try {
            let getProfile = new GetProfile(repository);
            let result = await getProfile.excute(userData);
            console.log(
                '응답 > adapters > inbound > profileAdapter > getProfile - result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 응답 > adapters > inbound > profileAdapter > getProfile - error : ',
                error
            );
            throw error;
        }
    }
    // 프로필 임시저장 가져오기 : 컨설턴트 (개인/기업) 공통
    async getProfileTemp(userData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > getProfileTemp - result : ',
            userData
        );
        try {
            let getProfileTemp = new GetProfileTemp(repository);
            let result = await getProfileTemp.excute(userData);
            console.log(
                '응답 > adapters > inbound > profileAdapter > getProfileTemp - result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 응답 > adapters > inbound > profileAdapter > getProfileTemp - error : ',
                error
            );
            throw error;
        }
    }
    // 프로필 임시저장 정보 삭제 : 컨설턴트 (개인/기업) 공통
    async deleteProfileTemp(userData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > deleteProfileTemp - result : ',
            userData
        );
        try {
            let deleteProfileTemp = new DeleteProfileTemp(repository);
            let result = await deleteProfileTemp.excute(userData);
            console.log(
                '응답 > adapters > inbound > profileAdapter > deleteProfileTemp - result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 응답 > adapters > inbound > profileAdapter > deleteProfileTemp - error : ',
                error
            );
            throw error;
        }
    }
};
