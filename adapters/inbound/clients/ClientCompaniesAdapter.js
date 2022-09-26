// 클라이언트 기업 adapter
const {
    GetClientCompanies,
    GetClientCompany,
    UpdateClientCompany,
} = require('../../../domain/usecase/client/clientCompanies');

const { repository } = require('../../outbound');

module.exports = class ClientCompaniesAdapter {
    constructor(projectService, adminService) {
        this.projectService = projectService;
        this.adminService = adminService;
    }
    // 클라이언트 기업 리스트 가져오기
    async getClientCompanies() {
        console.log(
            '요청 > adapters > inbound > CompanyAdaptor.js > getCompanys - CompanyId : '
        );
        let result;
        try {
            let getClientCompanies = new GetClientCompanies(repository);
            result = await getClientCompanies.excute();

            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > CompanyAdaptor.js > getCompanyInfo - error : ',
                error
            );
            throw error;
        }
    }

    // 클라이언트 기업 정보 가져오기
    async getClientCompany(clientCompanyData) {
        console.log(
            '요청 > adapters > inbound > CompanyAdaptor.js > getCompanyInfo - CompanyId : ',
            clientCompanyData
        );
        let result;
        try {
            let getClientCompany = new GetClientCompany(repository);
            result = await getClientCompany.excute(clientCompanyData);
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > CompanyAdaptor.js > getCompanyInfo - error : ',
                error
            );
            throw error;
        }
    }

    // 클라이언트 기업 정보 수정하기
    async updateClientCompany(clientCompanyData) {
        console.log(
            '요청 > adapters > inbound > CompanyAdaptor.js > getCompanyInfo - CompanyId : ',
            clientCompanyData
        );
        let result;
        try {
            let updateClientCompany = new UpdateClientCompany(repository);
            result = await updateClientCompany.excute(clientCompanyData);
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > CompanyAdaptor.js > getCompanyInfo - error : ',
                error
            );
            throw error;
        }
    }
};
