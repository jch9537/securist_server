/* 
TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
// 사용자와 기업은 다른 영역으로 보고 처리하기 : 코드가 복잡하고 꼬이게 됨
*/
// 메서드 정의 인터페이스 - 컨트롤러
const { GetClients, GetClient } = require('../../../domain/usecase/clients');

const { repository } = require('../../outbound');

module.exports = class ClientsAdapter {
    constructor() {}
    // 클라이언트 리스트 가져오기
    async getClients() {
        try {
            const getClients = new GetClients(repository);
            const result = await getClients.excute();
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 클라이언트 정보 가져오기
    async getClient(clientData) {
        try {
            const getClient = new GetClient(repository);
            const result = await getClient.excute(clientData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // // 클라이언트 정보 수정하기
    // async updateClient(clientData) {
    //     console.log(
    //         '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
    //         clientData
    //     );
    //     let result;
    //     try {
    //         let getClient = new GetClient(repository);
    //         result = await getClient.excute(clientData);
    //         return result;
    //     } catch (error) {
    //         console.log(
    //             '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
    //             error
    //         );
    //         throw error;
    //     }
    // }
};
