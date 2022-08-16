const {
    GetConsultantUsers,
    GetConsultantUser,
    UpdateConsultantUser,
} = require('../../../domain/usecase/consultant/consultantUsers');

const { repository } = require('../../outbound');

module.exports = class ConsultantUsersAdapter {
    constructor(projectService, adminService) {
        this.projectService = projectService;
        this.adminService = adminService;
    }
    // 컨설턴트 리스트 가져오기
    async getConsultantUsers() {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUsers - userId : '
        );
        let result;
        try {
            let getConsultantUsers = new GetConsultantUsers(repository);
            result = await getConsultantUsers.excute();

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
    async getConsultantUser(consultantUserData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            consultantUserData
        );
        let result;
        try {
            let getConsultantUser = new GetConsultantUser(repository);
            result = await getConsultantUser.excute(consultantUserData);
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
    async updateConsultantUser(consultantUserData) {
        console.log(
            '요청 > adapters > inbound > userAdaptor.js > getUserInfo - userId : ',
            consultantUserData
        );
        let result;
        try {
            let updateConsultantUser = new UpdateConsultantUser(repository);
            result = await updateConsultantUser.excute(consultantUserData);
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
