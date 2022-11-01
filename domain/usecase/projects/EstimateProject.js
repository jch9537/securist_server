// user 서버 프로젝트 견적 계산 요청
module.exports = class EstimateProject {
    constructor(service) {
        this.service = service;
    }
    async excute(projectData) {
        try {
            const { projectService } = this.service;

            const projectEstimate = await projectService.estimateProject(
                projectData
            );
            return projectEstimate;
        } catch (error) {
            throw error;
        }
    }
};
