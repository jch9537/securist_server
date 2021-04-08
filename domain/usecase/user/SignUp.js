const {
    SignUpEntity,
    ClientUserEntity,
    ConsultantUserEntity,
} = require('../../entities/user');
const CreateConsultantUser = require('./CreateConsultantUser');
const CreateClientUser = require('./CreateClientUser');
const { CompanyEntity } = require('../../entities/company');
const {
    CreateClientCompany,
    CreateConsultingCompany,
} = require('../../usecase/company');
const date = require('../../helper/date');
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
                let consultantUserData = {
                    email: userEntity.email,
                    name: userEntity.name,
                    userType: userEntity.userType,
                    phoneNum: userParam.phoneNum,
                    profileState: '0',
                    createdAt: date.getDateTime(),
                };
                // 컨설턴트 유저 유효성 확인
                let consultantUserEntity = new ConsultantUserEntity(
                    consultantUserData
                );

                result = await this.Auth.signUp(userEntity); // 회원가입

                let createConsultantUser = new CreateConsultantUser(
                    this.Repository
                );
                createConsultantUser.excute(consultantUserEntity);
            } else {
                let companyData = {
                    businessLicenseNum: userParam.businessLicenseNum,
                    companyName: userParam.companyName,
                    presidentName: userParam.presidentName,
                    companyApprovalState: '0',
                    createdAt: date.getDateTime(),
                };
                // 기업(클라이언트, 컨설턴트) 정보 유효성 확인
                let companyEntity = new CompanyEntity(companyData);

                if (userType === '2') {
                    let consultantUserData = {
                        email: userEntity.email,
                        name: userEntity.name,
                        userType: userEntity.userType,
                        phoneNum: userParam.phoneNum,
                        profileState: '0',
                        createdAt: date.getDateTime(),
                    };
                    // 컨설턴트 유저 유효성 확인
                    let consultantUserEntity = new ConsultantUserEntity(
                        consultantUserData
                    );

                    let createConsultantUser = new CreateConsultantUser(
                        this.Repository
                    );
                    let createConsultingCompany = new CreateConsultingCompany(
                        this.Repository
                    );

                    result = await this.Auth.signUp(userEntity); // 회원가입
                    createConsultantUser.excute(consultantUserEntity); // 컨설턴트 유저생성
                    createConsultingCompany.excute(companyEntity); // 컨설턴트 기업생성
                } else {
                    let clientUserData = {
                        email: userEntity.email,
                        name: userEntity.name,
                        userType: userEntity.userType,
                        phoneNum: userParam.phoneNum,
                        createdAt: date.getDateTime(),
                    };
                    // 클라이언트 유저 유효성 확인
                    let clientUserEntity = new ClientUserEntity(clientUserData);

                    let createClientUser = new CreateClientUser(
                        this.Repository
                    );
                    let createClientCompany = new CreateClientCompany(
                        this.Repository
                    );

                    result = await this.Auth.signUp(userEntity); // 회원가입
                    createClientUser.excute(clientUserEntity); // 클라이언트 유저생성
                    createClientCompany.excute(companyEntity); // 클라이언트 기업생성
                }
            }
        } catch (error) {
            throw error;
        }
        return result;
    }
};
