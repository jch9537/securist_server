const { CheckReadAuthorization } = require('../../user');

module.exports = class GetClients {
    constructor(repository, service) {
        this.menuId = 1;
        this.repository = repository;
        this.service = service;
    }
    async excute(userData) {
        try {
            // 사용자 권한 확인
            const checkReadAuthorization = new CheckReadAuthorization(
                this.repository
            );
            await checkReadAuthorization.excute(userData, this.menuId);
            // 클라이언트 리스트 가져오기
            const { userService } = this.service;
            const clientsInfo = await userService.getClients();

            return clientsInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
