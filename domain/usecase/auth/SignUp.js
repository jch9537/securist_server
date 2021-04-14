const { SignUpEntity } = require('../../entities/auth');
const { UserEntity } = require('../../entities/user');
const { CompanyEntity } = require('../../entities/company');
const { CreateUser } = require('../user');
const { CreateCompany } = require('../../usecase/company');

module.exports = class {
    constructor(Auth, Repository) {
        this.Auth = Auth;
        this.Repository = Repository;
    }
    async excute(userParam) {
        let result;
        let signUpData = {
            email: userParam.email,
            password: userParam.password,
            name: userParam.name,
            userType: userParam.userType,
        };
        let signUpEntity = new SignUpEntity(signUpData);
        let userType = signUpEntity.userType;
        //userType - 1: 개인 컨설턴트 2: 컨설팅업체 3: 클라이언트 기업
        try {
            let userData = {
                email: signUpEntity.email,
                name: signUpEntity.name,
                userType: signUpEntity.userType,
                phoneNum: userParam.phoneNum,
            };
            // 사용자 유효성 확인
            let userEntity = new UserEntity(userData);
            if (userType === '1') {
                //개인 처리
                result = await this.Auth.signUp(signUpEntity); // cognito 회원가입

                let createUser = new CreateUser(this.Repository);
                createUser.excute(userEntity); // 사용자 생성
            } else {
                //기업 처리
                let companyData = {
                    userType: signUpEntity.userType,
                    businessLicenseNum: userParam.businessLicenseNum,
                    companyName: userParam.companyName,
                    presidentName: userParam.presidentName,
                };

                // 기업(클라이언트, 컨설턴트) 정보 유효성 확인
                let companyEntity = new CompanyEntity(companyData);

                let createUser = new CreateUser(this.Repository);
                let createCompany = new CreateCompany(this.Repository);

                result = await this.Auth.signUp(signUpEntity); // cognito 회원가입
                createUser.excute(userEntity); // 사용자 생성
                createCompany.excute(companyEntity); // 클라이언트/컨설턴트 기업생성
            }
        } catch (error) {
            throw error;
        }
        return result;
    }
};
