// 프로젝트 서버
module.exports = class ProjectService {
    constructor(projectServer) {
        this.projectServer = projectServer;
    }

    async estimateProject(projectData) {
        try {
            const result = await this.projectServer.estimateProject(
                projectData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async createProject(projectData) {
        try {
            const result = await this.projectServer.createProject(projectData);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
