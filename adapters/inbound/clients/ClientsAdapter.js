// 클라이언트
const {
    GetClients,
    GetClient,
    UpdateClient,
} = require('../../../domain/usecase/clients');

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

    // 클라이언트 정보 수정하기
    async updateClient(clientData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            clientData
        );
        let result;
        try {
            let updateClient = new UpdateClient(repository);
            result = await updateClient.excute(clientData);
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
