const {
    GetConsultants,
    GetConsultant,
    UpdateConsultant,
} = require('../../../domain/usecase/consultants');

const { repository } = require('../../outbound');

module.exports = class ConsultantsAdapter {
    constructor() {}
    // 컨설턴트 리스트 가져오기
    async getConsultants() {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUsers - userId : '
        );
        let result;
        try {
            let getConsultants = new GetConsultants(repository);
            result = await getConsultants.excute();

            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
                error
            );
            throw error;
        }
    }

    // 컨설턴트 정보 가져오기
    async getConsultant(consultantData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            consultantData
        );
        let result;
        try {
            let getConsultant = new GetConsultant(repository);
            result = await getConsultant.excute(consultantData);
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
                error
            );
            throw error;
        }
    }

    // 컨설턴트 정보 수정하기
    async updateConsultant(consultantData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            consultantData
        );
        let result;
        try {
            let updateConsultant = new UpdateConsultant(repository);
            result = await updateConsultant.excute(consultantData);
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
                error
            );
            throw error;
        }
    }
};
