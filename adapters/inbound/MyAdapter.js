const {
    GetClientUser,
    UpdateClientUser,
} = require('../../domain/usecase/client/clientUsers');
const {
    GetConsultantUser,
    UpdateConsultantUser,
} = require('../../domain/usecase/consultant/consultantUsers');
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
                let getClientUser = new GetClientUser(repository);
                result = await getClientUser.excute(myData);
            } else {
                // 개인 컨설턴트 사용자 : userType === 2
                let getConsultantUser = new GetConsultantUser(repository);
                result = await getConsultantUser.excute(myData);
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

                let updateClientUser = new UpdateClientUser(repository);
                result = await updateClientUser.excute(myData);
            } else {
                myData.consultantUserId = userData.consultantUserId;

                let updateConsultantUser = new UpdateConsultantUser(repository);
                result = await updateConsultantUser.excute(myData);
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
