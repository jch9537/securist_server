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

// 추후 헬퍼함수 모듈로 변경
const idReg = /^[0-9]+$/;
const stateReg = /^[0-1]$/;
const examTypeReg = /^[12]$/; // 시험 타입 유효성 체크 : 1, 2 만 사용
const nameReg = /^[a-zA-Z가-힣]{0,20}$/;
const nameAndNumReg = /^[0-9a-zA-Z가-힣]{0,20}$/;
const NameAndSpecialStringReg = /^[0-9a-zA-Z가-힣!@#$%^&=_\+\-\(\)]+$/;
// const NameAndSpecialStringReg = /^[\w\W]{0,20}$/;
const passwordReg = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
//특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식
const textReg = /[^<>]+$/;
const dateReg = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
// const dateReg = /^([0-9]{4})[-/]?([0-9]{2})[-/]?([0-9]{2})$/;
// ex. 20210725, 2021-07-25, 2021/07/25 등
const timeReg = /^([0-2]{1})([0-9]{1}):?([0-5]{1})([0-9]{1})$/;
const phoneNumReg = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
//특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식
const emailReg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인 : 영문, 숫자, 사용 가능한 특수문자(@.-_)외 입력, 30자 이하 체크!!

module.exports = class UserEntity {
    constructor({
        email = null,
        password = null,
        name = null,
        userType = null,
        phoneNum = null,
        bankName = null,
        bankAccountNum = null,
        bankAccountOwner = null,
        code = null,
        withdrawalType = null,
    }) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.userType = userType;
        this.phoneNum = phoneNum;
        this.bankName = bankName;
        this.bankAccountNum = bankAccountNum;
        this.bankAccountOwner = bankAccountOwner;
        this.code = code;
        this.withdrawalType = withdrawalType;
    }
    // email
    get email() {
        return this._email;
    }
    set email(email) {
        if (email !== null) {
            if (
                !(email !== '' && email !== undefined && emailReg.test(email))
            ) {
                console.log('----------------------------', email);
                throw new ParameterException('이메일');
            } else {
                this._email = email;
            }
        } else {
            this._email = email;
        }
    }
    // password
    get password() {
        return this._password;
    }
    set password(password) {
        if (password !== null) {
            if (!passwordReg.test(password)) {
                throw new ParameterException('비밀번호');
            } else {
                this._password = password;
            }
        } else {
            this._password = password;
        }
    }
    // name
    get name() {
        return this._name;
    }
    set name(name) {
        if (name !== null) {
            if (!nameReg.test(name)) {
                throw new ParameterException('이름');
            } else {
                this._name = name;
            }
        } else {
            this._name = name;
        }
    }
    // userType
    get userType() {
        return this._userType;
    }
    set userType(userType) {
        if (userType !== null) {
            let userTypeReg = /^[123]$/; // 사용자 타입 유효성 체크 : 1, 2, 3 만 사용

            if (!userTypeReg.test(userType)) {
                throw new ParameterException('사용자 타입');
            } else {
                this._userType = Number(userType);
            }
        } else {
            this._userType = Number(userType);
        }
    }
    // phoneNum
    get phoneNum() {
        return this._phoneNum;
    }
    set phoneNum(phoneNum) {
        if (phoneNum !== null) {
            if (!phoneNumReg.test(phoneNum)) {
                throw new ParameterException('연락처');
            } else {
                this._phoneNum = phoneNum;
            }
        } else {
            this._phoneNum = phoneNum;
        }
    }
    // bankName
    get bankName() {
        return this._bankName;
    }
    set bankName(bankName) {
        if (bankName !== null) {
            if (!nameReg.test(bankName)) {
                throw new ParameterException('은행명');
            } else {
                this._bankName = bankName;
            }
        } else {
            this._bankName = bankName;
        }
    }
    // bankAccountNum
    get bankAccountNum() {
        return this._bankAccountNum;
    }
    set bankAccountNum(bankAccountNum) {
        if (bankAccountNum !== null) {
            let bankAccountNumReg = /^[0-9]{2,10}$/; // 계좌번호 유효성 체크 : 수정해야함!!!!!!!!!!!!!

            if (!bankAccountNumReg.test(bankAccountNum)) {
                throw new ParameterException('계좌번호');
            } else {
                this._bankAccountNum = bankAccountNum;
            }
        } else {
            this._bankAccountNum = bankAccountNum;
        }
    }
    // bankAccountOwner
    get bankAccountOwner() {
        return this._bankAccountOwner;
    }
    set bankAccountOwner(bankAccountOwner) {
        if (bankAccountOwner !== null) {
            if (!nameReg.test(bankAccountOwner)) {
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
            let codeReg = /^(?=[0-9]{6}$)/;
            //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식  : 유효성 코드 필요한지 확인?!

            if (!codeReg.test(code)) {
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
            let withdrawalTypeReg = /^[0123]$/; // 탈퇴사유 타입 유효성 체크 : 0, 1, 2, 3 만 사용

            if (!withdrawalTypeReg.test(withdrawalType)) {
                throw new ParameterException('사용자 타입');
            } else {
                this._withdrawalType = Number(withdrawalType);
            }
        } else {
            this._withdrawalType = Number(withdrawalType);
        }
    }
};
