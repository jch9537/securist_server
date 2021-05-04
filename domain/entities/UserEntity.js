'use strict';

// const AuthEntity = require('./AuthEntity');
const { ParameterException } = require('../exceptions');
// /*
// type의 경우 위와 같이 형식을 나눠주는 것이 코드 가독성이 좋음
// const UpdateBankInfoEntityConfig = {
//     userType: {
//         PERSONAL_CONSULTANT : '1',
//     }
// }
// */
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
            let regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; // 유효성 체크 확인 : 영문, 숫자, 사용 가능한 특수문자(@.-_)외 입력, 30자 이하 체크!!

            if (
                !(email !== '' && email !== undefined && regEmail.test(email))
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
            let regPwd = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
            //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식

            if (!regPwd.test(password)) {
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
    // userType
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
    // phoneNum
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
    // bankName
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
    // bankAccountNum
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
    // bankAccountOwner
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
