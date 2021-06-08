const { repository } = require('../outbound');
const {
    CreateConsultantProfileTemp,
    CreateConsultingCompanyProfileTemp,
    GetProfileTemp,
    DeleteProfileTemp,
} = require('../../domain/usecase/profile');

module.exports = {
    // 사용자 - 프로필 임시정보 생성 : 임시저장
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
            console.log(
                '에러 응답 > adapters > inbound > profileAdapter > createConsultantProfileTemp - error : ',
                error
            );
            throw error;
        }
    },
    // 기업 - 프로필 임시정보 생성 : 임시저장
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
            console.log(
                '에러 응답 > adapters > inbound > profileAdapter > createConsultingCompanyProfileTemp - error : ',
                error
            );
            throw error;
        }
    },
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
            console.log(
                '에러 응답 > adapters > inbound > profileAdapter > getProfileTemp - error : ',
                error
            );
            throw error;
        }
    },
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
            console.log(
                '에러 응답 > adapters > inbound > profileAdapter > deleteProfileTemp - error : ',
                error
            );
            throw error;
        }
    },
};
