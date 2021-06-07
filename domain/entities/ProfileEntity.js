'use strict';

// const AuthEntity = require('./AuthEntity');
const { ParameterException } = require('../exceptions');
// /*
// type의 경우 위와 같이 형식을 나눠주는 것이 코드 가독성이 좋음
// const UpdateBankInfoEntityConfig = {
//     userType: {
//         PERSONAL_CONSULTANT : 1,
//     }
// }
// */
module.exports = class UserEntity {
    /*
    {"introduce":"자기소개 시작",
    "abilityCertifications":[{"certificationId":1,"certificationName":"ISMS-P"}, 
                             { "certificationId":9,"certificationName":"KSMS-K" }],
    "abilityIndustries":[{"industryId":2,"industryName":"쇼핑몰"}],
    "abilityTasks":[{"taskId":3,"taskName":"세부과제1","taskGroupType":1}],
    "academicBackground":{"finalAcademicType":0,"schoolName":"이지시큐대학","majorName":"정보보안학과",
        "graduationClassificationType":0, "admissionDate": "2020-01-01", "graduateDate": "2020-02-01"},
    "career":[{"companyName":"무신사","position":"PM","assignedWork":"관리","joiningDate":"2021-02-01",
        "resignationDate":"2021-03-01"}],
    "license":[{"licenseName":"CPPG","licenseNum":"123456789","issueInstitution":"정보보안학회",
        "issuedDate":"2020-12-01"}],
    "projectHistory":[{"projectName":"무신사쇼핑몰","assignedTask":"관리","industryCategoryId": 3,
        "industryCategoryName":"쇼핑몰","projectStartDate":"2021-02-01","projectEndDate":"2021-03-01"}],
    "etc":{"etcCertifications":"iso27001","etcIndustries":"병원"}}
     */
    constructor({
        introduce = '',
        abilityCertifications = [],
        abilityIndustries = [],
        abilityTasks = [],
        academicBackground = {},
        career = [],
        license = [],
        projectHistory = [],
        etc = {},
    }) {
        this.introduce = introduce;
        this.abilityCertifications = abilityCertifications;
        this.abilityIndustries = abilityIndustries;
        this.abilityTasks = abilityTasks;
        this.academicBackground = academicBackground;
        this.career = career;
        this.license = license;
        this.projectHistory = projectHistory;
        this.etc = etc;
    }
    // introduce
    get introduce() {
        return this._introduce;
    }
    set introduce(introduce) {
        if (introduce !== '') {
            let regIntroduce = /^.*$/; // 유효성 체크 확인 : 한글/영어/숫자/특수문자
            if (
                !(
                    introduce !== '' &&
                    introduce !== undefined &&
                    regIntroduce.test(introduce)
                )
            ) {
                console.log('----------------------------', introduce);
                throw new ParameterException('자기소개');
            } else {
                this._introduce = introduce;
            }
        } else {
            this._introduce = introduce;
        }
    }
    // abilityCertifications
    get abilityCertifications() {
        return this._abilityCertifications;
    }
    set abilityCertifications(abilityCertifications) {
        if (!abilityCertifications.length) {
            let regPwd = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
            //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식

            if (!regPwd.test(abilityCertifications)) {
                throw new ParameterException('비밀번호');
            } else {
                this._abilityCertifications = abilityCertifications;
            }
        } else {
            this._abilityCertifications = abilityCertifications;
        }
    }
    // name
    get name() {
        return this._name;
    }
    set name(name) {
        if (name !== null) {
            let regName = /^[a-zA-Z가-힣]{2,50}$/; // 이름 유효성 체크 : 한글, 영문 50자 이내

            if (!regName.test(name)) {
                throw new ParameterException('이름');
            } else {
                this._name = name;
            }
        } else {
            this._name = name;
        }
    }
    // abilityTasks
    get userType() {
        return this._userType;
    }
    set userType(userType) {
        if (userType !== null) {
            let regUserType = /^[123]$/; // 사용자 타입 유효성 체크 : 1, 2, 3 만 사용

            if (!regUserType.test(userType)) {
                throw new ParameterException('사용자 타입');
            } else {
                this._userType = userType;
            }
        } else {
            this._userType = userType;
        }
    }
    // academicBackground
    get phoneNum() {
        return this._phoneNum;
    }
    set phoneNum(phoneNum) {
        if (phoneNum !== null) {
            let regPhoneNum = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
            //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식

            if (!regPhoneNum.test(phoneNum)) {
                throw new ParameterException('연락처');
            } else {
                this._phoneNum = phoneNum;
            }
        } else {
            this._phoneNum = phoneNum;
        }
    }
    // career
    get bankName() {
        return this._bankName;
    }
    set bankName(bankName) {
        if (bankName !== null) {
            let regBankName = /^[a-zA-Z가-힣]{2,50}$/; // 은행명 유효성 체크 : 한글, 영문 50자 이내

            if (!regBankName.test(bankName)) {
                throw new ParameterException('은행명');
            } else {
                this._bankName = bankName;
            }
        } else {
            this._bankName = bankName;
        }
    }
    // license
    get bankAccountNum() {
        return this._bankAccountNum;
    }
    set bankAccountNum(bankAccountNum) {
        if (bankAccountNum !== null) {
            let regBankAccountNum = /^[0-9]{2,30}$/; // 계좌번호 유효성 체크 : 수정해야함!!!!!!!!!!!!!

            if (!regBankAccountNum.test(bankAccountNum)) {
                throw new ParameterException('계좌번호');
            } else {
                this._bankAccountNum = bankAccountNum;
            }
        } else {
            this._bankAccountNum = bankAccountNum;
        }
    }
    // projectHistory
    get bankAccountOwner() {
        return this._bankAccountOwner;
    }
    set bankAccountOwner(bankAccountOwner) {
        if (bankAccountOwner !== null) {
            let regBankAccountOwner = /^[a-zA-Z가-힣]{2,50}$/; // 계좌주 유효성 체크 : 한글, 영문 50자 이내

            if (!regBankAccountOwner.test(bankAccountOwner)) {
                throw new ParameterException('계좌주');
            } else {
                this._bankAccountOwner = bankAccountOwner;
            }
        } else {
            this._bankAccountOwner = bankAccountOwner;
        }
    }
    get code() {
        return this._code;
    }
    set code(code) {
        if (code !== null) {
            let regCode = /^(?=[0-9]{6}$)/;
            //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식  : 유효성 코드 필요한지 확인?!

            if (!regCode.test(code)) {
                throw new ParameterException('code');
            } else {
                this._code = code;
            }
        } else {
            this._code = code;
        }
    }
    // withdrawalType
    get withdrawalType() {
        return this._withdrawalType;
    }
    set withdrawalType(withdrawalType) {
        if (withdrawalType !== null) {
            let regWithdrawalType = /^[0123]$/; // 탈퇴사유 타입 유효성 체크 : 0, 1, 2, 3 만 사용

            if (!regWithdrawalType.test(withdrawalType)) {
                throw new ParameterException('사용자 타입');
            } else {
                this._withdrawalType = withdrawalType;
            }
        } else {
            this._withdrawalType = withdrawalType;
        }
    }
};
