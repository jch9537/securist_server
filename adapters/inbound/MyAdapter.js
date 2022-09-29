const { GetClient, UpdateClient } = require('../../domain/usecase/clients');
const {
    GetConsultant,
    UpdateConsultant,
} = require('../../domain/usecase/consultants');
const { repository } = require('../outbound');

module.exports = class MyAdapter {
    constructor() {}
    // 내 정보 가져오기
    async getMyInfo(myData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUsers - userId : '
        );
        let result;
        let { userType } = myData;
        try {
            if (userType === 1) {
                // 클라이언트 사용자
                let getClient = new GetClient(repository);
                result = await getClient.excute(myData);
            } else {
                // 개인 컨설턴트 사용자 : userType === 2
                let getConsultant = new GetConsultant(repository);
                result = await getConsultant.excute(myData);
            }
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
                error
            );
            throw error;
        }
    }

    // 내 정보 수정하기
    async updateMyInfo(userData, myData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            myData
        );
        let result;
        try {
            if (userData.userType === 1) {
                myData.clientUserId = userData.clientUserId;

                let updateClient = new UpdateClient(repository);
                result = await updateClient.excute(myData);
            } else {
                myData.consultantId = userData.consultantId;

                let updateConsultant = new UpdateConsultant(repository);
                result = await updateConsultant.excute(myData);
            }

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
