const { SignUpEntity } = require('../../entities/user');
const { CompanyEntity } = require('../../entities/company');
const {
    CreateClientCompany,
    CreateConsultingCompany,
} = require('../../usecase/company');

module.exports = class {
    constructor(Auth, Repository) {
        this.Auth = Auth;
        this.Repository = Repository;
    }
    async excute(userParam) {
        let result;
        let userData = {
            email: userParam.email,
            password: userParam.password,
            name: userParam.name,
            userType: userParam.userType,
        };
        let userEntity = new SignUpEntity(userData);
        let userType = userEntity.userType;
        //userType - 1: 개인 컨설턴트 2: 컨설팅업체 3: 클라이언트
        try {
            if (userType === '1') {
                result = await this.Auth.signUp(userEntity);
            } else {
                let companyData = {
                    businessLicenseNum: userParam.businessLicenseNum,
                    companyName: userParam.companyName,
                    presidentName: userParam.presidentName,
                };
                let companyEntity = new CompanyEntity(companyData);

                result = await this.Auth.signUp(userEntity);
                if (userType === '2') {
                    let createConsultingCompany = new CreateConsultingCompany(
                        this.Repository
                    );
                    createConsultingCompany.excute(companyEntity);
                } else {
                    let createClientCompany = new CreateClientCompany(
                        this.Repository
                    );
                    createClientCompany.excute(companyEntity);
                }
            }
        } catch (error) {
            throw error;
        }
        return result;
    }
};
