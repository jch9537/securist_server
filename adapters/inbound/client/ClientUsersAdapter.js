/* 
TODO : 기존 코드에서 사용자와 기업의 처리(router에서 - infra까지)를 분기하기
// 사용자와 기업은 다른 영역으로 보고 처리하기 : 코드가 복잡하고 꼬이게 됨
*/
// 메서드 정의 인터페이스 - 컨트롤러
const {
    GetClientUsers,
    GetClientUser,
} = require('../../../domain/usecase/client/clientUsers');

const { repository } = require('../../outbound');

module.exports = class ClientUsersAdapter {
    constructor(projectService, adminService) {
        this.projectService = projectService;
        this.adminService = adminService;
    }
    // 클라이언트 리스트 가져오기
    async getClientUsers() {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUsers - userId : '
        );
        let result;
        try {
            let getClientUsers = new GetClientUsers(repository);
            result = await getClientUsers.excute();

            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
                error
            );
            throw error;
        }
    }

    // 클라이언트 정보 가져오기
    async getClientUser(clientUserData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            clientUserData
        );
        let result;
        try {
            let getClientUser = new GetClientUser(repository);
            result = await getClientUser.excute(clientUserData);
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > userAdaptor.js > getUserInfo - error : ',
                error
            );
            throw error;
        }
    }

    // 클라이언트 정보 수정하기
    async updateClientUser(clientUserData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            clientUserData
        );
        let result;
        try {
            let getClientUser = new GetClientUser(repository);
            result = await getClientUser.excute(clientUserData);
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
