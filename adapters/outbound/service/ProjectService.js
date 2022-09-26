// 프로젝트 서버
module.exports = class ProjectService {
    constructor(userServer) {
        this.userServer = userServer;
    }

    async getProjects() {
        try {
            let result = await this.userServer.getProjects();
            return result;
        } catch (error) {
            throw error;
        }
    }
};
