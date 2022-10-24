const {
    EstimateProject,
    CreateProject,
    GetProjects,
    GetProject,
    UpdateProject,
    DeleteProject,
} = require('../../domain/usecase/projects');
const { repository, service } = require('../outbound');

module.exports = class ProjectsAdapter {
    constructor() {}

    // 프로젝트 견적계산
    async estimateProject(userData, projectData) {
        try {
            console.log('프로젝트 데이터 ', projectData);

            if (userData.userType !== 1) {
                
            }

            const estimateProject = new EstimateProject(service);

            const result = await estimateProject.excute(projectData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 프로젝트 생성
    async createProject(projectData) {
        try {
            const createProject = new CreateProject(repository, service);
            const result = await createProject.excute(projectData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 내 프로젝트 리스트 가져오기 - 클/컨 분기
    async getProjects(projectData) {
        try {
            let getProjects = new GetProjects(repository);
            let result = await getProjects.excute(projectData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 개별 프로젝트 정보 가져오기
    async getProject(projectData) {
        try {
            const getProject = new GetProject(repository);
            const result = await getProject.excute(projectData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // // 프로젝트 정보 수정
    // async updateProject(projectData) {
    //     try {
    //         const updateProject = new UpdateProject(repository);
    //         const result = await updateProject.excute(projectData);
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // // 프로젝트 삭제하기
    // async deleteProject(projectData) {
    //     try {
    //         const deleteProject = new DeleteProject(repository);
    //         const result = await deleteProject.excute(projectData);
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
};
