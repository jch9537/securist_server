/* 
TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
// 사용자와 기업은 다른 영역으로 보고 처리하기 : 코드가 복잡하고 꼬이게 됨
*/
// 메서드 정의 인터페이스 - 컨트롤러
const {
    GetVouchersByClient,
    CreateVoucher,
} = require('../../../domain/usecase/clients/vouchers');

const { repository } = require('../../outbound');

module.exports = class VouchersAdapter {
    constructor() {}
    // 클라이언트 리스트 가져오기
    async getVouchersByClient(voucherData) {
        try {
            const getVouchersByClient = new GetVouchersByClient(repository);
            const result = await getVouchersByClient.excute(voucherData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 클라이언트 정보 가져오기
    async createVoucher(voucherData) {
        try {
            const createVoucher = new CreateVoucher(repository);
            await createVoucher.excute(voucherData);
            return;
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
