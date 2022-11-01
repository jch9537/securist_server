const { projectService } = require('../../../adapters/outbound/service');
const { LinkedClientUsersCompaniesEntity } = require('../../entities');
module.exports = class CreateProject {
    constructor(repository, service) {
        this.repository = repository;
        this.service = service;
    }
    async excute(userData, projectData) {
        const { linkedClientUsersCompaniesRepository } = this.repository;
        const { adminService, projectService } = this.service;

        try {
            projectData.clientUserId = userData.clientUserId;
            const linkedClientUsersCompaniesEntity = new LinkedClientUsersCompaniesEntity(
                userData
            );

            const companyInfoByClientId = await linkedClientUsersCompaniesRepository.getClientCompanyInfoByUser(
                linkedClientUsersCompaniesEntity
            );
            projectData.clientCompanyId = companyInfoByClientId.clientCompanyId;
            projectData.clientCompanyName = companyInfoByClientId.companyName;
            console.log(
                '기업 정보 : ',
                companyInfoByClientId,
                ' ',
                projectData
            );

            await projectService.createProject(projectData);
            return;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
