// 프로젝트 서버
module.exports = class ProjectService {
    constructor(projectServer) {
        this.projectServer = projectServer;
    }

    async estimateProject(projectData) {
        try {
            let result = await this.projectServer.estimateProject(projectData);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
