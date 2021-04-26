'use strict';

const AuthEntity = require('./AuthEntity');
const { ParameterException } = require('../../exceptions');

module.exports = class extends AuthEntity {
    constructor({ email, password, name = nu, userType, phoneNum }) {
        super(email);
        this.password = password;
        this.name = name;
        this.userType = userType;
        this.phoneNum = phoneNum;
    }
    // password
    get password() {
        return this._password;
    }
    set password(password) {
        let regPwd = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식

        if (!regPwd.test(password)) {
            throw new ParameterException('비밀번호');
        } else {
            this._password = password;
        }
    }
    // name
    get name() {
        return this._name;
    }
    set name(name) {
        let regName = /^[a-zA-Z가-힣]{2,50}$/; // 이름 유효성 체크 : 한글, 영문 50자 이내

        if (!regName.test(name)) {
            throw new ParameterException('이름');
        } else {
            this._name = name;
        }
    }
    // userType
    get userType() {
        return this._userType;
    }
    set userType(userType) {
        let regUserType = /^[123]$/; // 사용자 타입 유효성 체크 : 1, 2, 3 만 사용

        if (!regUserType.test(userType)) {
            throw new ParameterException('사용자 타입');
        } else {
            this._userType = userType;
        }
    }
    // phoneNum
    get phoneNum() {
        return this._phoneNum;
    }
    set phoneNum(phoneNum) {
        let regPhoneNum = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
        //특수문자 / 문자 / 숫자 포함 형태의 8~20자리 이내의 암호 정규식

        if (!regPhoneNum.test(phoneNum)) {
            throw new ParameterException('연락처');
        } else {
            this._phoneNum = phoneNum;
        }
    }
};
